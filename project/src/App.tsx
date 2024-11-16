import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ContactsList } from "./components/ContactsList";
import { AuthPanel } from "./components/AuthPanel";
import { Header } from "./components/Header";
import { Menu, X } from "lucide-react";
import axios from "axios";

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

const initialQuestions = [
  {
    question: "¿Cómo seleccionar datos de una tabla en Cassandra?",
    options: [
      "SELECT * FROM tablename;",
      "GET * FROM tablename;",
      "FIND * FROM tablename;",
      "SELECT * FROM keyspace.tablename;"
    ],
    correctAnswer: "SELECT * FROM keyspace.tablename;",
    explanation: "En Cassandra, es necesario especificar el keyspace antes del nombre de la tabla para realizar una consulta completa."
  },
  {
    question: "¿Cómo crear una tabla en Cassandra?",
    options: [
      "CREATE TABLE tablename ❪column1 type, column2 type❫;",
      "CREATE table tablename ❪column1 type, column2 type❫;",
      "CREATE table keyspace.tablename ❪column1 type, column2 type❫;",
      "ADD TABLE keyspace.tablename ❪column1 type, column2 type❫;"
    ],
    correctAnswer: "CREATE table keyspace.tablename ❪column1 type, column2 type❫;",
    explanation: "Para crear una tabla en Cassandra, debes incluir tanto el keyspace como el nombre de la tabla y definir sus columnas con sus tipos correspondientes."
  },
  {
    question: "¿Cómo actualizar datos en Cassandra?",
    options: [
      "UPDATE tablename SET column1 = value WHERE condition;",
      "MODIFY tablename SET column1 = value WHERE condition;",
      "UPDATE tablename ADD column1 = value WHERE condition;",
      "CHANGE tablename SET column1 = value WHERE condition;"
    ],
    correctAnswer: "UPDATE tablename SET column1 = value WHERE condition;",
    explanation: "El comando correcto para actualizar datos en Cassandra es `UPDATE`, seguido del nombre de la tabla y la condición `WHERE`."
  },
  {
    question: "¿Cómo insertar datos en Cassandra?",
    options: [
      "INSERT INTO tablename ❪column1, column2❫ VALUES ❪value1, value2❫;",
      "PUT INTO tablename ❪column1, column2❫ VALUES ❪value1, value2❫;",
      "ADD INTO tablename ❪column1, column2❫ VALUES ❪value1, value2❫;",
      "SET INTO tablename ❪column1, column2❫ VALUES ❪value1, value2❫;"
    ],
    correctAnswer: "INSERT INTO tablename ❪column1, column2❫ VALUES ❪value1, value2❫;",
    explanation: "El comando correcto para insertar datos en Cassandra es `INSERT INTO`."
  },
  {
    question: "¿Cómo eliminar filas en Cassandra?",
    options: [
      "REMOVE FROM tablename WHERE condition;",
      "DELETE FROM tablename WHERE condition;",
      "ERASE FROM tablename WHERE condition;",
      "DROP FROM tablename WHERE condition;"
    ],
    correctAnswer: "DELETE FROM tablename WHERE condition;",
    explanation: "El comando correcto para eliminar filas en Cassandra es `DELETE FROM` seguido de la condición."
  },
  {
    question: "¿Cuál es la función de un 'keyspace' en Cassandra?",
    options: [
      "Define el esquema de una tabla.",
      "Almacena la configuración de la red.",
      "Agrupa varias tablas bajo un mismo esquema.",
      "Actúa como una base de datos temporal."
    ],
    correctAnswer: "Agrupa varias tablas bajo un mismo esquema.",
    explanation: "Un keyspace es el contenedor principal que define un grupo de tablas en Cassandra, similar a una base de datos en otros sistemas."
  },
  {
    question: "¿Qué tipo de consistencia garantiza la opción 'QUORUM' en Cassandra?",
    options: [
      "Lectura en un solo nodo.",
      "Lectura y escritura en la mayoría de los nodos.",
      "Lectura en todos los nodos.",
      "Lectura en dos nodos al mismo tiempo."
    ],
    correctAnswer: "Lectura y escritura en la mayoría de los nodos.",
    explanation: "La opción 'QUORUM' asegura que la mayoría de los nodos lean o escriban los datos, garantizando mayor consistencia."
  },
  {
    question: "¿Cómo definir una clave primaria compuesta en Cassandra?",
    options: [
      "PRIMARY KEY ❪column1, column2❫;",
      "PRIMARY KEY {column1, column2};",
      "KEY PRIMARY ❪column1, column2);",
      "COMPOSITE KEY ❪column1, column2❫;"
    ],
    correctAnswer: "PRIMARY KEY ❪column1, column2❫;",
    explanation: "Para definir una clave primaria compuesta, se utiliza la sintaxis `PRIMARY KEY (columna1, columna2)`."
  },
  {
    question: "¿Cómo se borra una tabla en Cassandra?",
    options: [
      "DROP TABLE keyspace.tablename;",
      "REMOVE TABLE keyspace.tablename;",
      "DELETE TABLE keyspace.tablename;",
      "CLEAR TABLE keyspace.tablename;"
    ],
    correctAnswer: "DROP TABLE keyspace.tablename;",
    explanation: "El comando correcto para borrar una tabla en Cassandra es `DROP TABLE` seguido del keyspace y nombre de la tabla."
  },
  {
    question: "¿Qué comando se usa para cambiar el tipo de replicación en un keyspace?",
    options: [
      "ALTER REPLICATION keyspace;",
      "UPDATE keyspace WITH replication;",
      "ALTER KEYSPACE keyspace WITH replication;",
      "MODIFY REPLICATION ON keyspace;"
    ],
    correctAnswer: "ALTER KEYSPACE keyspace WITH replication;",
    explanation: "Para cambiar la configuración de replicación de un keyspace, se utiliza `ALTER KEYSPACE` seguido de la configuración deseada."
  }
];

function App() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://192.168.100.66:5000/api/users");
        const users = response.data;
        const formattedContacts = users.map((user: any) => ({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          avatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
          status: "online",
          lastSeen: new Date(),
          unreadCount: 0,
        }));
        setContacts(formattedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

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
    // Eliminamos la lógica antigua de "ask_question"
  };

  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
    setIsSidebarOpen(false);
  };

  const showNextQuestion = () => {
    const nextQuestion = initialQuestions[questionIndex];
    if (nextQuestion) {
      const questionNumber = questionIndex + 1; // Número de la pregunta
      const totalQuestions = initialQuestions.length;

      const botMessage = {
        id: Date.now().toString(),
        content: `Pregunta ${questionNumber}/${totalQuestions}: ${nextQuestion.question}`,
        sender: "Bot",
        timestamp: new Date(),
        isOwn: false,
        options: nextQuestion.options.map((option) => ({
          label: option,
          action: `answer_${option}`,
        })),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };
  
  const handleOptionSelect = (action: string) => {
    if (action === "start_quiz") {
      if (questionIndex === 0 && messages[messages.length - 1].content !== initialQuestions[0].question) {
        showNextQuestion();
      }
    } else if (action === "logout") {
      handleLogout();
    } else if (action.startsWith("answer_")) {
      // Lógica para manejar las respuestas
      const selectedAnswer = action.replace("answer_", "");
      const currentQuestion = initialQuestions[questionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  
      const responseMessage = {
        id: Date.now().toString(),
        content: `${isCorrect ? "¡Correcto! 🎉" : "Incorrecto."} ${currentQuestion.explanation}`,
        sender: "Bot",
        timestamp: new Date(),
        isOwn: false,
      };
  
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
  
      // Depuración con console.log
      console.log('Question index antes de actualizar:', questionIndex);
  
      setTimeout(() => {
        const nextIndex = (questionIndex + 1) % initialQuestions.length;
        console.log('Question index después de actualizar:', nextIndex);
        
        setQuestionIndex(nextIndex);
      }, 2000);
    }
  };
  
  // Añade un hook useEffect para ejecutar showNextQuestion cuando questionIndex cambie
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

  if (!user) {
    return <AuthPanel onLogin={handleLogin} onRegister={handleRegister} />;
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

        {/* Sidebar de contactos */}
        <div
          className={`absolute md:relative w-80 h-full bg-white transform transition-transform duration-300 ease-in-out z-40 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <ContactsList contacts={contacts} onSelectContact={handleContactSelect} selectedContactId={selectedContact?.id} />
        </div>

        {/* Sección de chat */}
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
