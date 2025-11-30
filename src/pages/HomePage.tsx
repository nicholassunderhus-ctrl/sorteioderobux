import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <section className="h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-fredoka font-bold text-5xl md:text-7xl text-primary mb-4">
          Robux Chance Hub
        </h1>
        <p className="font-fredoka text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Sua chance de ganhar Robux grátis participando de sorteios!
        </p>

        <Card className="max-w-sm mx-auto bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-fredoka text-2xl">Acesse sua Conta</CardTitle>
            <CardDescription className="font-fredoka">
              Faça login ou crie uma nova conta para começar a participar.
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
      </div>
    </section>
  );
};

export default HomePage;