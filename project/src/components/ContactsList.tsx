import React, { useState } from "react";
import { Search, Circle } from "lucide-react";
import type { Contact } from "../types";
import { formatDistanceToNow } from "date-fns";

interface ContactsListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  selectedContactId?: string;
}

export function ContactsList({
  contacts,
  onSelectContact,
  selectedContactId,
}: ContactsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastname.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "online":
        return "text-green-500";
      case "away":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="h-full border-r border-gray-100 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedContactId === contact.id ? "bg-blue-50" : ""
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={contact.avatar}
                alt={contact.firstname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <Circle
                fill="currentColor"
                className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(contact.status)}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 truncate">
                  {contact.firstname} {contact.lastname}
                </h3>
                {contact.unreadCount ? (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {contact.unreadCount}
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {contact.status === "online"
                  ? "Online"
                  : `Last seen ${formatDistanceToNow(contact.lastSeen, { addSuffix: true })}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

