import { useEffect } from "react";
import { Link } from "react-router";
import {
  Sparkles, Sun, Droplets, CalendarDays,
  Coffee, Moon, Wind, CheckCircle
} from "lucide-react";

const routes = [
  {
    icon: Coffee,
    title: "Vía Oral: Fitoterapia",
    desc: "Infusiones botánicas que apoyan el equilibrio del sistema nervioso, la relajación, el bienestar digestivo y la calidad del descanso.",
    products: ["Té Neurovegetativo", "Infusión Somnium", "Infusión Digestum"],
  },
  {
    icon: Sparkles,
    title: "Vía Sensorial: Aromaterapia",
    desc: "Sachets Sensōris™ que estimulan la vía olfativa conectada al bulbo olfatorio y el sistema límbico, apoyando la regulación emocional y la relajación.",
    products: ["Sachets Sensōris™"],
  },
  {
    icon: Sun,
    title: "Vía Térmica: Termoterapia",
    desc: "Almohadillas térmicas aplicadas en cuello, hombros, abdomen o zona lumbar para favorecer la relajación, el confort local y la circulación.",
    products: ["Almohadillas Térmicas"],
  },
  {
    icon: Droplets,
    title: "Vía Tópica: Aceite de Ricino",
    desc: "Aceite de ricino prensado en frío para aplicación lumbar como práctica complementaria de autocuidado con calor suave.",
    products: ["Aceite de Ricino"],
    safety: "No usar durante el embarazo, sobre piel rota ni en caso de alergia al aceite de ricino.",
  },
  {
    icon: Wind,
    title: "Aceite NeuroMuscular",
    desc: "Aceite tópico externo para masaje muscular y confort local después de la actividad física.",
    products: ["Aceite NeuroMuscular"],
  },
];

const protocol = [
  { weeks: "Semanas 1-2", title: "Preparación", desc: "Introducción de la infusión neurovegetativa matutina y el primer sachet olfativo. El cuerpo comienza a reconocer los estímulos." },
  { weeks: "Semanas 3-4", title: "Activación", desc: "Incorporación de la almohadilla térmica en el protocolo nocturno. Se introduce la aplicación tópica de aceite de ricino 3 veces por semana." },
  { weeks: "Semanas 5-6", title: "Profundización", desc: "Rotación de sachets según el momento del día. Se ajusta la infusión según la respuesta individual. El aceite neuromuscular se integra post-actividad." },
  { weeks: "Semanas 7-8", title: "Integración", desc: "Todos los componentes trabajan en sinergia. El usuario ha establecido su ritual personalizado dentro del modelo." },
];

const dailyRoutine = [
  { time: "Mañana", icon: Coffee, items: ["Infusión Neurovegetativa", "Sachet olfativo matutino"] },
  { time: "Tarde", icon: Sun, items: ["Infusión opcional según necesidad", "Sachet olfativo diurno"] },
  { time: "Noche", icon: Moon, items: ["Almohadilla térmica", "Sachet nocturno", "Infusión Somnium"] },
  { time: "3x/semana", icon: CalendarDays, items: ["Protocolo de aceite de ricino lumbar"] },
];

export default function ModeloNeuroIntegrativo() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-20">
      <section className="py-24 lg:py-32 bg-deep-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/50 text-sm uppercase tracking-[0.15em] mb-4">Bienestar Integral</p>
          <h1 className="font-display text-4xl lg:text-6xl font-light mb-6">
            Modelo NeuroIntegrativo
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            Un sistema holístico que integra fitoterapia clínica, aromaterapia sensorial, termoterapia térmica y
            aplicación tópica en un protocolo estructurado de 8 semanas.
          </p>
        </div>
      </section>

      {/* Model Overview */}
      <section className="py-20 lg:py-28 bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl font-light text-charcoal mb-12 text-center">
            Las cinco vías del bienestar
          </h2>
          <div className="space-y-8">
            {routes.map((route, i) => (
              <div key={i} className="bg-mint-cream rounded-2xl p-8 lg:p-10">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-deep-forest rounded-xl flex items-center justify-center shrink-0">
                    <route.icon className="w-7 h-7 text-mint-cream" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl lg:text-2xl font-medium text-charcoal mb-2">{route.title}</h3>
                    <p className="text-charcoal/70 leading-relaxed mb-3">{route.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {route.products.map((p, j) => (
                        <span key={j} className="text-xs bg-deep-forest/10 text-deep-forest px-3 py-1 rounded-full">{p}</span>
                      ))}
                    </div>
                    {route.safety && (
                      <p className="text-earth-clay text-sm mt-2">⚠ {route.safety}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Timeline */}
      <section className="py-20 lg:py-28 bg-mint-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl font-light text-charcoal mb-4 text-center">
            Protocolo de 8 Semanas
          </h2>
          <p className="text-charcoal/60 text-center mb-16">Tu viaje hacia el equilibrio neurointegrativo</p>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-sage/30" />
            {protocol.map((phase, i) => (
              <div key={i} className="relative flex gap-8 mb-12 last:mb-0">
                <div className="w-12 h-12 bg-deep-forest rounded-full flex items-center justify-center shrink-0 relative z-10">
                  <span className="text-white text-sm font-medium">{i + 1}</span>
                </div>
                <div className="bg-parchment rounded-xl p-6 flex-1">
                  <p className="text-sage text-sm uppercase tracking-wider mb-1">{phase.weeks}</p>
                  <h3 className="font-display text-xl font-medium text-charcoal mb-2">{phase.title}</h3>
                  <p className="text-charcoal/70 text-sm leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Routine */}
      <section className="py-20 lg:py-28 bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl font-light text-charcoal mb-12 text-center">
            Rutina Diaria Sugerida
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyRoutine.map((r, i) => (
              <div key={i} className="bg-mint-cream rounded-xl p-6">
                <div className="w-12 h-12 bg-earth-clay rounded-full flex items-center justify-center mb-4">
                  <r.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-medium text-charcoal mb-3">{r.time}</h3>
                <ul className="space-y-2">
                  {r.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-charcoal/70">
                      <CheckCircle className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 bg-deep-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/50 text-sm leading-relaxed">
            <strong className="text-white/70">Nota importante:</strong> Este protocolo es educativo y orientado al bienestar.
            No sustituye el cuidado médico profesional. Consulte a un profesional de salud antes de iniciar cualquier protocolo de bienestar,
            especialmente si está embarazada, en lactancia, toma medicamentos o tiene una condición médica.
          </p>
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-earth-clay text-white rounded-full font-medium hover:bg-earth-clay/90 transition-all"
          >
            Ver productos del modelo
          </Link>
        </div>
      </section>
    </div>
  );
}
