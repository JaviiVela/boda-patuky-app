// src/app/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Trash2, DollarSign, Users, Package } from "lucide-react";

// 1. Definimos las interfaces para que TypeScript sepa qué datos esperar
interface Aportacion {
  _id: string;
  padrino: string;
  concepto: string;
  monto: number;
  nota: string;
}

interface DatosConcepto {
  name: string;
  Total: number;
}

interface DatosPadrino {
  name: string;
  value: number;
}

export default function Home() {
  // 2. Le indicamos a useState qué tipo de datos va a guardar usando <Aportacion[]>
  const [aportaciones, setAportaciones] = useState<Aportacion[]>([]);
  const [formData, setFormData] = useState({
    padrino: "",
    concepto: "",
    monto: "",
    nota: "",
  });

  const COLORES = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  useEffect(() => {
    fetchAportaciones();
  }, []);

  const fetchAportaciones = async () => {
    const res = await fetch("/api/aportaciones");
    const data = await res.json();
    setAportaciones(data);
  };

  // 3. Tipamos el evento del formulario (FormEvent)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/aportaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, monto: Number(formData.monto) }),
      });

      // Si la respuesta del servidor NO es exitosa (ej. error 500)
      if (!res.ok) {
        const errorData = await res.json();
        alert(`❌ Error del servidor: ${errorData.error}`);
        console.error("Detalles del error:", errorData);
        return;
      }

      // Si todo sale bien, limpiamos y recargamos
      setFormData({ padrino: "", concepto: "", monto: "", nota: "" });
      fetchAportaciones();
      alert("✅ ¡Aportación guardada con éxito!");
    } catch (error) {
      alert("❌ Error de red. Revisa la consola.");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este registro?")) {
      try {
        const res = await fetch(`/api/aportaciones/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(`❌ Error al borrar: ${errorData.error}`);
          return;
        }

        // Si se borró bien en BD, recargamos la lista visual
        fetchAportaciones();
      } catch (error) {
        alert("❌ Error de conexión al intentar borrar.");
      }
    }
  };

  const totalRecaudado = aportaciones.reduce(
    (sum, item) => sum + item.monto,
    0,
  );

  // 4. Tipamos los acumuladores (acc) del reduce
  const datosPorConcepto = aportaciones.reduce((acc: DatosConcepto[], item) => {
    const existente = acc.find(
      (x) => x.name.toLowerCase() === item.concepto.toLowerCase(),
    );
    if (existente) existente.Total += item.monto;
    else acc.push({ name: item.concepto, Total: item.monto });
    return acc;
  }, []);

  const datosPorPadrino = aportaciones.reduce((acc: DatosPadrino[], item) => {
    const existente = acc.find((x) => x.name === item.padrino);
    if (existente) existente.value += item.monto;
    else acc.push({ name: item.padrino, value: item.monto });
    return acc;
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Boda Patuky 💍
            </h1>
            <p className="text-slate-500">Gestor de Aportaciones</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
              Total Recaudado
            </p>
            <p className="text-4xl font-black text-emerald-600">
              ${totalRecaudado.toLocaleString()}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign size={20} /> Nuevo Registro
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Padrino / Amigo
                </label>
                <input
                  required
                  type="text"
                  value={formData.padrino}
                  onChange={(e) =>
                    setFormData({ ...formData, padrino: e.target.value })
                  }
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej. Primo Juan"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Concepto
                </label>
                <input
                  required
                  type="text"
                  value={formData.concepto}
                  onChange={(e) =>
                    setFormData({ ...formData, concepto: e.target.value })
                  }
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej. Comida, Banda..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Monto ($)
                </label>
                <input
                  required
                  type="number"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Nota (Opcional)
                </label>
                <textarea
                  value={formData.nota}
                  onChange={(e) =>
                    setFormData({ ...formData, nota: e.target.value })
                  }
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2}
                  placeholder="Ej. 2 horas de banda..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
              >
                Guardar Aportación
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase flex items-center gap-2">
                  <Package size={16} /> Por Concepto
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosPorConcepto}>
                      <XAxis
                        dataKey="name"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Bar
                        dataKey="Total"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase flex items-center gap-2">
                  <Users size={16} /> Por Padrino
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={datosPorPadrino}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {datosPorPadrino.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORES[index % COLORES.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-600">
                Historial de Aportaciones
              </div>
              <div className="divide-y divide-slate-100">
                {aportaciones.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        {item.padrino}{" "}
                        <span className="text-slate-400 font-normal text-sm">
                          apoyó con
                        </span>{" "}
                        {item.concepto}
                      </p>
                      {item.nota && (
                        <p className="text-sm text-slate-500 italic mt-1">
                          {item.nota}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <span className="font-black text-lg text-slate-700">
                        ${item.monto}
                      </span>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {aportaciones.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    Aún no hay registros. ¡Empieza a agregar aportaciones!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
