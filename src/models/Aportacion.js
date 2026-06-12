// src/models/Aportacion.js
import mongoose from "mongoose";

// Definimos qué datos guardaremos. Al no usar catálogos, concepto es solo texto.
const AportacionSchema = new mongoose.Schema({
  padrino: { type: String, required: true },
  concepto: { type: String, required: true },
  monto: { type: Number, required: true },
  nota: { type: String, default: "" },
  fecha: { type: Date, default: Date.now },
});

// Evitamos que Next.js compile el modelo múltiples veces
export default mongoose.models.Aportacion ||
  mongoose.model("Aportacion", AportacionSchema);
