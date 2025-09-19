"use client"

import React, { useState, useEffect } from "react"
import Lottie from "lottie-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [showInvitation, setShowInvitation] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [emailAnimation, setEmailAnimation] = useState(null)

  // Carregar animação
  useEffect(() => {
    fetch('/email-animation.json')
      .then(response => response.json())
      .then(data => setEmailAnimation(data))
      .catch(error => console.error('Erro ao carregar animação:', error))
  }, [])

  const handleEnvelopeClick = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setShowInvitation(true)
    }, 800)
  }

  if (showInvitation) {
    return <InvitationPage />
  }

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all duration-1000 ${
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{ 
        backgroundImage: "url('/image/fundo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden"
      }}
    >
      {/* Gradiente de contraste para melhor legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/70"></div>

      {/* Nuvens estáticas de fundo para melhor contraste */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-12 opacity-15">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-20 h-15" />
        </div>
        <div className="absolute top-20 right-16 opacity-12">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-16 h-12" />
        </div>
        <div className="absolute top-28 left-1/4 opacity-18">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-18 h-14" />
        </div>
        <div className="absolute top-36 right-1/4 opacity-14">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-14 h-11" />
        </div>
        <div className="absolute top-44 left-1/2 opacity-16">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-15 h-12" />
        </div>
        <div className="absolute top-52 right-12 opacity-13">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-17 h-13" />
        </div>
        <div className="absolute top-60 left-16 opacity-15">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-13 h-10" />
        </div>
        <div className="absolute top-68 right-1/3 opacity-17">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-19 h-15" />
        </div>
        <div className="absolute top-76 left-1/3 opacity-14">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-16 h-12" />
        </div>
        <div className="absolute top-84 right-20 opacity-16">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-12 h-9" />
        </div>
      </div>
      
      <div className="text-center space-y-8 relative z-10">
        {/* Título com duas fontes diferentes e animação */}
        <div className="space-y-2 animate-fade-in-up">
          <h1 
            className="text-9xl md:text-[12rem] lg:text-[16rem] xl:text-[18rem] text-balance animate-bounce-slow" 
            style={{ 
              color: "#D0AC8A",
              fontFamily: "'Nuptial Liberty', cursive",
              textShadow: "4px 4px 8px rgba(0,0,0,0.2)"
            }}
          >
            Convite
          </h1>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-balance animate-fade-in-up-delay" 
            style={{ 
              color: "#5A9BA5",
              fontFamily: "'Apple Garamond', 'Garamond', serif",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              fontStyle: "italic"
            }}
          >
            Especial
          </h2>
        </div>

        {/* Envelope animado com Lottie */}
        <div className="flex justify-center">
          <Card
            className="p-8 cursor-pointer hover:scale-110 transition-all duration-500 shadow-2xl envelope-container"
            style={{ backgroundColor: "#ECF2F2", borderColor: "#A9D2D8" }}
            onClick={handleEnvelopeClick}
          >
            <div className="w-32 h-24 relative envelope-wrapper">
              {/* Animação Lottie */}
              {emailAnimation && (
                <Lottie
                  animationData={emailAnimation}
                  loop={true}
                  autoplay={true}
                  className="w-full h-full"
                />
              )}
              {/* Efeito de brilho */}
              <div className="absolute inset-0 envelope-glow"></div>
            </div>
          </Card>
        </div>

        <p className="text-lg font-sans animate-pulse" style={{ color: "#D0AC8A" }}>
          Clique no envelope para abrir o convite
        </p>
      </div>

      {/* CSS para animações */}
      <style jsx>{`
        .envelope-container:hover .envelope-svg {
          animation: envelopeOpen 0.8s ease-in-out forwards;
        }
        
        .envelope-container:hover .envelope-glow {
          animation: glow 1s ease-in-out infinite alternate;
        }
        
        .envelope-container:active .envelope-svg {
          animation: envelopeOpenClick 0.3s ease-in-out forwards;
        }
        
        @keyframes envelopeOpen {
          0% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.05) rotate(-2deg);
          }
          50% {
            transform: scale(1.1) rotate(2deg);
          }
          75% {
            transform: scale(1.08) rotate(-1deg);
          }
          100% {
            transform: scale(1.05) rotate(0deg);
          }
        }
        
        @keyframes envelopeOpenClick {
          0% {
            transform: scale(1.05) rotate(0deg);
          }
          50% {
            transform: scale(1.2) rotate(-5deg);
          }
          100% {
            transform: scale(1.15) rotate(0deg);
          }
        }
        
        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(255, 202, 171, 0.5);
          }
          100% {
            box-shadow: 0 0 20px rgba(255, 202, 171, 0.8);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        
        .animate-fade-in-up-delay {
          animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
      
      {/* Modais renderizados fora do container principal */}
      <ConfirmationModal open={false} onOpenChange={() => {}} />
      <GiftsModal open={false} onOpenChange={() => {}} />
      <LocationModal open={false} onOpenChange={() => {}} />
    </div>
  )
}

function InvitationPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showGiftsModal, setShowGiftsModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)

  return (
    <div 
      className="min-h-screen p-4 animate-fade-in"
      style={{ 
        backgroundImage: "url('/image/fundo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
        width: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: "1rem"
      }}
    >
      {/* Gradiente de contraste para melhor legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/70"></div>

      {/* Nuvens estáticas de fundo para melhor contraste */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-8 opacity-15">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-20 h-15" />
        </div>
        <div className="absolute top-16 right-12 opacity-12">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-16 h-12" />
        </div>
        <div className="absolute top-24 left-1/4 opacity-18">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-18 h-14" />
        </div>
        <div className="absolute top-32 right-1/4 opacity-14">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-14 h-11" />
        </div>
        <div className="absolute top-40 left-1/2 opacity-16">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-15 h-12" />
        </div>
        <div className="absolute top-48 right-8 opacity-13">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-17 h-13" />
        </div>
        <div className="absolute top-56 left-12 opacity-15">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-13 h-10" />
        </div>
        <div className="absolute top-64 right-1/3 opacity-17">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-19 h-15" />
        </div>
        <div className="absolute top-72 left-1/3 opacity-14">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-16 h-12" />
        </div>
        <div className="absolute top-80 right-16 opacity-16">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-12 h-9" />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Stars animadas */}
        <div className="absolute top-10 left-10 w-6 h-6 animate-twinkle">
          <img src="/image/star1.png" alt="Estrela" className="w-full h-full" />
        </div>
        <div className="absolute top-20 right-20 w-4 h-4 animate-twinkle-delay">
          <img src="/image/star1.png" alt="Estrela" className="w-full h-full" />
        </div>
        <div className="absolute bottom-20 left-20 w-5 h-5 animate-twinkle-delay-2">
          <img src="/image/star1.png" alt="Estrela" className="w-full h-full" />
        </div>
        <div className="absolute top-1/2 right-10 w-3 h-3 animate-twinkle-delay-3">
          <img src="/image/star1.png" alt="Estrela" className="w-full h-full" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 animate-twinkle">
          <img src="/image/star1.png" alt="Estrela" className="w-full h-full" />
        </div>

        {/* Clouds animadas */}
        <div className="absolute top-32 left-1/4 opacity-30 animate-float">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-16 h-12" />
        </div>
        <div className="absolute top-20 right-1/3 opacity-20 animate-float-delay">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-12 h-10" />
        </div>
        <div className="absolute top-16 left-1/6 opacity-25 animate-float-slow">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-14 h-10" />
        </div>
        <div className="absolute top-40 right-1/6 opacity-20 animate-float-delay-slow">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-10 h-8" />
        </div>
        <div className="absolute top-24 left-1/2 opacity-30 animate-float">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-12 h-9" />
        </div>
        <div className="absolute top-36 right-1/4 opacity-25 animate-float-delay">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-11 h-8" />
        </div>
        <div className="absolute top-12 left-3/4 opacity-20 animate-float-slow">
          <img src="/image/nuvem1.png" alt="Nuvem" className="w-13 h-10" />
        </div>
        <div className="absolute top-44 left-1/12 opacity-30 animate-float-delay-slow">
          <img src="/image/nuvem2.png" alt="Nuvem" className="w-9 h-7" />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto space-y-8 relative z-10 px-4 pb-8">
        {/* Primeira frase */}
        <div className="text-center animate-slide-in-left">
          <h1 
            className="text-4xl text-balance" 
            style={{ 
              color: "#D0AC8A",
              fontFamily: "'Hello Valentina', cursive"
            }}
          >
            O tempo voa...
          </h1>
        </div>

        {/* Imagem do urso aviador com animação de loop contínuo */}
        <div className="relative h-60 w-full overflow-hidden">
          <div className="bear-animation-loop">
            <img
              src="/image/urso aviador  (1).png"
              alt="Urso aviador no avião"
              className="w-60 h-60 object-contain"
            />
          </div>
          
          {/* Elementos decorativos */}
          <div className="absolute top-4 left-4 animate-float-slow">
            <img src="/image/aviao1.png" alt="Avião decorativo" className="w-12 h-12 opacity-70" />
          </div>
          <div className="absolute top-8 right-8 animate-float-delay-slow">
            <img src="/image/star1.png" alt="Estrela" className="w-8 h-8 opacity-80" />
          </div>
          <div className="absolute bottom-8 left-8 animate-float-slow">
            <img src="/image/nuvem1.png" alt="Nuvem" className="w-16 h-12 opacity-60" />
          </div>
          <div className="absolute bottom-4 right-4 animate-float-delay-slow">
            <img src="/image/nuvem2.png" alt="Nuvem" className="w-14 h-10 opacity-50" />
          </div>
          <div className="absolute top-12 left-1/3 animate-float">
            <img src="/image/nuvem1.png" alt="Nuvem" className="w-12 h-9 opacity-40" />
          </div>
          <div className="absolute bottom-12 right-1/3 animate-float-delay">
            <img src="/image/nuvem2.png" alt="Nuvem" className="w-10 h-8 opacity-45" />
          </div>
          <div className="absolute top-1/2 left-2 animate-float-slow">
            <img src="/image/nuvem1.png" alt="Nuvem" className="w-11 h-8 opacity-35" />
          </div>
          <div className="absolute top-1/2 right-2 animate-float-delay-slow">
            <img src="/image/nuvem2.png" alt="Nuvem" className="w-9 h-7 opacity-40" />
          </div>
        </div>

        {/* Segunda frase */}
        <div className="text-center space-y-4 animate-slide-in-right relative">
          <p 
            className="text-2xl text-balance" 
            style={{ 
              color: "#D0AC8A",
              fontFamily: "'Hello Valentina', cursive"
            }}
          >
            E o nosso pequeno está fazendo seu 1º aninho
          </p>

          {/* Nuvens atrás do nome */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute -top-8 -left-8 opacity-20 animate-float-slow">
              <img src="/image/nuvem1.png" alt="Nuvem" className="w-24 h-18" />
            </div>
            <div className="absolute -top-4 -right-12 opacity-25 animate-float-delay">
              <img src="/image/nuvem2.png" alt="Nuvem" className="w-20 h-15" />
            </div>
            <div className="absolute top-4 -left-16 opacity-15 animate-float">
              <img src="/image/nuvem1.png" alt="Nuvem" className="w-16 h-12" />
            </div>
            <div className="absolute top-8 -right-8 opacity-30 animate-float-delay-slow">
              <img src="/image/nuvem2.png" alt="Nuvem" className="w-18 h-14" />
            </div>
            <div className="absolute -bottom-4 -left-4 opacity-20 animate-float-slow">
              <img src="/image/nuvem1.png" alt="Nuvem" className="w-22 h-16" />
            </div>
            <div className="absolute -bottom-8 -right-16 opacity-25 animate-float">
              <img src="/image/nuvem2.png" alt="Nuvem" className="w-14 h-11" />
            </div>
          </div>

          {/* Nome do aniversariante */}
          <h2 
            className="text-9xl md:text-[10rem] lg:text-[14rem] xl:text-[16rem] text-balance animate-bounce-in-name relative z-10" 
            style={{ 
              color: "#6bbbc7",
              fontFamily: "'Nuptial Liberty', cursive",
              textShadow: "4px 4px 8px rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.6)",
              filter: "drop-shadow(0 6px 12px rgba(169, 210, 216, 0.4))",
              letterSpacing: "0.05em"
            }}
          >
            Henry
          </h2>
        </div>

        {/* Informações do evento em letras grandes */}
        <div className="text-center space-y-6 md:space-y-8 animate-scale-in">
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-1 md:space-y-2">
              <p className="text-2xl md:text-3xl lg:text-4xl font-serif" style={{ color: "#D0AC8A" }}>
                Sexta
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold" style={{ color: "#6bbbc7" }}>
                31.10
              </p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-2xl md:text-3xl lg:text-4xl font-serif" style={{ color: "#D0AC8A" }}>
                Horário
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold" style={{ color: "#6bbbc7" }}>
                19:00
              </p>
            </div>
          </div>

        </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6 mb-4">
                      <div className="animate-bounce-in-delay-1 flex flex-col items-center space-y-2">
                        <ActionButton
                          icon="/image/whatsapp.png"
                          label="Confirme sua presença"
                          color="#FFCAAB"
                          onClick={() => setShowConfirmModal(true)}
                        />
                        <span className="text-xs md:text-sm font-sans text-center" style={{ color: "#D0AC8A" }}>
                          Confirme sua presença
                        </span>
                      </div>
                      <div className="animate-bounce-in-delay-2 flex flex-col items-center space-y-2">
                        <ActionButton
                          icon="/image/giftbox.png"
                          label="Sugestões de presentes"
                          color="#FFCAAB"
                          onClick={() => setShowGiftsModal(true)}
                        />
                        <span className="text-xs md:text-sm font-sans text-center" style={{ color: "#D0AC8A" }}>
                          Sugestões de presentes
                        </span>
                      </div>
                      <div className="animate-bounce-in-delay-3 flex flex-col items-center space-y-2">
                        <ActionButton 
                          icon="/image/location.png" 
                          label="Localização" 
                          color="#FFCAAB" 
                          onClick={() => setShowLocationModal(true)} 
                        />
                        <span className="text-xs md:text-sm font-sans text-center" style={{ color: "#D0AC8A" }}>
                          Localização
                        </span>
                      </div>
                    </div>

        <div className="text-center">
          <p className="text-sm font-sans" style={{ color: "#A9D2D8" }}>
            CLIQUE NOS LINKS PARA INTERAGIR
          </p>
        </div>

        {/* Div para compensar a barra de navegação do iOS */}
        <div className="h-20 md:h-16 lg:h-12"></div>
      </div>


      {/* CSS para animações */}
      <style jsx>{`
        .bear-animation-loop {
          animation: bearFlyLoop 20s linear infinite;
        }
        
        @keyframes bearFlyLoop {
          0% {
            transform: translateX(-100vw) translateY(20px) rotate(-5deg) scale(1);
            opacity: 0;
          }
          2.5% {
            transform: translateX(-80vw) translateY(-5px) rotate(-2deg) scale(1.02);
            opacity: 1;
          }
          5% {
            transform: translateX(-60vw) translateY(15px) rotate(1deg) scale(1.05);
            opacity: 1;
          }
          10% {
            transform: translateX(-40vw) translateY(-8px) rotate(2deg) scale(1.08);
            opacity: 1;
          }
          15% {
            transform: translateX(-20vw) translateY(10px) rotate(-1deg) scale(1.1);
            opacity: 1;
          }
          20% {
            transform: translateX(0vw) translateY(-12px) rotate(3deg) scale(1.12);
            opacity: 1;
          }
          25% {
            transform: translateX(20vw) translateY(8px) rotate(-2deg) scale(1.1);
            opacity: 1;
          }
          30% {
            transform: translateX(40vw) translateY(-10px) rotate(1deg) scale(1.08);
            opacity: 1;
          }
          35% {
            transform: translateX(60vw) translateY(12px) rotate(-1deg) scale(1.05);
            opacity: 1;
          }
          40% {
            transform: translateX(80vw) translateY(-8px) rotate(2deg) scale(1.02);
            opacity: 1;
          }
          45% {
            transform: translateX(100vw) translateY(15px) rotate(-3deg) scale(1);
            opacity: 1;
          }
          47.5% {
            transform: translateX(110vw) translateY(20px) rotate(-5deg) scale(0.98);
            opacity: 0;
          }
          50% {
            transform: translateX(-100vw) translateY(20px) rotate(-5deg) scale(1);
            opacity: 0;
          }
          100% {
            transform: translateX(-100vw) translateY(20px) rotate(-5deg) scale(1);
            opacity: 0;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-twinkle-delay {
          animation: twinkle 2s ease-in-out infinite 0.5s;
        }
        
        .animate-twinkle-delay-2 {
          animation: twinkle 2s ease-in-out infinite 1s;
        }
        
        .animate-twinkle-delay-3 {
          animation: twinkle 2s ease-in-out infinite 1.5s;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 4s ease-in-out infinite 2s;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(-5px) translateX(-5px);
          }
          75% {
            transform: translateY(-15px) translateX(3px);
          }
        }
        
        .animate-bounce-in-delay-1 {
          animation: bounceIn 0.8s ease-out 0.5s both;
        }
        
        .animate-bounce-in-delay-2 {
          animation: bounceIn 0.8s ease-out 0.7s both;
        }
        
        .animate-bounce-in-delay-3 {
          animation: bounceIn 0.8s ease-out 0.9s both;
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(-10px);
          }
          70% {
            transform: scale(0.95) translateY(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out 0.5s both;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out 1s both;
        }
        
        .animate-bounce-in-name {
          animation: bounceInName 1.2s ease-out 1.5s both;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.8s ease-out 2s both;
        }
        
        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }
        
        .animate-float-delay-slow {
          animation: floatSlow 6s ease-in-out infinite 3s;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounceInName {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(100px) rotate(-10deg);
          }
          20% {
            opacity: 0.6;
            transform: scale(0.8) translateY(-30px) rotate(5deg);
          }
          40% {
            opacity: 0.9;
            transform: scale(1.2) translateY(-40px) rotate(-3deg);
          }
          60% {
            opacity: 1;
            transform: scale(0.9) translateY(20px) rotate(2deg);
          }
          75% {
            transform: scale(1.05) translateY(-10px) rotate(-1deg);
          }
          90% {
            transform: scale(0.98) translateY(5px) rotate(0.5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(0deg);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) translateX(3px) rotate(1deg);
          }
          50% {
            transform: translateY(-4px) translateX(-2px) rotate(-1deg);
          }
          75% {
            transform: translateY(-12px) translateX(2px) rotate(0.5deg);
          }
        }
      `}</style>
      
      {/* CSS para layout responsivo com scroll */}
      <style jsx global>{`
        /* Reset básico */
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: 100vh !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }
        
        /* Container principal responsivo */
        .min-h-screen {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: 100vh !important;
          overflow: visible !important;
          position: relative !important;
        }
        
        /* Background responsivo */
        .min-h-screen[style*="background-image"] {
          background-attachment: scroll !important;
          background-position: center !important;
          background-size: cover !important;
          background-repeat: no-repeat !important;
          width: 100% !important;
          min-height: 100vh !important;
        }
        
        /* Box sizing para todos os elementos */
        * {
          box-sizing: border-box !important;
        }
        
        /* Container de conteúdo responsivo */
        .max-w-md {
          max-width: 100% !important;
          width: 100% !important;
          padding: 0 1rem !important;
        }
        
        /* Espaçamento responsivo */
        .space-y-8 > * {
          max-width: 100% !important;
        }
        
        /* Textos responsivos */
        .text-9xl, .text-8xl, .text-7xl, .text-6xl {
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        /* Garantir que botões sejam acessíveis no mobile */
        @media (max-width: 768px) {
          .space-y-8 {
            padding-bottom: 2rem !important;
          }
          
          .grid.grid-cols-3 {
            gap: 1rem !important;
            margin-bottom: 2rem !important;
          }
        }
        
        /* Compensação específica para iOS */
        @supports (-webkit-touch-callout: none) {
          .min-h-screen {
            min-height: calc(100vh - env(safe-area-inset-bottom)) !important;
            padding-bottom: env(safe-area-inset-bottom) !important;
          }
          
          /* Espaçamento adicional para barra de navegação do iOS */
          .space-y-8 {
            padding-bottom: calc(2rem + env(safe-area-inset-bottom)) !important;
          }
        }
      `}</style>
      
      {/* Modais renderizados fora do container principal */}
      <ConfirmationModal open={showConfirmModal} onOpenChange={setShowConfirmModal} />
      <GiftsModal open={showGiftsModal} onOpenChange={setShowGiftsModal} />
      <LocationModal open={showLocationModal} onOpenChange={setShowLocationModal} />
    </div>
  )
}

function ActionButton({
  icon,
  label,
  color,
  onClick,
}: {
  icon: string
  label: string
  color: string
  onClick?: () => void
}) {
  return (
    <Button
      variant="outline"
      className="w-16 h-16 md:w-20 md:h-20 p-0 flex items-center justify-center hover:scale-110 transition-all duration-300 bg-transparent rounded-full shadow-lg hover:shadow-xl border-2"
      style={{
        backgroundColor: color,
        borderColor: "#A9D2D8",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
      onClick={onClick}
    >
      <img 
        src={icon} 
        alt={label} 
        className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm" 
      />
    </Button>
  )
}

function ConfirmationModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [name, setName] = useState("")
  const [willAttend, setWillAttend] = useState("true")
  const [numberOfPeople, setNumberOfPeople] = useState(1)
  const [peopleNames, setPeopleNames] = useState<string[]>([""])
  const [peopleAges, setPeopleAges] = useState<number[]>([7])
  const [isLoading, setIsLoading] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      checkRegistrationStatus()
      
      // Aplicar estilos diretamente no body
      const body = document.body
      if (body) {
        body.style.margin = '0'
        body.style.padding = '0'
        body.style.overflow = 'hidden'
      }
      
      return () => {
        // Restaurar estilos quando modal fecha
        if (body) {
          body.style.margin = ''
          body.style.padding = ''
          body.style.overflow = ''
        }
      }
    }
  }, [open])

  // Sincronizar nome principal com o primeiro campo
  useEffect(() => {
    if (peopleNames.length > 0) {
      const newNames = [...peopleNames]
      newNames[0] = name
      setPeopleNames(newNames)
    }
  }, [name])

  const checkRegistrationStatus = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("admin_settings")
        .select("registration_enabled")
        .order("created_at", { ascending: true })
        .limit(1)
        .single()

      if (!error && data) {
        setRegistrationEnabled(data.registration_enabled)
      }
    } catch (error) {
      console.error("Erro ao verificar status das inscrições:", error)
    }
  }

  const handleNumberOfPeopleChange = (value: number) => {
    setNumberOfPeople(value)
    // Ajustar array de nomes baseado no número de pessoas
    const newNames = Array(value).fill("").map((_, index) => {
      if (index === 0) {
        return name // Primeiro campo sempre com o nome principal
      }
      return peopleNames[index] || ""
    })
    // Ajustar array de idades
    const newAges = Array(value).fill(7).map((_, index) => peopleAges[index] || 7)
    setPeopleNames(newNames)
    setPeopleAges(newAges)
  }

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...peopleNames]
    newNames[index] = value
    setPeopleNames(newNames)
  }

  const handleAgeChange = (index: number, value: number) => {
    // A primeira pessoa (index 0) sempre deve ter 6 anos ou mais
    if (index === 0 && value < 6) {
      return
    }
    const newAges = [...peopleAges]
    newAges[index] = value
    setPeopleAges(newAges)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulário submetido")
    
    if (!name.trim()) {
      console.log("Nome vazio, cancelando envio")
      return
    }

    console.log("Dados do formulário:", {
      name: name.trim(),
      willAttend,
      numberOfPeople,
      peopleNames,
      peopleAges
    })

    setIsLoading(true)

    try {
      // Preparar nomes e contagem de pessoas 6+ anos
      const additionalNames = peopleNames.slice(1).filter(n => n.trim()).join(", ")
      const peopleOver6 = peopleAges.filter(age => age >= 6).length
      const hasChildrenOver6 = peopleAges.some(age => age >= 6)
      
      console.log("Dados preparados para inserção:", {
        name: name.trim(),
        will_attend: willAttend === "true",
        number_of_people: numberOfPeople,
        additional_names: additionalNames,
        people_over_6: peopleOver6,
        has_children_over_6: hasChildrenOver6,
      })
      
      // Salvar no Supabase
      const supabase = createClient()
      console.log("Tentando inserir no Supabase...")
      
      // Tentar inserir com todas as colunas primeiro
      let insertData = {
        name: name.trim(),
        will_attend: willAttend === "true",
      }

      // Adicionar colunas opcionais se existirem
      let data, error
      
      try {
        const result = await supabase.from("confirmations").insert({
          ...insertData,
          number_of_people: numberOfPeople,
          additional_names: additionalNames,
          people_over_6: peopleOver6,
          has_children_over_6: hasChildrenOver6,
        }).select()

        data = result.data
        error = result.error

        if (error) {
          console.log("Tentando inserção com colunas básicas...")
          // Se falhar, tentar apenas com colunas básicas
          const basicResult = await supabase.from("confirmations").insert(insertData).select()
          
          if (basicResult.error) {
            console.error("Erro com colunas básicas:", basicResult.error)
            throw basicResult.error
          }
          
          console.log("Inserção básica bem-sucedida:", basicResult.data)
          data = basicResult.data
          error = null
        } else {
          console.log("Inserção completa bem-sucedida:", data)
        }
      } catch (insertError) {
        console.error("Erro na inserção:", insertError)
        throw insertError
      }

      if (error) {
        console.error("Erro do Supabase:", error)
        throw error
      }

      console.log("Dados inseridos com sucesso:", data)

      // Criar mensagem para WhatsApp
      let message = ""
      if (willAttend === "true") {
        const allNames = [name.trim(), ...peopleNames.slice(1).filter(n => n.trim())].join(", ")
        const peopleText = numberOfPeople === 1 ? "eu" : `nós (${allNames})`
        const childrenText = peopleAges.some(age => age < 6) ? " - Temos crianças pequenas" : ""
        message = `Olá Jesa! Meu nome é ${name.trim()} e estou confirmando que ${peopleText} estaremos na festa do Henry! 🎉${childrenText}`
      } else {
        message = `Olá Jesa! Meu nome é ${name.trim()} e infelizmente não poderei comparecer na festa do Henry. 😔`
      }

      // Abrir WhatsApp
      const whatsappUrl = `https://wa.me/351931926460?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')

      toast({
        title: "Confirmação enviada!",
        description: "Redirecionando para o WhatsApp...",
      })

      // Reset form
      setName("")
      setWillAttend("true")
      setNumberOfPeople(1)
      setPeopleNames([""])
      setPeopleAges([7])
      onOpenChange(false)
    } catch (error) {
      console.error("Erro completo ao enviar confirmação:", error)
      toast({
        title: "Erro ao enviar confirmação",
        description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-3 border bg-background p-4 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl" 
        style={{ 
          backgroundColor: "#F8FAF9",
          borderColor: "#A9D2D8",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#D0AC8A" }}>Confirmar Presença</DialogTitle>
        </DialogHeader>
        
        {!registrationEnabled ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🚫</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#D0AC8A" }}>
              Inscrições Pausadas
            </h3>
            <p className="text-sm mb-4" style={{ color: "#5A9BA5" }}>
              As inscrições foram temporariamente pausadas.
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full"
              style={{ backgroundColor: "#FFCAAB", color: "#D0AC8A" }}
            >
              Fechar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" style={{ color: "#D0AC8A" }}>
              Seu nome *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Digite seu nome completo"
              style={{ borderColor: "#A9D2D8" }}
            />
          </div>

          <div>
            <Label style={{ color: "#D0AC8A" }}>Você vai comparecer?</Label>
            <RadioGroup value={willAttend} onValueChange={setWillAttend} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="yes" />
                <Label htmlFor="yes" style={{ color: "#D0AC8A" }}>
                  Sim, estarei presente! 🎉
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="no" />
                <Label htmlFor="no" style={{ color: "#D0AC8A" }}>
                  Não poderei comparecer 😔
                </Label>
              </div>
            </RadioGroup>
          </div>

          {willAttend === "true" && (
            <>
              <div>
                <Label htmlFor="numberOfPeople" style={{ color: "#D0AC8A" }}>
                  Quantas pessoas vão? (incluindo você)
                </Label>
                <select
                  id="numberOfPeople"
                  value={numberOfPeople}
                  onChange={(e) => handleNumberOfPeopleChange(parseInt(e.target.value))}
                  className="w-full h-10 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    borderColor: "#A9D2D8",
                    backgroundColor: "#F8FAF9"
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num} pessoa{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {numberOfPeople > 1 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium" style={{ color: "#D0AC8A" }}>
                    Nomes das pessoas:
                  </Label>
                  {peopleNames.map((personName, index) => (
                    <div key={index} className="space-y-2 p-2 border rounded-md" style={{ borderColor: "#A9D2D8", backgroundColor: "rgba(248, 250, 249, 0.5)" }}>
                      <div>
                        <Label htmlFor={`person-${index}`} className="text-xs" style={{ color: "#5A9BA5" }}>
                          {index === 0 ? "Seu nome:" : `Pessoa ${index + 1}:`}
                        </Label>
                        <Input
                          id={`person-${index}`}
                          value={personName}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          placeholder={index === 0 ? "Seu nome" : `Nome ${index + 1}`}
                          className="text-sm h-8"
                          style={{ borderColor: "#A9D2D8" }}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`under6-${index}`}
                          checked={peopleAges[index] < 6}
                          onChange={(e) => handleAgeChange(index, e.target.checked ? 5 : 7)}
                          disabled={index === 0}
                          style={{ 
                            accentColor: "#A9D2D8",
                            opacity: index === 0 ? 0.5 : 1,
                            cursor: index === 0 ? "not-allowed" : "pointer"
                          }}
                        />
                        <Label 
                          htmlFor={`under6-${index}`} 
                          className="text-xs" 
                          style={{ 
                            color: index === 0 ? "#A9D2D8" : "#5A9BA5",
                            opacity: index === 0 ? 0.7 : 1
                          }}
                        >
                          {index === 0 ? "Tem mais de 6 anos (obrigatório)" : "Tem menos de 6 anos"}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full"
              style={{ backgroundColor: "#d67842", color: "#ffffff" }}
            >
              {isLoading ? "Enviando..." : "Confirmar e Abrir WhatsApp"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function GiftsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [gifts, setGifts] = useState<Array<{name: string, description?: string}>>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchGifts()
    }
  }, [open])

  const fetchGifts = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("gifts")
        .select("name, description")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      if (error) throw error
      setGifts(data || [])
    } catch (error) {
      console.error("Erro ao buscar presentes:", error)
      // Fallback para lista padrão
      setGifts([
        { name: "Roupinhas (tamanho 1-2 anos)" },
        { name: "Brinquedos educativos" },
        { name: "Livros infantis" },
        { name: "Fraldas (tamanho G ou GG)" },
        { name: "Produtos de higiene infantil" },
        { name: "Brinquedos de banho" },
        { name: "Pelúcias macias" },
        { name: "Blocos de montar grandes" },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-sm p-4" 
        style={{ 
          backgroundColor: "#F8FAF9",
          borderColor: "#A9D2D8",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg" style={{ color: "#D0AC8A" }}>Sugestões de Presentes</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p style={{ color: "#5A9BA5" }} className="text-sm">
            Ideias para presentear o Henry:
          </p>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto mb-2" style={{ borderColor: "#A9D2D8" }}></div>
              <p style={{ color: "#5A9BA5" }} className="text-xs">Carregando presentes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
              {gifts.map((gift, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 rounded-md" style={{ backgroundColor: "rgba(248, 250, 249, 0.5)" }}>
                  <span style={{ color: "#A9D2D8" }}>🎁</span>
                  <div>
                    <span style={{ color: "#D0AC8A" }} className="text-xs font-medium">
                      {gift.name}
                    </span>
                    {gift.description && (
                      <p style={{ color: "#5A9BA5" }} className="text-xs mt-1">
                        {gift.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p style={{ color: "#A9D2D8" }} className="text-xs text-center pt-2">
            Lembre-se: sua presença já é o melhor presente! 💝
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LocationModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const address = "Rua Noruega 155, Maraponga, Fortaleza - CE"
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Karol Buffet " + address)}`
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent("Karol Buffet " + address)}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-sm p-4" 
        style={{ 
          backgroundColor: "#F8FAF9",
          borderColor: "#A9D2D8",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg" style={{ color: "#D0AC8A" }}>Localização da Festa</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-center space-y-2 p-3 rounded-md" style={{ backgroundColor: "rgba(248, 250, 249, 0.5)" }}>
            <h3 style={{ color: "#A9D2D8" }} className="text-base font-serif">
              Karol Buffet
            </h3>
            <p style={{ color: "#D0AC8A" }} className="text-xs">
              {address}
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => window.open(googleMapsUrl, "_blank")}
              className="w-full h-8 text-xs"
              style={{ backgroundColor: "#A9D2D8", color: "#F8FAF9" }}
            >
              📍 Google Maps
            </Button>

            <Button
              onClick={() => window.open(wazeUrl, "_blank")}
              className="w-full h-8 text-xs"
              style={{ backgroundColor: "#FFCAAB", color: "#D0AC8A" }}
            >
              🚗 Waze
            </Button>
          </div>

          <div className="text-center">
            <p style={{ color: "#D0AC8A" }} className="text-xs">
              Chegue um pouquinho antes! ⏰
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
