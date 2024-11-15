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
    content: "Hey there! 👋",
    sender: "Alice",
    timestamp: new Date(Date.now() - 3600000),
    isOwn: false,
  },
  {
    id: "2",
    content: "Hi! How are you?",
    sender: "You",
    timestamp: new Date(Date.now() - 3500000),
    isOwn: true,
  },
];

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false); // Controla la visibilidad del chat
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Controla la visibilidad del mensaje de éxito
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://192.168.0.75:5000/api/users");
        const users = response.data;
        console.log(users);
        const formattedContacts = users.map((user) => ({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          avatar:
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
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

  const handleLogin = (email, password) => {
    setUser({
      id: "1",
      firstname: "Tomas",
      lastname: "Altero",
      email,
    });
  };

  const handleRegister = async (email, password, firstname, lastname) => {
    try {
      const response = await axios.post("http://192.168.0.75:5000/api/users", {
        email,
        password,
        firstname,
        lastname,
      });

      if (response.status === 201) {
        setUser({
          id: response.data.id,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
        });

        // Mostrar el mensaje de éxito
        setShowSuccessMessage(true);

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        console.error("Error en el registro:", response.data);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessages(initialMessages);
    setSelectedContact(null);
  };

  const handleSendMessage = (content) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: "You",
      timestamp: new Date(),
      isOwn: true,
    };
    setMessages([...messages, newMessage]);
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsSidebarOpen(false);
  };

  // useEffect para controlar el retraso de la visibilidad del chat
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setIsChatVisible(true);
      }, 2000); // Espera 2 segundos antes de mostrar el chat

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
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>

        <div
          className={`absolute md:relative w-80 h-full bg-white transform transition-transform duration-300 ease-in-out z-40
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <ContactsList
            contacts={contacts}
            onSelectContact={handleContactSelect}
            selectedContactId={selectedContact?.id}
          />
        </div>

        {isChatVisible && ( // El chat solo se muestra cuando `isChatVisible` es true
          <div className="flex-1 flex flex-col">
            <Header
              user={user}
              selectedContactName={`${selectedContact?.firstname} ${selectedContact?.lastname}`}
              onLogout={handleLogout}
              isMobile={true}
            />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        )}

        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <h2 className="text-lg font-semibold text-green-600">Cuenta creada correctamente</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
