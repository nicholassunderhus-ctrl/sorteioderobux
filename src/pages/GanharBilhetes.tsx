import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const tickets = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Bilhete #${i + 1}`,
  description: "Clique para assistir anúncios e ganhar",
}));

const GanharBilhetes = () => {
  const handleGetTicket = (ticketId: number) => {
    // Aqui você pode adicionar a lógica para abrir o link encurtado
    console.log(`Ganhando bilhete ${ticketId}`);
  };

  return (
    <div className="min-h-full font-fredoka bg-gradient-hero">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="font-fredoka mb-4 bg-gradient-primary text-primary-foreground text-base px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Bilhetes Grátis
          </Badge>
          <h1 className="font-fredoka font-bold text-4xl md:text-6xl mb-4">
            Escolha Seus{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Bilhetes
            </span>
          </h1>
          <p className="font-fredoka text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Clique em "Ganhar" para assistir anúncios rápidos e receber seus bilhetes gratuitamente!
          </p>
        </div>

        {/* Tickets Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="font-fredoka bg-card shadow-card hover:shadow-glow transition-all hover:-translate-y-1"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Ticket className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-xl">{ticket.title}</h3>
              </CardHeader>

              <CardContent className="text-center pb-4">
                <p className="text-sm text-muted-foreground">
                  {ticket.description}
                </p>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  onClick={() => handleGetTicket(ticket.id)}
                  className="w-full font-semibold bg-gradient-secondary hover:opacity-90"
                >
                  Ganhar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-12">
          <Card className="bg-card/50 backdrop-blur border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <p className="font-fredoka text-muted-foreground mb-2">
                💡 <strong>Dica:</strong> Quanto mais bilhetes você ganhar, maiores suas chances de vencer!
              </p>
              <p className="font-fredoka text-sm text-muted-foreground">
                Cada anúncio dura apenas alguns segundos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GanharBilhetes;
