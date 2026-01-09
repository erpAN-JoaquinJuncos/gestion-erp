"use client";

import { useState } from "react";
import { Save, Loader2, Store, CreditCard, Star } from "lucide-react";

interface ConfigFormProps {
    initialConfig: any;
}

export default function ConfigForm({ initialConfig }: ConfigFormProps) {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(initialConfig);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });

            if (!res.ok) throw new Error("Error guardando");
            alert("Configuración actualizada correctamente");

        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tarjeta Empresa */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                    <Store className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Datos de la Empresa (Para Tickets)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Negocio</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={config.empresaNombre}
                            onChange={(e) => setConfig({ ...config, empresaNombre: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dirección / Contacto</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={config.empresaDireccion}
                            onChange={(e) => setConfig({ ...config, empresaDireccion: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cabecera de Ticket</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={config.ticketHeader}
                            onChange={(e) => setConfig({ ...config, ticketHeader: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pie de Ticket</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={config.ticketFooter}
                            onChange={(e) => setConfig({ ...config, ticketFooter: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Tarjeta Plan */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                        Plan y Suscripción
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold border ${config.plan === 'Pro' ? 'bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 border-yellow-500' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                        {config.plan === 'Pro' ? 'PLAN PRO 🌟' : 'PLAN FREE'}
                    </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {config.plan === "Free"
                        ? "Actualmente estás en el plan gratuito con funcionalidades limitadas."
                        : "¡Tienes acceso total a todas las funcionalidades del sistema!"}
                </p>

                {config.plan === "Free" && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Actualiza a PRO
                        </h4>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 mb-4 list-disc list-inside">
                            <li>Reportes Avanzados de Rentabilidad</li>
                            <li>Sin límites de productos</li>
                            <li>Soporte Prioritario</li>
                        </ul>
                        <button
                            type="button"
                            onClick={() => setConfig({ ...config, plan: "Pro" })}
                            className="text-sm bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded shadow-sm"
                        >
                            Simular Upgrade a PRO (Demo)
                        </button>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md dark:bg-indigo-700 dark:hover:bg-indigo-600"
            >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Guardar Cambios
            </button>
        </form>
    );
}
