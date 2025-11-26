"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // If user already logged in → redirect to dashboard
      if (user) {
        router.replace("/dashboard");
      }
    }

    checkSession();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
        <LoginForm />
      </div>
    </main>
  );
}
