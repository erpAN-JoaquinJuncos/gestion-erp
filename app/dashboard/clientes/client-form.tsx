"use client";

import { useState } from "react";
import { UserPlus, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        documento: "",
        telefono: "",
        email: "",
        direccion: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Error guardando cliente");

            setFormData({
                nombre: "",
                documento: "",
                telefono: "",
                email: "",
                direccion: ""
            });
            alert("Cliente registrado correctamente");
            router.refresh();

        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Registrar Nuevo Cliente
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo *</label>
                    <input
                        type="text"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        placeholder="Ej: Juan Pérez"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">DNI / CUIT</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="Sin puntos ni guiones"
                            value={formData.documento}
                            onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono / WhatsApp</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="+54 9 11..."
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="juan@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="Calle 123, Ciudad"
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md dark:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Guardar Cliente
                </button>
            </form>
        </div>
    );
}
