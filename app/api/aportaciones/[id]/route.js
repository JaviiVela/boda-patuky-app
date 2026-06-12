// app/api/aportaciones/[id]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../src/lib/mongodb";
import Aportacion from "../../../../src/models/Aportacion";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();
    await Aportacion.findByIdAndDelete(id);
    return NextResponse.json({ message: "Aportación eliminada" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
