import { Sidebar } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AIChatWidget from "@/components/ai-chat-widget";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black transition-colors">
            <div className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50">
                <Sidebar user={session?.user} />
            </div>

            <div className="md:pl-64 flex flex-col flex-1 min-h-screen overflow-hidden">
                <header className="flex h-16 items-center justify-between bg-white border-b border-gray-200 px-6 dark:bg-gray-900 dark:border-gray-800 transition-colors">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Panel de Control</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-300">{session.user?.name}</span>
                        {session.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="Perfil"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold dark:bg-blue-900 dark:text-blue-300">
                                {session.user?.name?.[0] || "U"}
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-black transition-colors">
                    {children}
                </main>
            </div>

            {/* Widget Global de IA */}
            <AIChatWidget />
        </div>
    );
}
