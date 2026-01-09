"use client";

import { useState } from "react";
import { Product } from "@/lib/product-service";
import { Client } from "@/lib/client-service";
import { ShoppingCart, Plus, Trash2, Loader2, Save, Printer, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateTicket } from "@/lib/ticket-generator";

interface PosFormProps {
    initialProducts: Product[];
    initialClients: Client[];
    initialConfig: any;
}

interface CartItem extends Product {
    cantidad: number;
    precioUnitario: number;
}

export default function PosForm({ initialProducts, initialClients, initialConfig }: PosFormProps) {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState("");

    // Cliente State
    const [selectedClientId, setSelectedClientId] = useState("");
    const [customClientName, setCustomClientName] = useState("");
    const [isCustomClient, setIsCustomClient] = useState(false);

    const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
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
            return [...prev, { ...product, cantidad: 1, precioUnitario: product.precio }];
        });
        setSelectedProductId("");
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: "cantidad" | "precioUnitario", value: number) => {
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    const descuentoMonto = subtotal * (descuentoPorcentaje / 100);
    const total = subtotal - descuentoMonto;

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        // Validar Cliente
        let finalClientName = "";
        if (isCustomClient) {
            if (!customClientName.trim()) {
                alert("Por favor ingrese el nombre del cliente eventual.");
                return;
            }
            finalClientName = customClientName;
        } else {
            const client = initialClients.find(c => c.id === selectedClientId);
            finalClientName = client ? client.nombre : "Consumidor Final";
        }

        setLoading(true);

        try {
            const saleData = {
                cliente: finalClientName,
                items: cart.map(i => ({
                    id: i.id,
                    nombre: i.nombre,
                    cantidad: i.cantidad,
                    precio: i.precioUnitario
                })),
                total,
                metodoPago
            };

            const res = await fetch("/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saleData),
            });

            if (!res.ok) throw new Error("Error registrando venta");

            alert("¡Venta registrada y Stock actualizado!");

            // Preguntar si quiere imprimir ticket
            if (confirm("¿Desea imprimir el ticket de esta venta?")) {
                generateTicket({
                    fecha: new Date().toLocaleDateString(),
                    cliente: finalClientName,
                    items: cart.map(i => ({
                        nombre: i.nombre,
                        cantidad: i.cantidad,
                        precio: i.precioUnitario
                    })),
                    subtotal,
                    descuento: descuentoMonto,
                    total,
                    metodoPago,
                    empresaNombre: initialConfig.empresaNombre,
                    ticketHeader: initialConfig.ticketHeader,
                    ticketFooter: initialConfig.ticketFooter
                });
            }

            setCart([]);
            setSelectedClientId("");
            setCustomClientName("");
            setIsCustomClient(false);
            setDescuentoPorcentaje(0);
            setMetodoPago("Efectivo");
            router.refresh();

        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintTicket = () => {
        if (cart.length === 0) return;

        // Determinar cliente real para el ticket temporal
        let finalClientName = "Consumidor Final";
        if (isCustomClient && customClientName.trim()) {
            finalClientName = customClientName;
        } else {
            const client = initialClients.find(c => c.id === selectedClientId);
            if (client) finalClientName = client.nombre;
        }

        const subtotal = cart.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
        const descuentoMonto = subtotal * (descuentoPorcentaje / 100);
        const total = subtotal - descuentoMonto;

        generateTicket({
            fecha: new Date().toLocaleDateString(),
            cliente: finalClientName,
            items: cart.map(i => ({
                nombre: i.nombre,
                cantidad: i.cantidad,
                precio: i.precioUnitario
            })),
            subtotal,
            descuento: descuentoMonto,
            total,
            metodoPago,
            empresaNombre: initialConfig.empresaNombre,
            ticketHeader: initialConfig.ticketHeader,
            ticketFooter: initialConfig.ticketFooter
        });
    };

    const handleGeneratePayment = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const items = cart.map(i => ({
                id: i.id,
                title: i.nombre,
                unit_price: i.precioUnitario,
                quantity: i.cantidad
            }));

            const res = await fetch("/api/payments/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, payerEmail: "cliente@ejemplo.com" }) // Idealmente email del cliente
            });

            const data = await res.json();
            if (data.preferenceId) {
                // En sandbox usamos el init_point de sandbox, pero la libreria devuelve ID.
                // Construimos url standard o abrimos popup.
                // Para simplificar, abrimos la pasarela en nueva pestaña.
                const url = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.preferenceId}`;
                window.open(url, '_blank');
                alert("Link de pago generado y abierto en nueva pestaña.");
            } else {
                throw new Error("No se pudo generar el pago");
            }
        } catch (e) {
            console.error(e);
            alert("Error conectando con MercadoPago (Verificar Token)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">

            {/* Columna Izquierda: Selección de Productos */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Agregar Productos</h2>
                    <div className="flex gap-2">
                        <select
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                        >
                            <option value="">Seleccionar producto...</option>
                            {initialProducts.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} - Stock: {p.stock}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={addToCart}
                            disabled={!selectedProductId}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Tabla Editable de Items */}
                {cart.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-900 dark:border-gray-800 transition-colors">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-3 w-1/3">Producto</th>
                                    <th className="px-4 py-3 w-20 text-center">Cant.</th>
                                    <th className="px-4 py-3 w-24 text-right">Precio Unit.</th>
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
                                                    value={item.precioUnitario}
                                                    onChange={(e) => updateItem(item.id, "precioUnitario", Number(e.target.value))}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-700 dark:text-white">
                                            ${(item.precioUnitario * item.cantidad).toFixed(2)}
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

            {/* Columna Derecha: Resumen de Pago */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit dark:bg-gray-900 dark:border-gray-800 transition-colors">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2 dark:text-white">
                        <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Resumen de Venta
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</label>
                                <button
                                    onClick={() => setIsCustomClient(!isCustomClient)}
                                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    {isCustomClient ? "Seleccionar de lista" : "Ingresar eventual"}
                                </button>
                            </div>

                            {isCustomClient ? (
                                <input
                                    type="text"
                                    placeholder="Nombre del Cliente"
                                    className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    value={customClientName}
                                    onChange={(e) => setCustomClientName(e.target.value)}
                                />
                            ) : (
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        value={selectedClientId}
                                        onChange={(e) => setSelectedClientId(e.target.value)}
                                    >
                                        <option value="">Consumidor Final</option>
                                        {initialClients.map(c => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </select>
                                    <Link href="/dashboard/clientes" className="mt-1 p-2 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700" title="Nuevo Cliente">
                                        <UserPlus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </Link>
                                </div>
                            )}
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
                                <option value="Tarjeta Débito">Tarjeta Débito 💳</option>
                                <option value="QR / App">Billetera Virtual / QR 📱</option>
                            </select>
                        </div>

                        {metodoPago === "QR / App" && (
                            <div className="pt-2">
                                {initialConfig.plan === "Pro" ? (
                                    <>
                                        <button
                                            onClick={handleGeneratePayment}
                                            disabled={cart.length === 0 || loading}
                                            className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                        >
                                            <CreditCardIcon className="h-4 w-4" />
                                            Generar Cobro Digital
                                        </button>
                                        <p className="text-xs text-center text-gray-500 mt-1 dark:text-gray-400">
                                            Abre link de pago MP para el cliente
                                        </p>
                                    </>
                                ) : (
                                    <div className="p-3 bg-gray-100 rounded-lg text-center dark:bg-gray-800">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Cobros QR disponibles en PRO
                                        </p>
                                        <Link href="/dashboard/configuracion" className="text-xs bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold hover:bg-yellow-500">
                                            Desbloquear PRO 🔓
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descuento (%)</label>
                            <input
                                type="number"
                                min="0" max="100"
                                placeholder="0"
                                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={descuentoPorcentaje}
                                onChange={(e) => setDescuentoPorcentaje(Number(e.target.value))}
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-2 dark:border-gray-800">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {descuentoPorcentaje > 0 && (
                                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                    <span>Descuento ({descuentoPorcentaje}%)</span>
                                    <span>-${descuentoMonto.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t text-lg dark:text-white dark:border-gray-800">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handlePrintTicket}
                                disabled={cart.length === 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Printer className="h-5 w-5" />
                            </button>

                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || loading}
                                className="flex-[3] flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg dark:bg-green-700 dark:hover:bg-green-600"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Save className="h-5 w-5" />
                                )}
                                {loading ? "Procesando..." : "Cobrar"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

function CreditCardIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
    )
}
