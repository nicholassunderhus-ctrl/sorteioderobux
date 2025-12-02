import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Gift, Users, Copy, Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const AffiliatesPage = () => {
  const [affiliateCode, setAffiliateCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAffiliateCode = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('affiliate_code')
          .eq('id', user.id)
          .single();

        if (error) {
          toast.error("Erro ao buscar seu código de afiliado.");
        } else if (data && data.affiliate_code) {
          setAffiliateCode(data.affiliate_code);
        }
      }
      setLoading(false);
    };

    fetchAffiliateCode();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateCode);
    setCopied(true);
    toast.success("Código copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen font-fredoka bg-gray-100 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl md:text-5xl">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Programa de Afiliados
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Convide seus amigos e ganhe pontos!
          </p>
        </div>

        {/* Seção do Código */}
        <Card className="w-full mb-12">
          <CardHeader className="text-center">
            <CardTitle className="font-fredoka text-2xl">Seu Código de Convite</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {loading ? (
              <Loader2 className="h-8 w-8 mx-auto animate-spin" />
            ) : (
              <div className="bg-muted dark:bg-muted/50 rounded-lg p-4 flex items-center justify-center gap-4">
                <p className="text-3xl font-bold tracking-widest text-primary">{affiliateCode}</p>
                <Button size="icon" onClick={handleCopy} variant="ghost">
                  {copied ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seção de Como Funciona */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-fredoka text-2xl text-center">Como Funciona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Você Convida</h3>
                <p className="text-muted-foreground">Para cada amigo que se registrar usando seu código, você ganha <strong className="text-foreground">50 pontos</strong>.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <Gift className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Seu Amigo Ganha</h3>
                <p className="text-muted-foreground">Seu amigo que usar o código no momento do cadastro recebe <strong className="text-foreground">30 pontos</strong> de bônus.</p>
              </div>
            </div>
            <div className="bg-amber-500/10 p-4 rounded-lg flex items-start space-x-3">
              <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Limite:</strong> Você pode convidar no máximo 5 amigos por dia.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AffiliatesPage;