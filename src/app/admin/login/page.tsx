import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { LogoMark } from "@/components/icons/logo";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="bg-primary flex min-h-screen items-center justify-center px-4">
      <div className="bg-card w-full max-w-sm rounded-xl p-8 shadow-lg">
        <div className="mb-8 text-center">
          <LogoMark className="mx-auto size-10" />
          <h1 className="font-heading mt-4 text-xl font-bold">Amir Engineering Admin</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to manage the portal</p>
        </div>
        <Suspense>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
