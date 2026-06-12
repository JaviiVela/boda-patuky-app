// app/api/aportaciones/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../src/lib/mongodb";
import Aportacion from "../../../src/models/Aportacion";

export async function GET() {
  try {
    await connectToDatabase();
    const aportaciones = await Aportacion.find({}).sort({ fecha: -1 });
    return NextResponse.json(aportaciones);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener datos" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const nuevaAportacion = await Aportacion.create(body);
    return NextResponse.json(nuevaAportacion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
