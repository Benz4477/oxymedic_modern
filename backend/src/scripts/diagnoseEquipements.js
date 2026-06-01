import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Equipement from "../models/Equipement.js";
import connectDB from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const diagnose = async () => {
  await connectDB();
  const eq = await Equipement.find({}).lean();
  eq.forEach(e => {
    console.log(`ID: ${e.id}, Name: ${e.name}, cat: ${e.cat}, keys: ${Object.keys(e).join(', ')}`);
  });
  process.exit(0);
};

diagnose();
