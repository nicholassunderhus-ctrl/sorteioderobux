import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const RobloxIdPage = () => {
  const [robloxId, setRobloxId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRobloxId = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('roblox_id')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = "not found"
          toast.error("Erro ao buscar seu ID do Roblox.");
        } else if (data && data.roblox_id) {
          setRobloxId(data.roblox_id);
        }
      }
      setLoading(false);
    };

    fetchRobloxId();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ roblox_id: robloxId })
        .eq('id', user.id);

      if (error) {
        toast.error("Não foi possível salvar seu ID. Tente novamente.");
      } else {
        toast.success("Seu ID do Roblox foi salvo com sucesso!");
      }
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen font-fredoka bg-gray-100 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="font-fredoka text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Seu ID do Roblox
              </span>
            </CardTitle>
            <CardDescription className="font-fredoka text-base pt-2">
              Informe seu nome de usuário ou ID do Roblox para receber os prêmios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="robloxId" className="text-lg">ID ou Nome de Usuário</Label>
                  <Input
                    id="robloxId"
                    type="text"
                    placeholder="Ex: meu_usuario123"
                    required
                    value={robloxId}
                    onChange={(e) => setRobloxId(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Atenção:</strong> Este ID será usado para enviar seus prêmios em Robux caso você ganhe. Verifique se ele está correto para garantir o recebimento.
                  </p>
                </div>
                <Button type="submit" className="w-full font-semibold text-lg py-6" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Salvar ID"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RobloxIdPage;