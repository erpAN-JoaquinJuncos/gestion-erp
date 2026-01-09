import { getDashboardStats } from "./reports-service";
import { getProducts } from "./product-service";

export interface AIMessage {
    role: "user" | "assistant";
    content: string;
}

export async function processUserQuery(query: string): Promise<string> {
    const q = query.toLowerCase();

    // Obtener contexto de datos en tiempo real
    const stats = await getDashboardStats();
    const products = await getProducts();

    // 1. Análisis de Ventas
    if (q.includes("ventas") || q.includes("vendido")) {
        return `📊 Análisis de Ventas:\n\n` +
            `• Total Acumulado: $${stats.totalVentas.toLocaleString()}\n` +
            `• Operaciones: ${stats.ventasCount} ventas realizadas.\n` +
            `• Tendencia: ${stats.ventasPorMes.length > 0 ? "Datos registrados de los últimos meses." : "Aún recolectando históricos."}`;
    }

    // 2. Análisis de Productos Top
    if (q.includes("mejor") || q.includes("mas vendido") || q.includes("top")) {
        if (stats.topProductos.length === 0) return "Aún no tengo datos suficientes para determinar los mejores productos.";
        const top = stats.topProductos[0];
        return `🏆 Producto Estrella:\n\n` +
            `El artículo más vendido es **${top.nombre}** con ${top.cantidad} unidades.\n` +
            `Te recomiendo asegurar stock de este ítem para no perder ventas.`;
    }

    // 3. Análisis de Caja / Dinero
    if (q.includes("caja") || q.includes("plata") || q.includes("dinero") || q.includes("balance")) {
        return `💰 Estado Financiero:\n\n` +
            `Tu balance actual en caja es: **$${stats.balanceCaja.toLocaleString()}**.\n` +
            (stats.balanceCaja > 0
                ? "🟢 Tienes flujo de caja positivo. Buen momento para reponer stock."
                : "🔴 Cuidado, el flujo es negativo o cero. Revisa tus egresos.");
    }

    // 4. Alertas de Stock Bajo
    if (q.includes("stock") || q.includes("acabar") || q.includes("reponer")) {
        const lowStock = products.filter(p => p.stock < 5 && p.stock > 0);
        const outOfStock = products.filter(p => p.stock === 0);

        if (lowStock.length === 0 && outOfStock.length === 0) return "✅ Todo el inventario está saludable.";

        let msg = "⚠️ Alerta de Inventario:\n\n";
        if (outOfStock.length > 0) {
            msg += `🚫 **Agotados (${outOfStock.length}):** ${outOfStock.map(p => p.nombre).slice(0, 3).join(", ")}...\n`;
        }
        if (lowStock.length > 0) {
            msg += `📉 **Stock Crítico (${lowStock.length}):** ${lowStock.map(p => p.nombre).slice(0, 3).join(", ")}...\n`;
        }
        return msg;
    }

    // 5. Generador de Ofertas (Marketing)
    if (q.includes("oferta") || q.includes("promo") || q.includes("marketing")) {
        if (products.length === 0) return "Carga productos para que pueda generar ideas.";
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        return `💡 Idea de Marketing:\n\n` +
            `"¡Solo por hoy! Llevate **${randomProduct.nombre}** a un precio especial de $${(randomProduct.precio * 0.9).toFixed(0)} 💥"\n\n` +
            `Puedes enviar este mensaje por WhatsApp a tus clientes frecuentes.`;
    }

    // Fallback General
    return "Soy tu Asistente ERP 🤖.\nPuedo responder sobre:\n- Ventas y Ganancias\n- Productos más vendidos\n- Estado de Caja\n- Sugerencias de Stock\n\n¿Qué necesitas saber hoy?";
}
