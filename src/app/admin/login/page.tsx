"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha incorretos.");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Ocorreu um erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-4 shadow-lg border-gray-200 bg-white">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white text-xl font-bold">
            L
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Painel Administrativo
        </CardTitle>
        <CardDescription className="text-gray-500">
          Faca login para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
