"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hola 👋, soy la IA de tu negocio. Pregúntame sobre tus ventas, caja o stock." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg] }) // Send context if needed, currently only last used
            });
            const data = await res.json();

            setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: "assistant", content: "Error de conexión." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all z-40 flex items-center gap-2 ${isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-indigo-600 hover:bg-indigo-700 animate-bounce-slow"
                    } text-white`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-40 overflow-hidden dark:bg-gray-900 dark:border-gray-800 animate-in slide-in-from-bottom-10 fade-in duration-200">

                    {/* Header */}
                    <div className="bg-indigo-600 p-4 flex items-center gap-3">
                        <div className="bg-indigo-500 p-2 rounded-lg">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Asistente IA</h3>
                            <p className="text-indigo-200 text-xs">Conectado a tu ERP</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${m.role === "user"
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                    <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:text-white"
                                placeholder="Escribe tu consulta..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
