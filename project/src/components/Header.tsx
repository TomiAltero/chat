import React from "react";
import { LogOut, Settings } from "lucide-react";
import type { User } from "../types";

interface HeaderProps {
  user: User;
  selectedContactName?: string;
  onLogout: () => void;
  isMobile: boolean;
}

export function Header({
  user,
  selectedContactName,
  onLogout,
  isMobile,
}: HeaderProps) {
  // Mostrar "Selecciona un contacto" si no hay un contacto seleccionado
  const displayContactName = selectedContactName || "Selecciona un contacto";

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <h1
        className={`text-xl font-semibold text-gray-800 ${isMobile ? "ml-12" : ""}`}
      >
        {displayContactName}
      </h1>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
            }
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user.name}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
