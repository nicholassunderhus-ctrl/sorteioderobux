import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
// 1. Importe o seu vídeo aqui.
// Lembre-se de trocar 'fundo-video.mp4' pelo nome do seu arquivo!
import videoSource from "@/assets/fundo-video.mp4";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <section className="h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Vídeo de Fundo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        {/* 2. Use a variável do vídeo importado aqui */}
        <source src={videoSource} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
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

        <Button
          onClick={() => navigate("/auth")}
          className="font-semibold text-xl py-7 px-10 bg-gradient-primary hover:opacity-90 animate-fade-in-up animation-delay-1000"
        >
          <Rocket className="w-6 h-6 mr-3" />
          Começar a Concorrer
        </Button>
      </div>
    </section>
  );
};

export default HomePage;