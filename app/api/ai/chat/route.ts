import { NextResponse } from "next/server";
import { processUserQuery } from "@/lib/ai-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) return NextResponse.json({ error: "No message" }, { status: 400 });

    try {
        const response = await processUserQuery(lastMessage.content);
        return NextResponse.json({ content: response });
    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ content: "Lo siento, tuve un error procesando tus datos." });
    }
}
