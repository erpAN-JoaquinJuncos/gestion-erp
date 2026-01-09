"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <main className="flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Gestión ERP Inteligente
        </h1>
        <p className="max-w-xl text-lg text-gray-600">
          Tu sistema de gestión integral. Controla tu emprendimiento, conecta con Google Sheets y escala tu negocio.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {/* Google Icon SVG */}
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12S5.867 24 12.48 24c3.44 0 6.013-1.147 8.027-3.24 2.053-2.08 2.613-5.04 2.613-7.467 0-.52-.053-1.04-.16-1.547H12.48z" />
            </svg>
            Entrar con Google
          </button>
          <button className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Saber Más
          </button>
        </div>
      </main>
    </div>
  );
}
