import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/spreadsheets",
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                console.log("SCOPES RECIBIDOS:", account.scope);
                console.log("ACCESS TOKEN:", account.access_token?.substring(0, 10) + "...");
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            // @ts-ignore
            session.accessToken = token.accessToken;
            return session;
        },
    },
};
