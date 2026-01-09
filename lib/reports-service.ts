import { getSales } from "./sales-service";
import { getCashFlow } from "./cashflow-service";
import { getProducts } from "./product-service";
import { readSheet } from "./data";
import { getUserSheetId } from "./tenant-service";

export interface DashboardStats {
    totalVentas: number;
    ventasCount: number;
    totalCompras: number;
    comprasCount: number;
    balanceCaja: number;
    topProductos: { nombre: string; cantidad: number }[];
    ventasPorMes: { mes: string; total: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const [sales, cashflow, products] = await Promise.all([
        getSales(),
        getCashFlow(),
        getProducts()
    ]);

    // 1. Totales Generales
    const totalVentas = sales.reduce((acc, sale) => acc + sale.total, 0);

    // Para compras, leemos directo de la hoja Compras si existe, o estimamos desde Caja (Egreso Compra)
    // Por precisión, vamos a leer la hoja Compras.
    let totalCompras = 0;
    let comprasCount = 0;
    try {
        const sheetId = await getUserSheetId();
        const comprasRows = await readSheet("Compras", "A:Z", sheetId);
        if (comprasRows.length > 1) {
            // Asumiendo Columna E (Indice 4) es Total
            const comprasData = comprasRows.slice(1);
            comprasCount = comprasData.length;
            totalCompras = comprasData.reduce((acc, row) => acc + (Number(row[4]) || 0), 0);
        }
    } catch (e) {
        console.warn("Hoja Compras no accesible o vacía");
    }

    // 2. Balance de Caja (Ingresos - Egresos reales)
    const totalIngresosCaja = cashflow
        .filter(m => m.tipo === "Ingreso")
        .reduce((acc, m) => acc + m.monto, 0);

    const totalEgresosCaja = cashflow
        .filter(m => m.tipo === "Egreso")
        .reduce((acc, m) => acc + m.monto, 0);

    // NOTA: Las ventas automáticas ya suman a Ingresos en Caja? 
    // Sí, la API /sales registra en 'Caja'. Y /purchases también.
    // Así que el CashFlow es la fuente de la verdad para el dinero líquido.
    const balanceCaja = totalIngresosCaja - totalEgresosCaja;

    // 3. Top Productos (Parseando items de ventas)
    // Los items en ventas están guardados como texto "2x Coca Cola, 1x Pan".
    // Esto es difícil de parsear precisamente sin una estructura JSON en la celda.
    // Por ahora, usaremos una aproximación simple o contaremos stock invertido si quisiéramos.
    // MEJORA PRO: Guardar JSON en columna oculta de ventas.
    // POR AHORA: Simularemos Top Productos basándonos en Stock bajo (lo que más se ha ido).
    // O mejor, intentaremos parsear las ventas recientes.

    const productSalesMap: Record<string, number> = {};

    sales.forEach(sale => {
        // Intento básico de parseo: "2x Coca Cola"
        const itemsStr = sale.items.split(", ");
        itemsStr.forEach(itemStr => {
            const parts = itemStr.split("x ");
            if (parts.length === 2) {
                const qty = parseInt(parts[0]);
                const name = parts[1];
                if (!isNaN(qty)) {
                    productSalesMap[name] = (productSalesMap[name] || 0) + qty;
                }
            }
        });
    });

    const topProductos = Object.entries(productSalesMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }));

    // 4. Ventas por Mes (Últimos 6 meses)
    const ventasPorMesMap: Record<string, number> = {};
    sales.forEach(sale => {
        // Fecha formato YYYY-MM-DD
        const date = new Date(sale.fecha);
        const key = `${date.getMonth() + 1}/${date.getFullYear()}`; // "1/2026"
        ventasPorMesMap[key] = (ventasPorMesMap[key] || 0) + sale.total;
    });

    const ventasPorMes = Object.entries(ventasPorMesMap)
        .map(([mes, total]) => ({ mes, total }))
        .slice(-6); // Últimos 6

    return {
        totalVentas,
        ventasCount: sales.length,
        totalCompras,
        comprasCount,
        balanceCaja,
        topProductos,
        ventasPorMes
    };
}
