import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../src/lib/mongodb";
import Aportacion from "../../../../src/models/Aportacion";

export async function DELETE(request, { params }) {
  try {
    // ¡LA CLAVE ESTÁ AQUÍ! Ahora params debe tener un 'await'
    const { id } = await params;

    await connectToDatabase();

    const registroBorrado = await Aportacion.findByIdAndDelete(id);

    if (!registroBorrado) {
      return NextResponse.json(
        { error: "No se encontró el ID en la base de datos" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Aportación eliminada correctamente" });
  } catch (error) {
    console.error("Error en el backend al borrar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al eliminar" },
      { status: 500 },
    );
  }
}
