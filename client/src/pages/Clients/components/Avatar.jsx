// src/pages/Clients/components/Avatar.jsx
import React from "react";

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-800",
  "bg-blue-100 text-blue-800",
  "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
];

const Avatar = ({ prenom = "", nom = "" }) => {
  const initials = ((prenom[0] || "") + (nom[0] || "")).toUpperCase();
  const colorClass = AVATAR_COLORS[(initials.charCodeAt(0) || 0) % AVATAR_COLORS.length];

  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ring-2 ring-white ${colorClass}`}
    >
      {initials || "?"}
    </div>
  );
};

export default Avatar;