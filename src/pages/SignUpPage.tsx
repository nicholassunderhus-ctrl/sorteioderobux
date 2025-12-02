import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Obtém o IP do usuário.
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      if (!ipResponse.ok) throw new Error("Não foi possível verificar seu endereço de IP.");
      const { ip } = await ipResponse.json();

      // 2. Chama a função no Supabase para validar o IP ANTES de criar a conta.
      // Usamos um UUID falso aqui, pois a conta ainda não existe. A função no Supabase
      // só precisa saber que é uma tentativa de acesso de um "novo" usuário.
      const { data: validationResult, error: rpcError } = await supabase.rpc('check_and_log_ip', {
        client_ip: ip,
        user_id_to_check: '00000000-0000-0000-0000-000000000000' // UUID genérico para novos usuários
      });

      if (rpcError) throw rpcError;

      // 3. Se a função retornar algo diferente de 'ALLOWED', o acesso é bloqueado.
      if (validationResult !== 'ALLOWED') {
        throw new Error(validationResult);
      }

      // 4. Se o IP for válido, prossegue com a criação da conta.
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      toast.success("Cadastro realizado! Verifique seu e-mail para confirmar sua conta.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-fredoka text-2xl">Criar Conta</CardTitle>
          <CardDescription className="font-fredoka">
            Insira seu e-mail e senha para se cadastrar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Cadastrar"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SignUpPage;