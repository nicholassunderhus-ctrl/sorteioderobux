import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, UserPlus, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  return (
    <section className="h-screen w-full flex items-center justify-center p-4 relative bg-cover bg-center">
      {/* 
        NOTA: A imagem de fundo está sendo carregada de um link externo.
        Para usar uma imagem do seu projeto, coloque-a na pasta `public` e mude o `backgroundImage` para:
        style={{ backgroundImage: "url('/nome-da-sua-imagem.jpg')" }}
      */}
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop')" }}></div>
      {/* Overlay para melhorar a legibilidade do texto */}
      <div className="absolute inset-0 z-0 bg-background/60 backdrop-blur-sm"></div>

      <div className="text-center z-10">
        <h1 className="font-fredoka font-bold text-6xl md:text-8xl text-primary mb-6 animate-fade-in-down drop-shadow-lg">
          Sorteio de Robux
        </h1>
        <p className="font-fredoka text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 animate-fade-in-up drop-shadow-md">
          Bem-vindo ao Robux Chance Hub! Participe de sorteios semanais e concorra a <strong className="text-primary font-semibold drop-shadow-none">milhares de Robux totalmente grátis</strong>.
          Crie sua conta e comece a ganhar bilhetes agora mesmo.
        </p>

        {/* Conditional Rendering: Show CTA or Auth Options */}
        {!showAuthOptions ? (
          <Button
            onClick={() => setShowAuthOptions(true)}
            className="font-semibold text-xl py-7 px-10 bg-gradient-primary hover:opacity-90 animate-fade-in-up animation-delay-1000"
          >
            <Rocket className="w-6 h-6 mr-3" />
            Começar a Concorrer
          </Button>
        ) : (
          <Card className="max-w-sm mx-auto bg-card/50 backdrop-blur-sm animate-scale-in">
            <CardHeader>
              <CardTitle className="font-fredoka text-2xl">Acesse sua Conta</CardTitle>
              <CardDescription className="font-fredoka">
                Faça login ou crie uma nova conta para começar.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Link to="/login" className="w-full">
                <Button className="w-full font-semibold text-lg py-6 bg-gradient-primary hover:opacity-90">
                  <LogIn className="w-5 h-5 mr-2" />
                  Entrar
                </Button>
              </Link>
              <Link to="/cadastro" className="w-full">
                <Button variant="outline" className="w-full font-semibold text-lg py-6">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Cadastre-se
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default HomePage;