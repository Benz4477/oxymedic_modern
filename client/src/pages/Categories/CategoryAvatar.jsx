import React from "react";

// Composant d'avatar pour catégorie
const CategoryAvatar = ({ name, color }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {initial}
    </div>
  );
};

export default CategoryAvatar;
