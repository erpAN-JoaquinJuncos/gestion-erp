"use client";

import { useState } from "react";
import { Product } from "@/lib/product-service";
import { ShoppingBag, Plus, Trash2, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface PurchaseFormProps {
    initialProducts: Product[];
}

interface CartItem extends Product {
    cantidad: number;
    costoUnitario: number;
}

export default function PurchaseForm({ initialProducts }: PurchaseFormProps) {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [proveedor, setProveedor] = useState("");
    const [metodoPago, setMetodoPago] = useState("Efectivo");

    const addToCart = () => {
        if (!selectedProductId) return;
        const product = initialProducts.find(p => p.id === selectedProductId);
        if (!product) return;

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            // Usamos el costo del producto como default, si no tiene, usamos 0
            return [...prev, { ...product, cantidad: 1, costoUnitario: 0 }];
        });
        setSelectedProductId("");
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: "cantidad" | "costoUnitario", value: number) => {
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const total = cart.reduce((acc, item) => acc + (item.costoUnitario * item.cantidad), 0);

    const handleSubmit = async () => {
        if (cart.length === 0) return;
        setLoading(true);

        try {
            const purchaseData = {
                proveedor,
                items: cart.map(i => ({
                    id: i.id,
                    nombre: i.nombre,
                    cantidad: i.cantidad,
                    costo: i.costoUnitario
                })),
                total,
                metodoPago
            };

            const res = await fetch("/api/purchases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(purchaseData),
            });

            if (!res.ok) throw new Error("Error registrando compra");

            alert("¡Compra registrada y Stock sumado!");
            setCart([]);
            setProveedor("");
            setMetodoPago("Efectivo");
            router.refresh();

        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Seleccionar Productos a Reponer</h2>
                    <div className="flex gap-2">
                        <select
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                        >
                            <option value="">Seleccionar producto...</option>
                            {initialProducts.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} - Stock Actual: {p.stock}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={addToCart}
                            disabled={!selectedProductId}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Tabla Editable */}
                {cart.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-900 dark:border-gray-800 transition-colors">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-3 w-1/3">Producto</th>
                                    <th className="px-4 py-3 w-20 text-center">Cant.</th>
                                    <th className="px-4 py-3 w-24 text-right">Costo Unit.</th>
                                    <th className="px-4 py-3 text-right">Subtotal</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {cart.map((item) => (
                                    <tr key={item.id} className="dark:hover:bg-gray-800/50">
                                        <td className="px-4 py-3 font-medium dark:text-gray-200">{item.nombre}</td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-16 text-center border rounded px-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                                value={item.cantidad}
                                                onChange={(e) => updateItem(item.id, "cantidad", Number(e.target.value))}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="dark:text-gray-400">$</span>
                                                <input
                                                    type="number"
                                                    min="0" step="0.01"
                                                    className="w-20 text-right border rounded px-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                                    value={item.costoUnitario}
                                                    onChange={(e) => updateItem(item.id, "costoUnitario", Number(e.target.value))}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-700 dark:text-white">
                                            ${(item.costoUnitario * item.cantidad).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit dark:bg-gray-900 dark:border-gray-800 transition-colors">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2 dark:text-white">
                        <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Datos de Compra
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
                            <input
                                type="text"
                                placeholder="Ej: Mayorista Central"
                                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={proveedor}
                                onChange={(e) => setProveedor(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Método de Pago</label>
                            <select
                                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                            >
                                <option value="Efectivo">Efectivo 💵</option>
                                <option value="Transferencia">Transferencia 🏦</option>
                                <option value="Tarjeta Crédito">Tarjeta Crédito 💳</option>
                                <option value="Cheque">Cheque 🎫</option>
                            </select>
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-2 dark:border-gray-800">
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 text-lg dark:text-white">
                                <span>Total Costo</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={cart.length === 0 || loading}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Save className="h-5 w-5" />
                            )}
                            {loading ? "Procesando..." : "Registrar Compra"}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
