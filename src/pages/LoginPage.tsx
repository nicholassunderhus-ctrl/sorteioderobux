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

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 0. Verifica se o usuário está usando VPN/Proxy
      const vpnCheckResponse = await fetch('http://ip-api.com/json/?fields=proxy');
      if (!vpnCheckResponse.ok) {
        // Se a API de verificação falhar, continuamos por segurança, mas registramos o erro.
        console.warn("API de verificação de VPN falhou.");
      } else {
        const vpnData = await vpnCheckResponse.json();
        if (vpnData.proxy) {
          throw new Error("O uso de VPN ou Proxy não é permitido para acessar o site.");
        }
      }

      // 1. Faz o login normalmente para obter o ID do usuário.
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;
      if (!loginData.user) throw new Error("Usuário ou senha inválidos.");

      // 2. Obtém o IP do usuário.
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      if (!ipResponse.ok) throw new Error("Não foi possível verificar seu endereço de IP.");
      const { ip } = await ipResponse.json();

      // 3. Chama a função no Supabase para validar o IP e registrar o acesso.
      const { data: validationResult, error: rpcError } = await supabase.rpc('check_and_log_ip', {
        client_ip: ip,
        user_id_to_check: loginData.user.id
      });

      if (rpcError) throw rpcError;

      // 4. Se a função retornar algo diferente de 'ALLOWED', o acesso é bloqueado.
      if (validationResult !== 'ALLOWED') {
        await supabase.auth.signOut(); // Desloga o usuário imediatamente.
        throw new Error(validationResult);
      }

      // 5. Se tudo deu certo, o usuário continua logado e é redirecionado.
      toast.success("Login realizado com sucesso!");
      navigate("/sorteios"); // Redireciona para a página de sorteios
    } catch (error: any) {
      toast.error(error.message || "E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-fredoka text-2xl">Entrar na Conta</CardTitle>
          <CardDescription className="font-fredoka">
            Insira seus dados para acessar os sorteios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link to="/cadastro" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginPage;