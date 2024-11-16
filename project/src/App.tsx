import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ContactsList } from "./components/ContactsList";
import { AuthPanel } from "./components/AuthPanel";
import { Header } from "./components/Header";
import { Menu, X } from "lucide-react";
import axios from "axios";
import questions from "./data/questions.json";
import contactsData from "./data/contacts.json";

const initialMessages = [
  {
    id: "1",
    content: "¡Bienvenido al cuestionario de Cassandra! ¿Listo para comenzar?",
    sender: "Bot",
    timestamp: new Date(),
    isOwn: false,
    options: [
      { label: "Comenzar cuestionario", action: "start_quiz" },
      { label: "Ver mi cuenta", action: "check_account" },
      { label: "Cerrar sesión", action: "logout" },
    ],
  },
];



function App() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [contacts, setContacts] = useState<any[]>(contactsData);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [showLoginAfterRegister, setShowLoginAfterRegister] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setQuestionsData(questions);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://192.168.100.66:5000/api/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const userData = {
          id: response.data.user.id,
          firstname: response.data.user.firstname,
          lastname: response.data.user.lastname,
          email: response.data.user.email,
          token: response.data.token,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setShowLoginAfterRegister(false);
      } else {
        alert("Credenciales incorrectas. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error al iniciar sesión. Por favor, revisa tu conexión.");
    }
  };

  const handleRegister = async (email: string, password: string, firstname: string, lastname: string) => {
    try {
      const response = await axios.post("http://192.168.100.66:5000/api/users", {
        email,
        password,
        firstname,
        lastname,
      });

      if (response.status === 201) {
        const newUser = {
          id: response.data.id,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
        };

        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        setShowSuccessMessage(true);

        await handleLogin(email, password);

        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        alert("Error al registrar. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("No se pudo crear la cuenta. Revisa los datos ingresados.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessages(initialMessages);
    setSelectedContact(null);
    localStorage.removeItem("user");
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: "You",
      timestamp: new Date(),
      isOwn: true,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
    setIsSidebarOpen(false);
  };

  const showNextQuestion = () => {
    const nextQuestion = questionsData[questionIndex];
    if (nextQuestion) {
      const questionNumber = questionIndex + 1;
      const totalQuestions = questionsData.length;

      const botMessage = {
        id: Date.now().toString(),
        content: `Pregunta ${questionNumber}/${totalQuestions}: ${nextQuestion.question}`,
        sender: "Bot",
        timestamp: new Date(),
        isOwn: false,
        options: nextQuestion.options.map((option) => ({
          label: option,
          action: `answer_${option}`,
          disabled: isQuestionAnswered,
        })),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsQuestionAnswered(false);
    } else {
      const resultMessage = {
        id: Date.now().toString(),
        content: `¡Has contestado ${correctAnswers}/${questionsData.length} preguntas correctamente!`,
        sender: "Bot",
        timestamp: new Date(),
        isOwn: false,
      };
      const thankYouMessage = {
        id: Date.now().toString() + 1,
        content: "¡Gracias por hacer el cuestionario de Cassandra!",
        sender: "Bot",
        timestamp: new Date(),
        isOwn: false,
      };
      setMessages((prevMessages) => [...prevMessages, resultMessage, thankYouMessage]);
    }
  };

  const handleOptionSelect = (action: string) => {
    if (isQuestionAnswered) return;

    if (action === "start_quiz") {
      if (questionIndex === 0 && messages[messages.length - 1].content !== questionsData[0].question) {
        showNextQuestion();
      }
    } else if (action === "logout") {
      handleLogout();
    } else if (action.startsWith("answer_")) {
      const selectedAnswer = action.replace("answer_", "");
      const currentQuestion = questionsData[questionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

      const responseMessage = {
        id: Date.now().toString(),
        content: `${isCorrect ? "¡Correcto! 🎉" : "Incorrecto."} ${currentQuestion.explanation}`,
        sender: "Bot",
        timestamp: new Date(),
        isOwn: false,
      };

      setMessages((prevMessages) => [...prevMessages, responseMessage]);
      setIsQuestionAnswered(true);

      if (isCorrect) {
        setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
      }

      setTimeout(() => {
        const nextIndex = questionIndex + 1;
        setQuestionIndex(nextIndex);
      }, 2000);
    }
  };

  useEffect(() => {
    if (questionIndex > 0) {
      showNextQuestion();
    }
  }, [questionIndex]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setIsChatVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user && !showLoginAfterRegister) {
    return <AuthPanel onLogin={handleLogin} onRegister={handleRegister} />;
  }

  if (showLoginAfterRegister) {
    return <AuthPanel onLogin={handleLogin} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full h-screen md:h-[600px] md:max-w-5xl bg-white md:rounded-lg shadow-lg flex relative overflow-hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-3 left-3 z-50 p-2 rounded-md hover:bg-gray-100"
        >
          {isSidebarOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
        </button>

        <div
          className={`absolute md:relative w-80 h-full bg-white transform transition-transform duration-300 ease-in-out z-40 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <ContactsList contacts={contacts} onSelectContact={handleContactSelect} selectedContactId={selectedContact?.id} />
        </div>

        {isChatVisible && (
          <div className="flex-1 flex flex-col">
            <Header
              user={user}
              selectedContactName={selectedContact ? `${selectedContact.firstname} ${selectedContact.lastname}` : ""}
              onLogout={handleLogout}
            />
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} onOptionSelect={handleOptionSelect} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
