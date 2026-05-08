import React from "react";

const TABS = [
  { id: "taches",       label: "✅ Tâches" },
  { id: "interactions", label: "📋 Interactions" },
  { id: "segments",     label: "🏷️ Segments clients" },
];

const CrmTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex gap-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-2">
    {TABS.map(tab => (
      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
        className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition ${
          activeTab === tab.id
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "text-slate-500 hover:bg-slate-50"
        }`}>
        {tab.label}
      </button>
    ))}
  </div>
);

export default CrmTabs;