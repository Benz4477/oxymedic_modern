import express from "express";
import * as ctrl from "../controllers/crmController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// KPIs
router.get("/kpis",            protect, ctrl.getKpis);

// Events (interactions)
router.get("/events",          protect, ctrl.getEvents);
router.post("/events",         protect, ctrl.createEvent);
router.delete("/events/:id",   protect, ctrl.deleteEvent);

// Tasks
router.get("/tasks",           protect, ctrl.getTasks);
router.post("/tasks",          protect, ctrl.createTask);
router.patch("/tasks/:id/toggle", protect, ctrl.toggleTask);
router.delete("/tasks/:id",    protect, ctrl.deleteTask);

// Segments clients
router.get("/segments",        protect, ctrl.getSegments);

// Renouvellements à venir
router.get("/renouvellements", protect, ctrl.getRenouvellements);

export default router;