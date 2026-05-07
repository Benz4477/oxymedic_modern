import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle, Plus, Trash2, Phone, Mail, Calendar, User } from "lucide-react";
import crmService from "../services/crmService";

const TasksList = ({ compact = false }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    type: "other",
    priority: "moyenne",
    dueDate: "",
    assignedTo: "",
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await crmService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Erreur chargement tâches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await crmService.toggleTask(id);
      loadTasks();
    } catch (error) {
      console.error("Erreur toggle tâche:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await crmService.deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error("Erreur suppression tâche:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await crmService.createTask(newTask);
      setShowModal(false);
      setNewTask({ title: "", type: "other", priority: "moyenne", dueDate: "", assignedTo: "" });
      loadTasks();
    } catch (error) {
      console.error("Erreur création tâche:", error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "call": return <Phone size={16} className="text-blue-600" />;
      case "email": return <Mail size={16} className="text-purple-600" />;
      case "delivery": return <Calendar size={16} className="text-amber-600" />;
      case "contract": return <User size={16} className="text-emerald-600" />;
      default: return <Clock size={16} className="text-slate-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "haute": return "bg-red-100 text-red-700";
      case "moyenne": return "bg-amber-100 text-amber-700";
      case "basse": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const displayTasks = compact ? tasks.slice(0, 5) : tasks;

  if (loading) {
    return <div className="text-slate-500">Chargement...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          {compact ? "Tâches récentes" : "Tâches CRM"}
        </h2>
        {!compact && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
          >
            <Plus size={14} />
            Nouvelle tâche
          </button>
        )}
      </div>

      <div className="p-6">
        {displayTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            Aucune tâche pour le moment
          </div>
        ) : (
          <div className="space-y-3">
            {displayTasks.map((task) => (
              <div
                key={task._id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  task.done ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-slate-200 hover:border-emerald-300"
                } transition`}
              >
                <button
                  onClick={() => handleToggle(task._id)}
                  className={`p-2 rounded-lg transition ${
                    task.done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600"
                  }`}
                >
                  <CheckCircle size={20} />
                </button>

                <div className="p-2 bg-slate-100 rounded-lg">
                  {getTypeIcon(task.type)}
                </div>

                <div className="flex-1">
                  <p className={`font-medium ${task.done ? "line-through text-slate-500" : "text-slate-800"}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    {task.assignedTo && (
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {task.assignedTo}
                      </span>
                    )}
                  </div>
                </div>

                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>

                {!task.done && task.dueDate && new Date(task.dueDate) < new Date() && (
                  <span className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    En retard
                  </span>
                )}

                {!compact && (
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Nouvelle Tâche */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Nouvelle tâche</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="call">Appel</option>
                  <option value="email">Email</option>
                  <option value="delivery">Livraison</option>
                  <option value="contract">Contrat</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="haute">Haute</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="basse">Basse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date d'échéance</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigné à</label>
                <input
                  type="text"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
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

export default TasksList;
