import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="font-fredoka font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent mb-2">
            Sorteio de Robux
          </h3>
          <p className="font-fredoka text-sm text-muted-foreground mb-4">
            Sorteios gratuitos de Robux 2x por semana
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Feito com</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>para jogadores de Roblox</span>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="font-fredoka text-xs text-muted-foreground">
              © 2025 Sorteio de Robux. Este site não é afiliado ao Roblox Corporation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
