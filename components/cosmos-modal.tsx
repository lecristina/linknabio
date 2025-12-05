"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Globe, Zap, Sparkles, ArrowRight, Phone, Code, Palette } from "lucide-react";

interface CosmosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CosmosModal({ open, onOpenChange }: CosmosModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWhatsAppContact = () => {
    setIsLoading(true);
    const phoneNumber = "5511949360561";
    const message = "Olá! Gostaria de contratar o Cosmos - Edições no Site com IA da Axolutions. Podem me ajudar?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    setIsLoading(false);
    onOpenChange(false);
  };

  const features = [
    {
      icon: Code,
      title: "IA Avançada",
      description: "Edição automática de conteúdo com inteligência artificial",
    },
    {
      icon: Palette,
      title: "Edição Intuitiva",
      description: "Interface simples para editar textos, imagens e layout",
    },
    {
      icon: Zap,
      title: "Atualização Instantânea",
      description: "Suas edições aplicadas em tempo real",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Cosmos - Edições no Site com IA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Edite seu Site com IA</h3>
              <p className="text-gray-600 mt-2 text-sm">Edite o conteúdo do seu site com inteligência artificial</p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by AI
            </Badge>
          </div>

          {/* Features Grid */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Por que escolher o Cosmos?</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Edição de conteúdo em segundos, não em horas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Interface intuitiva e fácil de usar
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Sugestões inteligentes de melhoria
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Histórico de alterações e backup automático
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-3">
            <div>
              <h4 className="text-base font-semibold text-gray-900">Pronto para editar seu site?</h4>
              <p className="text-gray-600 mt-1 text-sm">
                Fale com nossa equipe e descubra como o Cosmos pode facilitar suas edições
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleWhatsAppContact}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                size="sm"
              >
                <Phone className="w-4 h-4" />
                {isLoading ? "Abrindo WhatsApp..." : "Falar no WhatsApp"}
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                size="sm"
              >
                Fechar
              </Button>
            </div>

            <p className="text-xs text-gray-500">Nossa equipe responderá em até 2 horas úteis</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
