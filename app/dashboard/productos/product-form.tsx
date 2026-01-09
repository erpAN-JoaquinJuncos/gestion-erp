"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Save, Loader2, ArrowLeft } from "lucide-react";

export default function ProductForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        costo: "",
        stock: "",
        categoria: "General",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Limpiar form
            setFormData({
                nombre: "",
                descripcion: "",
                precio: "",
                costo: "",
                stock: "",
                categoria: "General",
            });

            router.refresh();

        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <input
                        type="text"
                        name="nombre"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Ej: Remera Talle L"
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Precio de Venta ($)</label>
                    <input
                        type="number"
                        name="precio"
                        required
                        min="0"
                        step="0.01"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0.00"
                        value={formData.precio}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Costo ($)</label>
                    <input
                        type="number"
                        name="costo"
                        min="0"
                        step="0.01"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0.00 - Opcional"
                        value={formData.costo}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Stock Inicial</label>
                    <input
                        type="number"
                        name="stock"
                        min="0"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                        value={formData.stock}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Categoría</label>
                    <select
                        name="categoria"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.categoria}
                        onChange={handleChange}
                    >
                        <option value="General">General</option>
                        <option value="Ropa">Ropa</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Insumos">Insumos</option>
                    </select>
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        name="descripcion"
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Detalles adicionales..."
                        value={formData.descripcion}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Guardar Producto
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
