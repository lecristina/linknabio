"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, Users, Zap, Sparkles, ArrowRight, MessageCircle, BarChart3, Smartphone } from "lucide-react";

interface LinkBioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkBioModal({ open, onOpenChange }: LinkBioModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSupportContact = () => {
    setIsLoading(true);
    const phoneNumber = "5511949360561";
    const message = "Olá! Gostaria de contratar o Link na Bio da Axolutions. Podem me ajudar?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    setIsLoading(false);
    onOpenChange(false);
  };

  const features = [
    {
      icon: Link2,
      title: "Links Centralizados",
      description: "Todos os seus links em um só lugar",
    },
    {
      icon: BarChart3,
      title: "Analytics Avançado",
      description: "Acompanhe cliques e engajamento em tempo real",
    },
    {
      icon: Smartphone,
      title: "Design Responsivo",
      description: "Perfeito em qualquer dispositivo",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Link2 className="w-6 h-6 text-primary" />
            Link na Bio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Centralize seus Links</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Aumente o engajamento com seus seguidores em todas as redes sociais
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Social Media
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
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Por que escolher o Link na Bio?</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Aumente o engajamento em até 300%
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Design personalizado com sua marca
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Analytics detalhado de cliques
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Integração com todas as redes sociais
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-3">
            <div>
              <h4 className="text-base font-semibold text-gray-900">Pronto para centralizar seus links?</h4>
              <p className="text-gray-600 mt-1 text-sm">
                Fale com nossa equipe e descubra como o Link na Bio pode aumentar seu engajamento
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSupportContact}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                size="sm"
              >
                <MessageCircle className="w-4 h-4" />
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
