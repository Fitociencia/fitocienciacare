import { useEffect } from "react";
import { Link } from "react-router";
import { Heart, MessageCircle, ClipboardList, Video, Users, Sparkles } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Consulta de bienestar integrativo",
    description: "Evaluación personalizada de tus necesidades de bienestar y diseño de un protocolo NeuroIntegrativo adaptado a tu situación.",
  },
  {
    icon: Sparkles,
    title: "Orientación fitoterápica y naturopática",
    description: "Recomendaciones basadas en evidencia sobre el uso de fitoterapia y nutrición naturopática para apoyar tu bienestar.",
  },
  {
    icon: ClipboardList,
    title: "Guía de protocolo personalizado",
    description: "Diseño de un plan de 8 semanas con los productos y prácticas del Modelo NeuroIntegrativo adaptados a tus necesidades.",
  },
  {
    icon: Video,
    title: "Sesiones educativas",
    description: "Capacitación en temas de fitoterapia, nutrición, aromaterapia y bienestar integrativo para individuos o grupos.",
  },
  {
    icon: Users,
    title: "Educación comunitaria",
    description: "Programas de bienestar para comunidades, empresas y organizaciones en Guatemala y Centroamérica.",
  },
  {
    icon: MessageCircle,
    title: "Desarrollo de productos",
    description: "Asesoría en el desarrollo de productos naturales basados en evidencia para emprendedores y empresas.",
  },
];

export default function Consultas() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium">Servicios</p>
          <h1 className="font-display text-4xl lg:text-5xl font-light text-charcoal mb-4">
            Consultas
          </h1>
          <p className="text-charcoal/60 max-w-2xl mb-16">
            Ofrecemos servicios de bienestar integrativo, educación para la salud y desarrollo de productos
            naturales, siempre con el enfoque de evidencia científica y tradición botánica.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-6 lg:p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-deep-forest rounded-xl flex items-center justify-center mb-5">
                  <s.icon className="w-6 h-6 text-mint-cream" />
                </div>
                <h3 className="font-display text-lg font-medium text-charcoal mb-2">{s.title}</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/50200000000?text=Hola, quiero agendar una consulta con Fitociencia Care™"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-earth-clay text-white rounded-full font-medium hover:bg-earth-clay/90 transition-all"
            >
              <MessageCircle className="w-5 h-5" /> Agendar por WhatsApp
            </a>
            <Link
              to="/evaluacion"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-deep-forest text-deep-forest rounded-full font-medium hover:bg-deep-forest hover:text-white transition-all"
            >
              <ClipboardList className="w-5 h-5" /> Realizar evaluación
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
