import { Button } from "@/components/ui/button";
import { Rocket, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        {/* O caminho agora é direto a partir da pasta 'public' */}
        <source src="/fundo-video.mp4" type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      {/* Overlay para melhorar a legibilidade do texto */}
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="text-center z-10">
        <h1 className="font-fredoka font-bold text-6xl md:text-8xl text-primary mb-6 animate-fade-in-down drop-shadow-lg">
          Sorteio de Robux
        </h1>
        <p className="font-fredoka text-xl md:text-2xl text-white max-w-3xl mx-auto mb-12 animate-fade-in-up drop-shadow-md">
          Assista anúncios e concorra a ganhar <strong className="text-primary font-bold drop-shadow-none">1.000 Robux</strong> em <strong className="text-primary font-bold drop-shadow-none">Sorteios Semanais</strong>!
        </p>

        <Button
          onClick={() => navigate("/auth")}
          className="font-semibold text-xl py-7 px-10 bg-gradient-primary hover:opacity-90 animate-fade-in-up animation-delay-1000"
        >
          <Rocket className="w-6 h-6 mr-3" />
          Começar a Concorrer
        </Button>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-x-8 gap-y-4 text-white/90 animate-fade-in-up animation-delay-1500">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">+10.000 usuários</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <span className="font-semibold">50K+ robux pagos</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;