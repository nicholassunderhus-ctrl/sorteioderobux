import { Badge } from "@/components/ui/badge";
import { Tv } from "lucide-react";

const LiveStream = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <Badge className="font-fredoka mb-4 bg-gradient-accent text-accent-foreground">
            <Tv className="w-4 h-4 mr-2" />
            Ao Vivo
          </Badge>
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl mb-4">
            Transmissão dos Sorteios
          </h2>
          <p className="font-fredoka text-lg text-muted-foreground max-w-2xl mx-auto">
            As transmissões acontecem todas as terças e sábados, às 19:00, ao vivo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LiveStream;