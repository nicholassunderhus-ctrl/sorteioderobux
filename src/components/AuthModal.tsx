import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const signUpSchema = z.object({
  username: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const signInSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

type SignUpData = z.infer<typeof signUpSchema>;
type SignInData = z.infer<typeof signInSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register: registerSignUp, handleSubmit: handleSignUpSubmit, formState: { errors: signUpErrors } } = useForm<SignUpData>({ resolver: zodResolver(signUpSchema) });
  const { register: registerSignIn, handleSubmit: handleSignInSubmit, formState: { errors: signInErrors } } = useForm<SignInData>({ resolver: zodResolver(signInSchema) });

  const handleSignUp = async (formData: SignUpData) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
        }
      }
    });
    if (error) setError(error.message);
    else setMessage("Cadastro realizado! Verifique seu email para confirmar a conta.");
    setLoading(false);
  };

  const handleSignIn = async (formData: SignInData) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) setError("Email ou senha inválidos.");
    else onClose(); // Fecha o modal em caso de sucesso
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acesse sua Conta</DialogTitle>
          <DialogDescription>
            Entre ou crie uma conta para participar dos sorteios.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignInSubmit(handleSignIn)} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" type="email" {...registerSignIn("email")} />
                {signInErrors.email && <p className="text-xs text-red-500">{signInErrors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Senha</Label>
                <Input id="signin-password" type="password" {...registerSignIn("password")} />
                {signInErrors.password && <p className="text-xs text-red-500">{signInErrors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUpSubmit(handleSignUp)} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">Nome de Usuário</Label>
                <Input id="signup-username" {...registerSignUp("username")} />
                {signUpErrors.username && <p className="text-xs text-red-500">{signUpErrors.username.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" {...registerSignUp("email")} />
                {signUpErrors.email && <p className="text-xs text-red-500">{signUpErrors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <Input id="signup-password" type="password" {...registerSignUp("password")} />
                {signUpErrors.password && <p className="text-xs text-red-500">{signUpErrors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Criando conta...' : 'Criar Conta'}</Button>
            </form>
          </TabsContent>
        </Tabs>
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        {message && <p className="text-sm text-center text-green-500">{message}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;