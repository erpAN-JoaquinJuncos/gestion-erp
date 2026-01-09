import CashForm from "./cash-form";
import CashList from "./cash-list";
import { Wallet } from "lucide-react";
import { Suspense } from "react";

export default function CajaPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
                        <Wallet className="h-8 w-8 text-purple-600 dark:text-purple-500" />
                        Caja y Finanzas
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Control de ingresos, gastos y movimientos</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Formulario (1/3) */}
                <div className="lg:col-span-1">
                    <CashForm />
                </div>

                {/* Columna Derecha: Lista (2/3) */}
                <div className="lg:col-span-2 space-y-4">
                    <Suspense fallback={<div>Cargando movimientos...</div>}>
                        <CashList />
                    </Suspense>
                </div>
            </div>

        </div>
    );
}
