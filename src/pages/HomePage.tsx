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
    <section className="h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="text-center z-10">
        <h1 className="font-fredoka font-bold text-5xl md:text-7xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6 animate-fade-in-down">
          Sorteio de Robux
        </h1>
        <p className="font-fredoka text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up">
          Bem-vindo ao Robux Chance Hub! Participe de sorteios semanais e
          concorra a <strong className="text-primary font-semibold">milhares de Robux totalmente grátis</strong>.
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