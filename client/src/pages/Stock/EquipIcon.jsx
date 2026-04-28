import React from "react";

// ── Composant Avatar pour les équipements (icône si pas de photo) ──
const EquipIcon = ({ icon, photo, name, color }) => {
  const [imgError, setImgError] = React.useState(false);

  if (photo && !imgError) {
    return (
      <img
        src={photo}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center w-full h-full text-3xl"
      style={{ backgroundColor: `${color}20` }}
    >
      {icon || "🏥"}
    </div>
  );
};

export default EquipIcon;
