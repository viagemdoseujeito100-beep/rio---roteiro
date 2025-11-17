import React, { useState, useCallback, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { PdfDocument } from './components/PdfDocument';
import { generateItinerary } from './services/geminiService';
import type { FormData } from './types';
import { INTERESTS, TRIP_DURATIONS, LODGING_NEIGHBORHOODS, LODGING_TYPES, GROUP_COMPOSITION, ACCESSIBILITY_OPTIONS, TRAVEL_PACING, DAILY_BUDGETS, MEAL_OPTIONS, TRANSPORT_OPTIONS } from './constants';
import { RefreshIcon, SparklesIcon, DownloadIcon, ChevronDownIcon, GiftIcon, DollarSignIcon, MapPinIcon, BeerIcon, CheckSquareIcon, ClockIcon, StarIcon } from './components/icons/Icons';

type View = 'landing' | 'form' | 'loading' | 'payment' | 'result';

const LandingContent = ({ onStart }: { onStart: () => void }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 20,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer for demo purposes
          hours = 0;
          minutes = 20;
          seconds = 0;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const bonuses = [
    {
      icon: <DollarSignIcon className="w-12 h-12 text-green-600" />,
      titulo: "Plano Financeiro de Gastos",
      descricao: "Organize seu orçamento dia a dia",
      valor_original: "R$ 29,90",
    },
    {
      icon: <MapPinIcon className="w-12 h-12 text-red-600" />,
      titulo: "Dicas de Restaurantes",
      descricao: "Os melhores lugares para comer",
      valor_original: "R$ 5,90",
    },
    {
      icon: <MapPinIcon className="w-12 h-12 text-blue-600" />,
      titulo: "Onde se Hospedar",
      descricao: "Conhecendo os bairros do Rio",
      valor_original: "R$ 9,90",
    },
    {
      icon: <BeerIcon className="w-12 h-12 text-yellow-600" />,
      titulo: "Roteiro do Cervejeiro",
      descricao: "Bares e cervejarias imperdíveis",
      valor_original: "R$ 14,90",
    },
    {
      icon: <CheckSquareIcon className="w-12 h-12 text-purple-600" />,
      titulo: "Check List de Viagem",
      descricao: "O que levar para o Rio",
      valor_original: "R$ 9,90",
    },
  ];
  
  const testimonials = [
      {
          quote: "Incrível! O roteiro otimizou tanto nossa viagem que conseguimos visitar lugares que nem imaginávamos ser possível. As dicas de restaurantes foram certeiras. Super recomendo!",
          name: "Ana Clara",
          location: "São Paulo, SP"
      },
      {
          quote: "Fui para o Rio com medo de cair em roubadas de turista. Esse roteiro me levou para cantinhos secretos e autênticos da cidade. Foi como ter um amigo carioca nos guiando. Valeu cada centavo!",
          name: "Marcos Oliveira",
          location: "Belo Horizonte, MG"
      },
      {
          quote: "Viajamos em família e o roteiro foi perfeito para todas as idades. As crianças amaram e nós também. Economizamos muito tempo de planejamento e aproveitamos o Rio de verdade.",
          name: "Família Souza",
          location: "Curitiba, PR"
      }
  ];


  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?q=80&w=1600&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} role="region" aria-label="Hero section com Pão de Açúcar">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-20">
          <div className="mb-8">
            <span className="inline-block bg-red-500/90 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-6 animate-pulse">
              🎁 GANHE 5 BÔNUS GRÁTIS - VALOR TOTAL: R$ 69,50
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 sm:mb-8 uppercase leading-tight">Explore o Rio<br />Como um Carioca</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-2xl mx-auto">Um roteiro personalizado criado com inteligência artificial e curadoria humana. Descubra os lugares que todo mundo vê no TikTok mas ninguém consegue encontrar.</p>
          <button onClick={onStart} className="bg-red-500 hover:bg-red-600 text-white font-black text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-5 sm:py-6 md:py-7 rounded-lg shadow-2xl transform hover:scale-105 transition uppercase w-full sm:w-auto" aria-label="Quero receber meu roteiro por R$ 19,90">
            Quero Receber Meu Roteiro
          </button>
          <div className="mt-12 sm:mt-16 animate-bounce">
            <ChevronDownIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white mx-auto" />
          </div>
        </div>
      </section>
      
      {/* BÔNUS SECTION */}
      <section className="py-16 sm:py-20 md:py-24 px-4 relative overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543725262-4377e7722758?q=80&w=1600&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 via-red-600/80 to-pink-600/80"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4"><GiftIcon className="w-16 h-16 text-white mx-auto animate-bounce" /></div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 uppercase">Ganhe 5 Bônus Incríveis</h2>
            <p className="text-xl text-white max-w-2xl mx-auto mb-8">Ao comprar seu roteiro personalizado, você ganha esses 5 bônus no valor total de <span className="font-black text-yellow-300">R$ 69,50</span></p>

            <div className="bg-red-600/90 backdrop-blur-sm border-4 border-yellow-300 rounded-xl p-6 max-w-md mx-auto mb-8 animate-pulse">
              <div className="flex items-center justify-center gap-2 mb-3">
                <ClockIcon className="w-6 h-6 text-yellow-300" />
                <p className="text-white font-black text-lg">OFERTA EXPIRA EM:</p>
              </div>
              <div className="flex justify-center gap-4 text-white">
                <div className="bg-red-700/50 rounded-lg p-4 min-w-[5rem]"><div className="text-4xl font-black text-yellow-300">{String(timeLeft.hours).padStart(2, '0')}</div><div className="text-xs font-bold mt-1">HORAS</div></div>
                <div className="text-4xl font-black text-yellow-300 self-center">:</div>
                <div className="bg-red-700/50 rounded-lg p-4 min-w-[5rem]"><div className="text-4xl font-black text-yellow-300">{String(timeLeft.minutes).padStart(2, '0')}</div><div className="text-xs font-bold mt-1">MINUTOS</div></div>
                <div className="text-4xl font-black text-yellow-300 self-center">:</div>
                <div className="bg-red-700/50 rounded-lg p-4 min-w-[5rem]"><div className="text-4xl font-black text-yellow-300">{String(timeLeft.seconds).padStart(2, '0')}</div><div className="text-xs font-bold mt-1">SEGUNDOS</div></div>
              </div>
              <p className="text-yellow-300 font-black text-sm mt-4 animate-bounce">NÃO PERCA ESSA OPORTUNIDADE!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 bg-white border-2 border-gray-300 rounded-lg"><h3 className="text-2xl font-black text-gray-900 mb-6 text-center">SEM OS BÔNUS</h3><div className="space-y-3 mb-8"><div className="text-lg text-gray-600">Roteiro Personalizado: <span className="font-black text-gray-900">R$ 19,90</span></div><div className="text-lg text-gray-600">Plano Financeiro: <span className="font-black text-gray-900">R$ 29,90</span></div><div className="text-lg text-gray-600">Dicas de Restaurantes: <span className="font-black text-gray-900">R$ 5,90</span></div><div className="text-lg text-gray-600">Onde se Hospedar: <span className="font-black text-gray-900">R$ 9,90</span></div><div className="text-lg text-gray-600">Roteiro do Cervejeiro: <span className="font-black text-gray-900">R$ 14,90</span></div><div className="text-lg text-gray-600">Check List de Viagem: <span className="font-black text-gray-900">R$ 9,90</span></div></div><div className="border-t-2 border-gray-300 pt-4"><p className="text-center text-gray-600">Total:</p><p className="text-center text-4xl font-black text-gray-900">R$ 89,40</p></div></div>
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-500 transform scale-105 shadow-2xl rounded-lg relative"><div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full font-black text-sm">MELHOR OFERTA</div><h3 className="text-2xl font-black text-green-900 mb-6 text-center mt-4">COM OS BÔNUS</h3><div className="space-y-3 mb-8"><div className="text-lg text-green-700">Roteiro Personalizado: <span className="font-black text-green-900">R$ 19,90</span></div><div className="text-lg text-green-700">Plano Financeiro: <span className="line-through text-gray-500">R$ 29,90</span> <span className="font-black text-green-600 ml-2">GRÁTIS</span></div><div className="text-lg text-green-700">Dicas de Restaurantes: <span className="line-through text-gray-500">R$ 5,90</span> <span className="font-black text-green-600 ml-2">GRÁTIS</span></div><div className="text-lg text-green-700">Onde se Hospedar: <span className="line-through text-gray-500">R$ 9,90</span> <span className="font-black text-green-600 ml-2">GRÁTIS</span></div><div className="text-lg text-green-700">Roteiro do Cervejeiro: <span className="line-through text-gray-500">R$ 14,90</span> <span className="font-black text-green-600 ml-2">GRÁTIS</span></div><div className="text-lg text-green-700">Check List de Viagem: <span className="line-through text-gray-500">R$ 9,90</span> <span className="font-black text-green-600 ml-2">GRÁTIS</span></div></div><div className="border-t-4 border-green-500 pt-4"><p className="text-center text-green-700">Total:</p><p className="text-center text-5xl font-black text-green-600">R$ 19,90</p><p className="text-center text-green-700 font-bold mt-2">Economia: R$ 69,50 (78%)</p></div></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {bonuses.map((bonus, index) => (<div key={index} className="overflow-hidden hover:shadow-xl transition transform hover:scale-105 bg-white border-2 border-gray-200 rounded-lg"><div className="p-4 text-center"><div className="flex justify-center mb-3">{bonus.icon}</div><h3 className="font-black text-gray-900 mb-2 text-xs uppercase">{bonus.titulo}</h3><p className="text-xs text-gray-600 mb-3">{bonus.descricao}</p><div className="space-y-1"><p className="text-xs text-gray-500 line-through">{bonus.valor_original}</p><p className="text-sm font-black text-green-600">GRÁTIS</p></div></div></div>))}
          </div>

          <div className="text-center">
            <button onClick={onStart} className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-black text-lg px-12 py-8 rounded-xl shadow-2xl transform hover:scale-110 transition uppercase">Quero Meus Bônus e Roteiro Agora!</button>
            <p className="text-yellow-300 mt-4 font-bold">Economize R$ 69,50 em bônus exclusivos!</p>
            <p className="text-white mt-2 font-bold">⏰ Oferta válida apenas hoje!</p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto"><h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center uppercase">Você Enfrenta Esses Problemas na Viagem para o Rio?</h2><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">{[{icon: "📍",titulo: "Só Visita Pontos Turísticos Conhecidos",descricao: "Acaba visitando os mesmos lugares que todo mundo"},{icon: "🚗",titulo: "Roda a Cidade e Não Vai em Nada Diferente",descricao: "Perde tempo se deslocando entre bairros sem aproveitar"},{icon: "😰",titulo: "Vê Lugares Incríveis no TikTok Mas Ninguém Consegue Encontrar",descricao: "Fica frustrado procurando no Google e Instagram"}].map((item, index) => (<div key={index} className="p-6 sm:p-8 text-center hover:shadow-lg transition bg-gray-50 rounded-lg"><div className="text-4xl sm:text-5xl mb-4">{item.icon}</div><h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 uppercase">{item.titulo}</h3><p className="text-sm sm:text-base text-gray-600">{item.descricao}</p></div>))}</div></div>
      </section>
      
      <section className="py-12 sm:py-16 md:py-20 px-4 relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548393425-77c89f86b55e?q=80&w=1600&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} role="region" aria-label="Seção da solução com vista da Baía">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-blue-900/90"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center"><h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 sm:mb-8 uppercase">O Roteiro Inteligente do Rio</h2><p className="text-base sm:text-lg text-white/90 mb-8 sm:mb-12">Um roteiro personalizado criado com inteligências artificial e curadoria humana que agrupa atividades por proximidade, economizando seu tempo e dinheiro.</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">{[{ icon: "⚡", titulo: "Roteiro Otimizado", descricao: "Atividades agrupadas por proximidade" },{ icon: "🎯", titulo: "Especifico em Tudo", descricao: "Horários, restaurantes, transportes" },{ icon: "💰", titulo: "Economiza Dinheiro", descricao: "Menos deslocamentos, mais aproveitamento" },{ icon: "🤖", titulo: "Inteligência Artificial", descricao: "Com curadoria humana especializada" }].map((item, index) => (<div key={index} className="p-4 sm:p-6 bg-white/10 border border-white/20 text-white rounded-lg"><div className="text-3xl sm:text-4xl mb-3">{item.icon}</div><h3 className="font-black text-base sm:text-lg mb-2 uppercase">{item.titulo}</h3><p className="text-xs sm:text-sm text-white/80">{item.descricao}</p></div>))}</div><button onClick={onStart} className="bg-white text-teal-600 hover:bg-gray-100 font-black text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-5 sm:py-6 md:py-7 rounded-lg shadow-2xl transform hover:scale-105 transition uppercase" aria-label="Quero receber meu roteiro por R$ 19,90">Quero Receber Meu Roteiro</button></div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto"><h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center uppercase">O Que Você Vai Experimentar</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12">{[
            {icon: <CheckSquareIcon className="w-16 h-16 text-teal-600" />, titulo: "Confiança",descricao: "Explore a cidade sem medo de se perder"},
            {icon: <ClockIcon className="w-16 h-16 text-teal-600" />, titulo: "Economia de Tempo",descricao: "Atividades agrupadas por proximidade"},
            {icon: <DollarSignIcon className="w-16 h-16 text-teal-600" />, titulo: "Economia de Dinheiro",descricao: "Menos deslocamentos, mais aproveitamento"},
            {icon: <StarIcon className="w-16 h-16 text-yellow-500" />, titulo: "Experiências Únicas",descricao: "Lugares que poucos conhecem"}
        ].map((item, index) => (<div key={index} className="hover:shadow-lg transition bg-gray-50 rounded-lg p-6 sm:p-8 text-center"><div className="mb-4 inline-block">{item.icon}</div><h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2 uppercase">{item.titulo}</h3><p className="text-sm sm:text-base text-gray-600">{item.descricao}</p></div>))}</div></div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center uppercase">O Que Dizem Nossos Clientes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
                          <div className="flex text-yellow-400 mb-4">
                              <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                          </div>
                          <p className="text-gray-600 italic mb-4 flex-grow">"{testimonial.quote}"</p>
                          <div>
                              <p className="font-black text-gray-800">{testimonial.name}</p>
                              <p className="text-sm text-gray-500">{testimonial.location}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601056588259-9d6288739343?q=80&w=1600&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} role="region" aria-label="Seção de preço com vista do Maracanã">
        <div className="absolute inset-0 bg-black/50"></div><div className="relative z-10 max-w-4xl mx-auto text-center"><div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-6">PREÇO PROMOCIONAL - SÓ HOJE</div><h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 uppercase">R$ 19,90</h2><p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-6">O melhor investimento da sua viagem</p><p className="text-sm sm:text-base text-white/80 mb-8 sm:mb-12">+ 5 Bônus no valor de R$ 69,50 GRÁTIS</p><div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-lg mb-8 sm:mb-12 border border-white/20"><h3 className="text-lg sm:text-xl font-black text-white mb-4 uppercase">O Que Você Ganha</h3><ul className="text-left space-y-3 text-white">{[ "Roteiro personalizado com IA e curadoria humana", "Horários específicos do dia todo", "Sugestões de restaurantes e bares", "Acesso imediato por email", "5 Bônus Incríveis (Valor: R$ 69,50)"].map(item => (<li key={item} className="flex items-center gap-3"><span className="text-red-400 font-bold">✓</span><span>{item}</span></li>))}</ul></div><div className="mb-8 sm:mb-12 p-6 sm:p-8 bg-white/5 rounded-lg border-2 border-red-400 animate-pulse"><button onClick={onStart} className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-black text-base sm:text-lg md:text-2xl px-8 sm:px-12 md:px-16 py-6 sm:py-8 md:py-10 rounded-xl shadow-2xl transform hover:scale-110 transition-all duration-300 uppercase w-full" aria-label="Comprar roteiro personalizado por R$ 19,90">🎁 QUERO RECEBER MEU ROTEIRO</button><p className="text-white/90 text-xs sm:text-sm mt-4 font-bold animate-bounce text-center">⏰ Oferta válida apenas hoje!</p></div></div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto"><h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center uppercase">Perguntas Frequentes</h2><div className="space-y-4 sm:space-y-6">{[{pergunta: "Quanto tempo leva para receber o roteiro?",resposta: "Você recebe o roteiro por email em até 24 horas após preencher o formulário de personalização."},{pergunta: "Posso usar o roteiro para viajar com meu grupo?",resposta: "Sim! O roteiro é personalizado para seu grupo específico. Você pode compartilhar com seus amigos ou família."},{pergunta: "O roteiro é apenas para 3 dias?",resposta: "Não! Você escolhe a duração da sua viagem no formulário de personalização. Pode ser 2, 3, 5 dias ou mais."},{pergunta: "Preciso ter experiência de viagem para usar?",resposta: "Não! O roteiro é feito para todos os níveis. Desde iniciantes até viajantes experientes."},{pergunta: "Posso editar o roteiro depois de receber?",resposta: "Sim! O roteiro é seu. Você pode fazer ajustes conforme achar necessário durante a viagem."},{pergunta: "Qual é o formato do roteiro?",resposta: "Você recebe um PDF detalhado com horários, endereços, dicas e sugestões de transporte."}].map((faq, index) => (<div key={index} className="p-4 sm:p-6 bg-gray-50 rounded-lg"><details className="cursor-pointer group"><summary className="font-black text-gray-900 text-sm sm:text-base uppercase flex justify-between items-center"><span>{faq.pergunta}</span><ChevronDownIcon className="w-5 h-5 text-gray-500 transition-transform duration-300 group-open:rotate-180" /></summary><p className="text-gray-600 mt-4 text-sm sm:text-base">{faq.resposta}</p></details></div>))}</div></div>
      </section>
    </div>
  );
};

const PaymentContent = ({ onConfirm }: { onConfirm: () => void }) => {
    return (
        <div className="text-center text-white p-8 animate-fade-in">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400 mb-4">Quase lá!</h2>
            <p className="text-gray-300 mb-6 text-lg">Seu roteiro personalizado está pronto. Complete o pagamento para desbloquear sua viagem inesquecível ao Rio.</p>
            
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 mb-8 max-w-sm mx-auto">
                <p className="text-gray-400 uppercase text-sm font-bold">Valor Total</p>
                <p className="text-5xl font-black my-2">R$ 19,90</p>
                <p className="text-gray-300">Pagamento único e seguro.</p>
            </div>

            <button
                onClick={onConfirm}
                className="w-full max-w-sm bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center text-lg disabled:bg-gray-500"
            >
                <SparklesIcon />
                <span className="ml-2">Confirmar Pagamento e Ver Roteiro</span>
            </button>
            <p className="text-xs text-gray-500 mt-4">(Isso é uma simulação de pagamento)</p>
        </div>
    );
};


const SECOES = [
  { id: 1, titulo: 'Dados Básicos' },
  { id: 2, titulo: 'Logística da Viagem' },
  { id: 3, titulo: 'Voos e Transporte' },
  { id: 4, titulo: 'Composição do Grupo' },
  { id: 5, titulo: 'Interesses' },
  { id: 6, titulo: 'Orçamento e Transporte' },
  { id: 7, titulo: 'Alimentação' },
  { id: 8, titulo: 'Otimização' },
];

const DetailedItineraryForm = ({ onSubmit, onBack }: { onSubmit: (data: FormData) => void, onBack: () => void }) => {
  const [secaoAtual, setSecaoAtual] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nome: '', email: '', duracao_dias: '', data_inicio: '', bairro_hospedagem: '',
    tipo_hospedagem: '', composicao_grupo: [], idade_minima: '', idade_maxima: '',
    acessibilidade_pcd: '', interesses_principais: [], ritmo_viagem: '',
    orcamento_diario: '', meio_transporte: [], fazer_refeicoes_em_casa: '',
    refeicoes_em_casa_frequencia: [], otimizar_tempo: '', passagem_comprada: '',
    horario_chegada: '', horario_voo_volta: '', tipo_transporte_principal: '',
    tem_bebe: '', horario_sono_bebe: '', criar_roteiro_conforme_bebe: '',
  });
   const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const secaoAtualObj = SECOES.find(s => s.id === secaoAtual);
  const progresso = (secaoAtual / SECOES.length) * 100;

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
     if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const array = prev[field] as string[];
      const newArray = array.includes(value)
        ? array.filter(item => item !== value)
        : [...array, value];
      return { ...prev, [field]: newArray };
    });
     if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const validarSecao = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const camposObrigatorios: { [key: number]: (keyof FormData)[] } = {
        1: ['nome', 'email'],
        2: ['duracao_dias', 'data_inicio', 'bairro_hospedagem', 'tipo_hospedagem'],
        3: ['passagem_comprada', 'tipo_transporte_principal'],
        4: ['composicao_grupo', 'idade_minima', 'idade_maxima', 'acessibilidade_pcd', 'tem_bebe'],
        5: ['interesses_principais', 'ritmo_viagem'],
        6: ['orcamento_diario', 'meio_transporte'],
        7: ['fazer_refeicoes_em_casa'],
        8: ['otimizar_tempo'],
    };

    if (formData.passagem_comprada === 'Sim') {
        camposObrigatorios[3].push('horario_chegada', 'horario_voo_volta');
    }
    if (formData.tem_bebe === 'Sim') {
        camposObrigatorios[4].push('horario_sono_bebe', 'criar_roteiro_conforme_bebe');
    }

    const camposParaValidar = camposObrigatorios[secaoAtual] || [];

    // 1. Check for required fields
    camposParaValidar.forEach(campo => {
        const valor = formData[campo];
        if ((typeof valor === 'string' && !valor.trim()) || (Array.isArray(valor) && valor.length === 0)) {
            newErrors[campo] = 'Este campo é obrigatório.';
        }
    });

    // 2. Perform specific validations only if the field is not already marked as empty
    // Section 1: Email format
    if (secaoAtual === 1 && !newErrors.email && formData.email) {
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Por favor, insira um email válido.';
        }
    }
    
    // Section 2: Date cannot be in the past
    if (secaoAtual === 2 && !newErrors.data_inicio && formData.data_inicio) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
        const selectedDate = new Date(formData.data_inicio + 'T00:00:00');
        if (selectedDate < today) {
            newErrors.data_inicio = 'A data de início não pode ser no passado.';
        }
    }

    // Section 4: Max age > min age
    if (secaoAtual === 4 && !newErrors.idade_maxima && formData.idade_minima && formData.idade_maxima) {
        if (parseInt(formData.idade_maxima) < parseInt(formData.idade_minima)) {
            newErrors.idade_maxima = 'A idade máxima deve ser maior ou igual à mínima.';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


  const handleProximo = () => {
    if (validarSecao()) {
      if (secaoAtual < SECOES.length) {
        setSecaoAtual(secaoAtual + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleVoltar = () => {
    if (secaoAtual > 1) {
      setSecaoAtual(secaoAtual - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEnviar = () => {
    if (validarSecao()) {
      onSubmit(formData);
    }
  };
  
  const getInputClass = (field: keyof FormData) => 
    `w-full bg-gray-700 border rounded-lg p-3 text-white focus:ring-teal-500 focus:border-teal-500 ${errors[field] ? 'border-red-500' : 'border-gray-600'}`;

  const getOptionCardClass = (isSelected: boolean) => 
      `p-3 rounded-lg transition cursor-pointer text-center ${isSelected ? 'bg-teal-500 text-white font-bold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`;

  const getOptionCardGroupClass = (field: keyof FormData) => 
      `p-1 rounded-lg border ${errors[field] ? 'border-red-500' : 'border-transparent'}`;

  const renderSection = () => {
    switch (secaoAtual) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Dados Básicos</h2>
            <div>
              <label htmlFor="nome" className="text-base font-semibold text-gray-300 mb-2 block">Qual é o seu nome? <span className="text-red-400">*</span></label>
              <input id="nome" type="text" placeholder="Seu nome completo" value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)} className={getInputClass('nome')}/>
               {errors.nome && <p className="text-red-400 text-sm mt-1">{errors.nome}</p>}
            </div>
            <div>
              <label htmlFor="email" className="text-base font-semibold text-gray-300 mb-2 block">Qual é o seu email? <span className="text-red-400">*</span></label>
              <input id="email" type="email" placeholder="seu.email@example.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={getInputClass('email')}/>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
        );
      case 2:
        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Logística da Viagem</h2>
                <div>
                  <label htmlFor="duracao" className="text-base font-semibold text-gray-300 mb-3 block">Quantos dias você ficará no Rio? <span className="text-red-400">*</span></label>
                   <select id="duracao" value={formData.duracao_dias} onChange={(e) => handleInputChange('duracao_dias', e.target.value)} className={`${getInputClass('duracao_dias')} appearance-none`}>
                      <option value="" disabled>Selecione a duração</option>
                      {TRIP_DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                   </select>
                   {errors.duracao_dias && <p className="text-red-400 text-sm mt-1">{errors.duracao_dias}</p>}
                </div>
                <div>
                    <label htmlFor="data_inicio" className="text-base font-semibold text-gray-300 mb-2 block">Qual é a data de início da sua viagem? <span className="text-red-400">*</span></label>
                    <input id="data_inicio" type="date" value={formData.data_inicio} onChange={(e) => handleInputChange('data_inicio', e.target.value)} className={getInputClass('data_inicio')} />
                    {errors.data_inicio && <p className="text-red-400 text-sm mt-1">{errors.data_inicio}</p>}
                </div>
                <div>
                    <label htmlFor="bairro" className="text-base font-semibold text-gray-300 mb-3 block">Qual bairro você vai se hospedar? <span className="text-red-400">*</span></label>
                    <select id="bairro" value={formData.bairro_hospedagem} onChange={(e) => handleInputChange('bairro_hospedagem', e.target.value)} className={`${getInputClass('bairro_hospedagem')} appearance-none`}>
                        <option value="" disabled>Selecione o bairro</option>
                        {LODGING_NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    {errors.bairro_hospedagem && <p className="text-red-400 text-sm mt-1">{errors.bairro_hospedagem}</p>}
                </div>
                <div>
                    <label htmlFor="tipo_hospedagem" className="text-base font-semibold text-gray-300 mb-3 block">Que tipo de hospedagem você prefere? <span className="text-red-400">*</span></label>
                    <select id="tipo_hospedagem" value={formData.tipo_hospedagem} onChange={(e) => handleInputChange('tipo_hospedagem', e.target.value)} className={`${getInputClass('tipo_hospedagem')} appearance-none`}>
                        <option value="" disabled>Selecione o tipo</option>
                        {LODGING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.tipo_hospedagem && <p className="text-red-400 text-sm mt-1">{errors.tipo_hospedagem}</p>}
                </div>
            </div>
        );
      case 3:
          return (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">Voos e Transporte</h2>
                  <div>
                      <label className="text-base font-semibold text-gray-300 mb-3 block">Você já comprou sua passagem aérea? <span className="text-red-400">*</span></label>
                      <div className={`flex gap-4 ${getOptionCardGroupClass('passagem_comprada')}`}>
                          {['Sim', 'Não'].map(opt => <div key={opt} onClick={() => handleInputChange('passagem_comprada', opt)} className={`${getOptionCardClass(formData.passagem_comprada === opt)} flex-1`}>{opt}</div>)}
                      </div>
                      {errors.passagem_comprada && <p className="text-red-400 text-sm mt-1">{errors.passagem_comprada}</p>}
                  </div>
                  {formData.passagem_comprada === 'Sim' && (
                      <>
                          <div>
                              <label htmlFor="horario_chegada" className="text-base font-semibold text-gray-300 mb-2 block">Qual é o horário de chegada no aeroporto? <span className="text-red-400">*</span></label>
                              <input id="horario_chegada" type="time" value={formData.horario_chegada} onChange={(e) => handleInputChange('horario_chegada', e.target.value)} className={getInputClass('horario_chegada')} />
                              {errors.horario_chegada && <p className="text-red-400 text-sm mt-1">{errors.horario_chegada}</p>}
                          </div>
                          <div>
                              <label htmlFor="horario_voo_volta" className="text-base font-semibold text-gray-300 mb-2 block">Qual é o horário do voo de volta? <span className="text-red-400">*</span></label>
                              <input id="horario_voo_volta" type="time" value={formData.horario_voo_volta} onChange={(e) => handleInputChange('horario_voo_volta', e.target.value)} className={getInputClass('horario_voo_volta')} />
                              {errors.horario_voo_volta && <p className="text-red-400 text-sm mt-1">{errors.horario_voo_volta}</p>}
                          </div>
                      </>
                  )}
                  <div>
                      <label className="text-base font-semibold text-gray-300 mb-3 block">Qual será seu principal meio de transporte no Rio? <span className="text-red-400">*</span></label>
                      <div className={`space-y-2 ${getOptionCardGroupClass('tipo_transporte_principal')}`}>
                        {['Carro Alugado', 'Uber', 'Transporte Público', 'A Pé'].map(opt => (
                           <div key={opt} onClick={() => handleInputChange('tipo_transporte_principal', opt)} className={`${getOptionCardClass(formData.tipo_transporte_principal === opt)} text-left`}>{opt}</div>
                        ))}
                      </div>
                      {errors.tipo_transporte_principal && <p className="text-red-400 text-sm mt-1">{errors.tipo_transporte_principal}</p>}
                  </div>
              </div>
          );
       case 4:
          return (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">Composição do Grupo</h2>
                  <div>
                    <label className="text-base font-semibold text-gray-300 mb-3 block">Qual é a composição do seu grupo? <span className="text-red-400">*</span></label>
                    <div className={`grid grid-cols-2 gap-2 ${getOptionCardGroupClass('composicao_grupo')}`}>
                        {GROUP_COMPOSITION.map(opt => <div key={opt} onClick={() => handleCheckboxChange('composicao_grupo', opt)} className={getOptionCardClass(formData.composicao_grupo.includes(opt))}>{opt}</div>)}
                    </div>
                    {errors.composicao_grupo && <p className="text-red-400 text-sm mt-1">{errors.composicao_grupo}</p>}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="idade_min" className="text-base font-semibold text-gray-300 mb-2 block">Idade mínima <span className="text-red-400">*</span></label>
                        <input id="idade_min" type="number" placeholder="Ex: 18" value={formData.idade_minima} onChange={(e) => handleInputChange('idade_minima', e.target.value)} className={getInputClass('idade_minima')}/>
                        {errors.idade_minima && <p className="text-red-400 text-sm mt-1">{errors.idade_minima}</p>}
                    </div>
                    <div className="flex-1">
                        <label htmlFor="idade_max" className="text-base font-semibold text-gray-300 mb-2 block">Idade máxima <span className="text-red-400">*</span></label>
                        <input id="idade_max" type="number" placeholder="Ex: 65" value={formData.idade_maxima} onChange={(e) => handleInputChange('idade_maxima', e.target.value)} className={getInputClass('idade_maxima')}/>
                        {errors.idade_maxima && <p className="text-red-400 text-sm mt-1">{errors.idade_maxima}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-base font-semibold text-gray-300 mb-3 block">Alguém tem necessidade de acessibilidade? <span className="text-red-400">*</span></label>
                    <div className={`space-y-2 ${getOptionCardGroupClass('acessibilidade_pcd')}`}>
                        {ACCESSIBILITY_OPTIONS.map(opt => <div key={opt} onClick={() => handleInputChange('acessibilidade_pcd', opt)} className={`${getOptionCardClass(formData.acessibilidade_pcd === opt)} text-left`}>{opt}</div>)}
                    </div>
                    {errors.acessibilidade_pcd && <p className="text-red-400 text-sm mt-1">{errors.acessibilidade_pcd}</p>}
                  </div>
                   <div>
                    <label className="text-base font-semibold text-gray-300 mb-3 block">Tem bebê no grupo? <span className="text-red-400">*</span></label>
                     <div className={`flex gap-4 ${getOptionCardGroupClass('tem_bebe')}`}>
                        {['Sim', 'Não'].map(opt => <div key={opt} onClick={() => handleInputChange('tem_bebe', opt)} className={`${getOptionCardClass(formData.tem_bebe === opt)} flex-1`}>{opt}</div>)}
                    </div>
                     {errors.tem_bebe && <p className="text-red-400 text-sm mt-1">{errors.tem_bebe}</p>}
                  </div>
                   {formData.tem_bebe === 'Sim' && (
                      <>
                          <div>
                              <label htmlFor="horario_sono" className="text-base font-semibold text-gray-300 mb-2 block">Que horas o bebê dorme normalmente? <span className="text-red-400">*</span></label>
                              <input id="horario_sono" type="time" value={formData.horario_sono_bebe} onChange={(e) => handleInputChange('horario_sono_bebe', e.target.value)} className={getInputClass('horario_sono_bebe')} />
                              {errors.horario_sono_bebe && <p className="text-red-400 text-sm mt-1">{errors.horario_sono_bebe}</p>}
                          </div>
                          <div>
                              <label className="text-base font-semibold text-gray-300 mb-3 block">Respeitar o horário de sono do bebê? <span className="text-red-400">*</span></label>
                               <div className={`flex gap-4 ${getOptionCardGroupClass('criar_roteiro_conforme_bebe')}`}>
                                  {['Sim, adapte o roteiro', 'Não, vida normal'].map(opt => <div key={opt} onClick={() => handleInputChange('criar_roteiro_conforme_bebe', opt)} className={`${getOptionCardClass(formData.criar_roteiro_conforme_bebe === opt)} flex-1`}>{opt}</div>)}
                              </div>
                              {errors.criar_roteiro_conforme_bebe && <p className="text-red-400 text-sm mt-1">{errors.criar_roteiro_conforme_bebe}</p>}
                          </div>
                      </>
                  )}
              </div>
          );
       case 5:
          return (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">Interesses</h2>
                  <div>
                    <label className="text-base font-semibold text-gray-300 mb-3 block">Quais são seus principais interesses? <span className="text-red-400">*</span></label>
                    <div className={`grid grid-cols-2 gap-2 ${getOptionCardGroupClass('interesses_principais')}`}>
                        {INTERESTS.map(opt => <div key={opt} onClick={() => handleCheckboxChange('interesses_principais', opt)} className={getOptionCardClass(formData.interesses_principais.includes(opt))}>{opt}</div>)}
                    </div>
                     {errors.interesses_principais && <p className="text-red-400 text-sm mt-1">{errors.interesses_principais}</p>}
                  </div>
                  <div>
                      <label className="text-base font-semibold text-gray-300 mb-3 block">Qual é seu ritmo de viagem preferido? <span className="text-red-400">*</span></label>
                      <div className={`space-y-2 ${getOptionCardGroupClass('ritmo_viagem')}`}>
                          {TRAVEL_PACING.map(opt => <div key={opt.id} onClick={() => handleInputChange('ritmo_viagem', opt.id)} className={`${getOptionCardClass(formData.ritmo_viagem === opt.id)} text-left`}><strong className="text-teal-300">{opt.label}</strong>: {opt.description}</div>)}
                      </div>
                      {errors.ritmo_viagem && <p className="text-red-400 text-sm mt-1">{errors.ritmo_viagem}</p>}
                  </div>
              </div>
          );
      case 6:
          return (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">Orçamento e Transporte</h2>
                  <div>
                      <label className="text-base font-semibold text-gray-300 mb-3 block">Qual é seu orçamento diário para ALIMENTAÇÃO (por pessoa)? <span className="text-red-400">*</span></label>
                       <div className={`space-y-2 ${getOptionCardGroupClass('orcamento_diario')}`}>
                          {DAILY_BUDGETS.map(opt => <div key={opt.id} onClick={() => handleInputChange('orcamento_diario', opt.id)} className={`${getOptionCardClass(formData.orcamento_diario === opt.id)} text-left`}><strong className="text-teal-300">{opt.label}</strong> <span className="text-gray-400">({opt.description})</span></div>)}
                      </div>
                      {errors.orcamento_diario && <p className="text-red-400 text-sm mt-1">{errors.orcamento_diario}</p>}
                  </div>
                  <div>
                      <label className="text-base font-semibold text-gray-300 mb-3 block">Quais meios de transporte você prefere? <span className="text-red-400">*</span></label>
                      <div className={`grid grid-cols-2 gap-2 ${getOptionCardGroupClass('meio_transporte')}`}>
                          {TRANSPORT_OPTIONS.map(opt => <div key={opt} onClick={() => handleCheckboxChange('meio_transporte', opt)} className={getOptionCardClass(formData.meio_transporte.includes(opt))}>{opt}</div>)}
                      </div>
                      {errors.meio_transporte && <p className="text-red-400 text-sm mt-1">{errors.meio_transporte}</p>}
                  </div>
              </div>
          );
      case 7:
          return (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">Alimentação</h2>
                   <div>
                    <label className="text-base font-semibold text-gray-300 mb-3 block">Você gostaria de fazer refeições em casa para economizar? <span className="text-red-400">*</span></label>
                     <div className={`flex gap-4 ${getOptionCardGroupClass('fazer_refeicoes_em_casa')}`}>
                        {['Sim', 'Não'].map(opt => <div key={opt} onClick={() => handleInputChange('fazer_refeicoes_em_casa', opt)} className={`${getOptionCardClass(formData.fazer_refeicoes_em_casa === opt)} flex-1`}>{opt}</div>)}
                    </div>
                    {errors.fazer_refeicoes_em_casa && <p className="text-red-400 text-sm mt-1">{errors.fazer_refeicoes_em_casa}</p>}
                  </div>
                  {formData.fazer_refeicoes_em_casa === 'Sim' && (
                       <div>
                          <label className="text-base font-semibold text-gray-300 mb-3 block">Se sim, quais refeições? </label>
                          <div className={`grid grid-cols-2 gap-2 ${getOptionCardGroupClass('refeicoes_em_casa_frequencia')}`}>
                              {MEAL_OPTIONS.map(opt => <div key={opt} onClick={() => handleCheckboxChange('refeicoes_em_casa_frequencia', opt)} className={getOptionCardClass(formData.refeicoes_em_casa_frequencia.includes(opt))}>{opt}</div>)}
                          </div>
                           {errors.refeicoes_em_casa_frequencia && <p className="text-red-400 text-sm mt-1">{errors.refeicoes_em_casa_frequencia}</p>}
                      </div>
                  )}
              </div>
          );
      case 8:
          return (
               <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">Otimização</h2>
                   <div>
                    <label className="text-base font-semibold text-gray-300 mb-3 block">Você quer que o roteiro seja otimizado para economizar tempo? <span className="text-red-400">*</span></label>
                     <div className={`flex gap-4 ${getOptionCardGroupClass('otimizar_tempo')}`}>
                        {['Sim', 'Não'].map(opt => <div key={opt} onClick={() => handleInputChange('otimizar_tempo', opt)} className={`${getOptionCardClass(formData.otimizar_tempo === opt)} flex-1`}>{opt}</div>)}
                    </div>
                    {errors.otimizar_tempo && <p className="text-red-400 text-sm mt-1">{errors.otimizar_tempo}</p>}
                  </div>
              </div>
          );
      default:
        return null;
    }
  }

  return (
    <div className="text-white">
      <div className="mb-6 p-4 bg-gray-700/50 border border-teal-500/30 rounded-lg">
        <p className="text-sm text-center text-teal-200">
          <strong>ℹ️ Informação:</strong> Cristo Redentor e Pão de Açúcar sempre serão inclusos no seu roteiro!
        </p>
      </div>

      <div className="mb-6 p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-gray-200">
            Seção {secaoAtual} de {SECOES.length}: {secaoAtualObj?.titulo}
          </p>
          <p className="text-sm text-gray-400">{Math.round(progresso)}%</p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progresso}%` }}></div>
        </div>
      </div>
      
      <div className="p-8 mb-6 bg-gray-800/60 rounded-lg">{renderSection()}</div>

      <div className="flex justify-between gap-4">
        <button type="button" onClick={handleVoltar} disabled={secaoAtual === 1} className="flex-1 py-3 px-4 rounded-lg font-bold bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition">Voltar</button>
        {secaoAtual < SECOES.length ? (
          <button type="button" onClick={handleProximo} className="flex-1 py-3 px-4 rounded-lg font-bold bg-teal-600 hover:bg-teal-500 transition">Próximo</button>
        ) : (
          <button onClick={handleEnviar} className="flex-1 py-3 px-4 rounded-lg font-bold bg-green-600 hover:bg-green-500 transition flex items-center justify-center gap-2"><SparklesIcon /> Gerar Roteiro!</button>
        )}
      </div>
      <div className="text-center mt-8 text-sm text-gray-400">
        <p>* Campos obrigatórios</p>
         <button onClick={onBack} className="mt-4 text-gray-400 hover:text-white underline">Voltar para a página inicial</button>
      </div>
    </div>
  );
}



export default function App() {
  const [view, setView] = useState<View>('landing');
  const [itineraryResult, setItineraryResult] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  // FIX: Add state to store grounding sources from the API response.
  const [groundingSources, setGroundingSources] = useState<any[] | null>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(async (data: FormData) => {
    setView('loading');
    setItineraryResult(null);
    setError(null);
    setFormData(data);
    // FIX: Reset grounding sources on new submission.
    setGroundingSources(null);
    try {
      // FIX: Handle the full GenerateContentResponse object instead of just a string.
      const response = await generateItinerary(data);
      // FIX: Extract the text content for display.
      setItineraryResult(response.text);
      // FIX: Extract grounding metadata to display sources.
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setGroundingSources(chunks);
      }
      setView('payment');
    } catch (e) {
      console.error(e);
      setError("Desculpe, ocorreu um erro ao gerar seu roteiro. Por favor, tente novamente.");
      setView('form');
    }
  }, []);
  
  const handleDownloadPdf = async () => {
    const pdfContainer = pdfRef.current;
    if (!pdfContainer) {
        setError("Não foi possível encontrar o conteúdo para gerar o PDF.");
        return;
    }
    setIsGeneratingPdf(true);
    setError(null);

    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
        const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

        const sections = pdfContainer.querySelectorAll<HTMLElement>('.pdf-section');

        for (let i = 0; i < sections.length; i++) {
            const sectionEl = sections[i];
            
            if (i > 0) {
                pdf.addPage();
            }

            const canvas = await html2canvas(sectionEl, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                windowWidth: sectionEl.scrollWidth,
                windowHeight: sectionEl.scrollHeight,
            });

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / pdfWidth;
            const canvasPageHeight = pdfHeight * ratio;

            let y = 0;
            let isFirstPageOfSection = true;
            while (y < imgHeight) {
                if (!isFirstPageOfSection) {
                    pdf.addPage();
                }
                
                const remainingHeight = imgHeight - y;
                const heightToDraw = Math.min(canvasPageHeight, remainingHeight);
                
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = imgWidth;
                tempCanvas.height = heightToDraw;
                const tempCtx = tempCanvas.getContext('2d');

                if (tempCtx) {
                    tempCtx.drawImage(canvas, 0, y, imgWidth, heightToDraw, 0, 0, imgWidth, heightToDraw);
                    const pageImgData = tempCanvas.toDataURL('image/jpeg', 0.95);
                    const finalImageHeightOnPdf = heightToDraw / ratio;
                    pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, finalImageHeightOnPdf);
                }
                
                y += heightToDraw;
                isFirstPageOfSection = false;
            }
        }
        
        pdf.save('roteiro-rio-de-janeiro.pdf');
    } catch (err) {
        console.error("Error generating PDF:", err);
        setError("Não foi possível gerar o PDF. Por favor, tente novamente.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };


  if (view === 'landing') {
    return <LandingContent onStart={() => setView('form')} />;
  }

  const renderModalContent = () => {
    switch(view) {
      case 'form':
        return <DetailedItineraryForm onSubmit={handleSubmit} onBack={() => setView('landing')} />;
      case 'loading':
        return (
          <div className="text-center text-white p-8">
            <div className="flex justify-center items-center mb-4">
              <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0  0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Criando seu roteiro mágico...</h2>
            <p className="text-gray-300">Aguarde um momento, estamos personalizando a sua viagem dos sonhos pelo Rio!</p>
          </div>
        );
      case 'payment':
        return <PaymentContent onConfirm={() => setView('result')} />;
      case 'result':
        return (
          <div>
            {itineraryResult && <ItineraryDisplay ref={itineraryRef} content={itineraryResult} />}
            {/* FIX: Display grounding sources if they exist. */}
            {groundingSources && groundingSources.length > 0 && (
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <h4 className="text-lg font-bold text-teal-300 mb-2">Fontes da Web:</h4>
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                  {groundingSources.map((chunk, index) => (
                    chunk.web && chunk.web.uri && (
                      <li key={index}>
                        <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-400 break-all">
                          {chunk.web.title || chunk.web.uri}
                        </a>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isGeneratingPdf ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Gerando PDF...</span>
                  </>
                ) : (
                  <>
                    <DownloadIcon />
                    <span className="ml-2">Baixar Roteiro em PDF</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setView('form')}
                className="bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors duration-300 flex items-center justify-center"
              >
                <RefreshIcon />
                <span className="ml-2">Criar Novo Roteiro</span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-900 text-white bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://images.unsplash.com/photo-1619810231934-a77fa4425952?q=80&w=1600&auto=format&fit=crop')"}}>
      <div className="min-h-screen w-full bg-black/60 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-gray-800/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700 transition-all duration-500">
          {error && (view === 'form' || view === 'result') && <div className="bg-red-500/50 text-white p-3 rounded-md text-center mb-4">{error}</div>}
          {renderModalContent()}
        </div>
      </div>
       {/* Hidden component for PDF generation */}
       <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1, width: '210mm' }}>
        {itineraryResult && formData && (
            <PdfDocument
                ref={pdfRef}
                content={itineraryResult}
                userName={formData.nome}
            />
        )}
      </div>
    </main>
  );
}