"use client";

import { useState } from "react";
import { DollarSign, Save, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CashForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tipo: "Egreso",
        categoria: "Gastos Generales",
        descripcion: "",
        monto: "",
        metodoPago: "Efectivo"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/cashflow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Error guardando movimiento");

            setFormData({
                tipo: "Egreso",
                categoria: "Gastos Generales",
                descripcion: "",
                monto: "",
                metodoPago: "Efectivo"
            });
            router.refresh();

        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const isIngreso = formData.tipo === "Ingreso";

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                Registrar Nuevo Movimiento
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Selector Tipo */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipo: "Ingreso" })}
                        className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${isIngreso ? 'bg-green-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'}`}
                    >
                        <TrendingUp className="h-4 w-4" /> Ingreso Extra
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipo: "Egreso" })}
                        className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${!isIngreso ? 'bg-red-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'}`}
                    >
                        <TrendingDown className="h-4 w-4" /> Gasto / Retiro
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                        <select
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        >
                            {isIngreso ? (
                                <>
                                    <option>Venta Extra</option>
                                    <option>Aporte de Capital</option>
                                    <option>Ajuste de Caja</option>
                                    <option>Otros Ingresos</option>
                                </>
                            ) : (
                                <>
                                    <option>Gastos Generales</option>
                                    <option>Servicios (Luz/Internet)</option>
                                    <option>Alquiler</option>
                                    <option>Retiro de Socio</option>
                                    <option>Sueldos</option>
                                    <option>Impuestos</option>
                                    <option>Otros Gastos</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monto ($)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="0.00"
                            value={formData.monto}
                            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción / Detalles</label>
                    <input
                        type="text"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        placeholder="Ej: Pago de factura Edesur Enero..."
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-semibold transition-all shadow-md ${isIngreso ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isIngreso ? "Registrar Ingreso" : "Registrar Gasto"}
                </button>

            </form>
        </div>
    );
}
