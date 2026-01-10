"use client";

import { useState } from "react";
import { Product } from "@/lib/product-service";
import { ShoppingCart, MessageCircle, Plus, Minus, Trash2, MapPin, Store } from "lucide-react";

interface Props {
    products: Product[];
    ownerEmail: string;
    storeName: string;
}

interface CartItem extends Product {
    quantity: number;
}

export default function StoreClient({ products, ownerEmail, storeName }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(p => p.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, quantity: Math.max(1, p.quantity + delta) };
            }
            return p;
        }));
    };

    const total = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleWhatsAppCheckout = () => {
        // Construir mensaje
        let message = `Hola *${storeName}*, quiero realizar el siguiente pedido:\n\n`;
        cart.forEach(item => {
            message += `▪️ ${item.quantity}x ${item.nombre} - $${(item.precio * item.quantity)}\n`;
        });
        message += `\n*TOTAL: $${total}*\n`;
        message += `\nEspero confirmación. Gracias.`;

        // Codificar para URL
        const encodedMessage = encodeURIComponent(message);

        // Abrir WhatsApp (Número ficticio si no tenemos el real en config, idealmente leer perfil)
        // Como no tenemos el teléfono del dueño en products data, usaremos un placeholder o intentaremos sacar de config si pudiéramos.
        // Por ahora, abrimos wa.me con texto predefinido, el usuario tendrá q poner el numero o usamos uno genérico.
        // MEJORA: Leer Configuración Pública del Tenant.

        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{storeName}</h1>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            Abierto ahora
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(!isCartOpen)}
                        className="relative p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    >
                        <ShoppingCart className="h-6 w-6" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Product Grid */}
            <main className="max-w-4xl mx-auto px-4 py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                            <div className="aspect-square bg-gray-100 relative">
                                {product.imagen ? (
                                    <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Store className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                    ${product.precio}
                                </div>
                            </div>
                            <div className="p-3 flex-1 flex flex-col">
                                <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">{product.nombre}</h3>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.descripcion}</p>
                                <div className="mt-auto">
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Cart Modal / Sheet */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Tu Carrito
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <Minus className="h-6 w-6 rotate-90" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                                    <ShoppingCart className="h-16 w-16 opacity-20" />
                                    <p>Tu carrito está vacío</p>
                                    <button onClick={() => setIsCartOpen(false)} className="text-blue-600 font-medium hover:underline">
                                        Volver a la tienda
                                    </button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex gap-3 bg-white border rounded-lg p-2 shadow-sm">
                                        <div className="h-16 w-16 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                                            {item.imagen && <img src={item.imagen} className="h-full w-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm text-gray-900">{item.nombre}</h4>
                                            <p className="text-sm font-bold text-gray-700">${item.precio * item.quantity}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-gray-800"><Minus className="h-3 w-3" /></button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-gray-800"><Plus className="h-3 w-3" /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-4 border-t bg-gray-50 space-y-3">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${total}</span>
                                </div>
                                <button
                                    onClick={handleWhatsAppCheckout}
                                    className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Pedir por WhatsApp
                                </button>
                                <p className="text-xs text-center text-gray-500">
                                    Serás redirigido a WhatsApp para enviar tu pedido.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
