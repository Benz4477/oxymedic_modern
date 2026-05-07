import React, { useState, useEffect } from "react";
import { Phone, Mail, Calendar, User, Plus, Trash2, Clock } from "lucide-react";
import crmService from "../services/crmService";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "other",
    date: "",
    client: "",
    notes: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await crmService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Erreur chargement événements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await crmService.deleteEvent(id);
      loadEvents();
    } catch (error) {
      console.error("Erreur suppression événement:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await crmService.createEvent(newEvent);
      setShowModal(false);
      setNewEvent({ title: "", type: "other", date: "", client: "", notes: "" });
      loadEvents();
    } catch (error) {
      console.error("Erreur création événement:", error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "call": return <Phone size={16} className="text-blue-600" />;
      case "email": return <Mail size={16} className="text-purple-600" />;
      case "meeting": return <Calendar size={16} className="text-amber-600" />;
      case "visit": return <User size={16} className="text-emerald-600" />;
      default: return <Clock size={16} className="text-slate-600" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "call": return "Appel";
      case "email": return "Email";
      case "meeting": return "Réunion";
      case "visit": return "Visite";
      default: return "Autre";
    }
  };

  if (loading) {
    return <div className="text-slate-500">Chargement...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Événements & Interactions</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
        >
          <Plus size={14} />
          Nouvel événement
        </button>
      </div>

      <div className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            Aucun événement pour le moment
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 transition"
              >
                <div className="p-2 bg-slate-100 rounded-lg mt-1">
                  {getTypeIcon(event.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-slate-800">{event.title}</p>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                      {getTypeLabel(event.type)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {event.date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(event.date).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    {event.client && (
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {typeof event.client === "object" 
                          ? `${event.client.prenom} ${event.client.nom}`
                          : event.client}
                      </span>
                    )}
                  </div>

                  {event.notes && (
                    <p className="mt-2 text-sm text-slate-600">{event.notes}</p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(event._id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Nouvel Événement */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Nouvel événement</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="call">Appel</option>
                  <option value="email">Email</option>
                  <option value="meeting">Réunion</option>
                  <option value="visit">Visite</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client (ID)</label>
                <input
                  type="text"
                  value={newEvent.client}
                  onChange={(e) => setNewEvent({ ...newEvent, client: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsList;
