import ClientForm from "./client-form";
import ClientList from "./client-list";
import { Users } from "lucide-react";
import { Suspense } from "react";

export default function ClientsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
                        <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-500" />
                        Gestión de Clientes
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Administra tu base de datos de compradores</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Formulario (1/3) */}
                <div className="lg:col-span-1">
                    <ClientForm />
                </div>

                {/* Lista (2/3) */}
                <div className="lg:col-span-2 space-y-4">
                    <Suspense fallback={<div>Cargando clientes...</div>}>
                        <ClientList />
                    </Suspense>
                </div>
            </div>

        </div>
    );
}
