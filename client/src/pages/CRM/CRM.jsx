import React, { useState, useEffect } from "react";
import { Users, Calendar, CheckCircle, AlertCircle, Phone, Mail, Clock, Plus, ArrowRight } from "lucide-react";
import crmService from "./services/crmService";
import KPIsCard from "./components/KPIsCard";
import TasksList from "./components/TasksList";
import EventsList from "./components/EventsList";
import SegmentsView from "./components/SegmentsView";
import RenouvellementsView from "./components/RenouvellementsView";

const CRM = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    try {
      const data = await crmService.getKpis();
      setKpis(data);
    } catch (error) {
      console.error("Erreur chargement KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: Users },
    { id: "tasks", label: "Tâches", icon: CheckCircle },
    { id: "events", label: "Événements", icon: Calendar },
    { id: "segments", label: "Segments", icon: Users },
    { id: "renouvellements", label: "Renouvellements", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">CRM - Relation Client</h1>
            <p className="text-sm text-slate-500 mt-1">Gestion de la relation client et suivi des interactions</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
              <Plus size={16} />
              Nouvelle action
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Chargement...</div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* KPIs */}
                <KPIsCard kpis={kpis} />
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone size={20} className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-800">Appel client</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Enregistrer un appel téléphonique</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                      Nouvel appel
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Mail size={20} className="text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-slate-800">Email</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Envoyer un email à un client</p>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm">
                      Nouvel email
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Calendar size={20} className="text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-slate-800">Rendez-vous</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Planifier un rendez-vous</p>
                    <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm">
                      Nouveau RDV
                    </button>
                  </div>
                </div>

                {/* Recent Tasks */}
                <TasksList compact />
              </div>
            )}

            {activeTab === "tasks" && <TasksList />}
            {activeTab === "events" && <EventsList />}
            {activeTab === "segments" && <SegmentsView />}
            {activeTab === "renouvellements" && <RenouvellementsView />}
          </>
        )}
      </div>
    </div>
  );
};

export default CRM;