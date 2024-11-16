import React, { useState, useEffect } from "react";
import { Mail, Lock, User } from "lucide-react";

interface AuthPanelProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, firstname: string, lastname: string) => Promise<void>;
}

export function AuthPanel({ onLogin, onRegister }: AuthPanelProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    if (successMessage) {
      // Mostrar el chat después de 2 segundos
      setTimeout(() => {
        setIsChatVisible(true);
      }, 2000);
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Limpiar mensajes previos

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onRegister(email, password, firstname, lastname);
        setSuccessMessage("Usuario creado exitosamente");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      setErrorMessage("Error en la autenticación. Por favor, inténtalo de nuevo.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-slideIn">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {isLogin ? "Inicio de Sesión" : "Regístrate"}
        </h2>

        {/* Notificación de éxito */}
        {successMessage && (
          <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg shadow-lg w-full max-w-md text-center">
            {successMessage}
          </div>
        )}

        {/* Notificación de error */}
        {errorMessage && (
          <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg w-full max-w-md text-center">
            {errorMessage}
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
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white text-lg transition-all focus:outline-none ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>

      {isChatVisible && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
          <p>Chat rápido</p>
        </div>
      )}
    </div>
  );
}
