import React, { useState, useEffect } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

interface AuthPanelProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, firstname: string, lastname: string) => void;
}

export function AuthPanel({ onLogin, onRegister }: AuthPanelProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    if (successMessage) {
      // Esperar 2 segundos antes de mostrar el chat
      setTimeout(() => {
        setIsChatVisible(true);
      }, 2000); // Tiempo de espera antes de mostrar el chat
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await onLogin(email, password);
    } else {
      try {
        await onRegister(email, password, firstname, lastname);
        setSuccessMessage("Usuario creado exitosamente");
        setTimeout(() => {
          setSuccessMessage(""); // El mensaje desaparece después de 3 segundos
        }, 3000);
      } catch (error) {
        console.error("Error al registrar:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-slideIn">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {isLogin ? "Inicio De Sesion" : "Registrate"}
        </h2>

        {/* Notificación de éxito */}
        {successMessage && (
          <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 w-full max-w-md">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nombre"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  required
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  required
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Correo Electronico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
            />
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 text-white text-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLogin ? "Iniciar Sesion" : "Registrarse"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isLogin ? "¿No tienes cuenta? Registrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>

      {/* El componente del chat solo se muestra después de 2 segundos */}
      {isChatVisible && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
          {/* Aquí el código para tu chat rápido */}
          <p>Chat rápido</p>
        </div>
      )}
    </div>
  );
}
