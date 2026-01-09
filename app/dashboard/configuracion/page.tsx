import ConfigForm from "./config-form";
import { getConfig } from "@/lib/config-service";
import { Settings } from "lucide-react";

export default async function ConfigPage() {
    const config = await getConfig();

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
                        <Settings className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                        Configuración
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Personaliza tu empresa y gestiona tu plan</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <ConfigForm initialConfig={config} />
            </div>
        </div>
    );
}
