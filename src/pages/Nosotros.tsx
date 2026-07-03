import { useEffect } from "react";
import { Cross, BookOpen, Heart, Globe, Users, Award, Lightbulb, Leaf, Shield } from "lucide-react";

const values = [
  { icon: Cross, title: "Dios en primer lugar", desc: "Fundamento y guía de nuestras acciones, decisiones y propósito institucional." },
  { icon: BookOpen, title: "Compromiso con la evidencia", desc: "Base científica en cada producto, curso y protocolo que desarrollamos." },
  { icon: Lightbulb, title: "Innovación", desc: "Integración de conocimiento tradicional validado con enfoques modernos." },
  { icon: Award, title: "Excelencia", desc: "Estándares de calidad en formulación, educación y servicio al cliente." },
  { icon: Leaf, title: "Respeto por la naturaleza", desc: "Sostenibilidad y responsabilidad ambiental en cada decisión." },
  { icon: Globe, title: "Responsabilidad social", desc: "Contribución al bienestar de las comunidades en Guatemala y Centroamérica." },
  { icon: Shield, title: "Calidad", desc: "Ingredientes seleccionados, procesos controlados y resultados verificables." },
  { icon: Heart, title: "Humanismo", desc: "Atención personalizada con empatía, ética y respeto por cada persona." },
  { icon: Users, title: "Trabajo colaborativo", desc: "Equipo multidisciplinario comprometido con el bienestar integral." },
];

export default function Nosotros() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-deep-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/50 text-sm uppercase tracking-[0.15em] mb-4">Nosotros</p>
          <h1 className="font-display text-4xl lg:text-6xl font-light mb-6">
            Fitociencia Care™
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            Naturaleza con evidencia. Una institución de salud integrativa, educación e investigación
            aplicada basada en Guatemala, Centroamérica.
          </p>
        </div>
      </section>

      {/* Dios en primer lugar */}
      <section className="py-20 lg:py-28 bg-parchment">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Cross className="w-10 h-10 text-earth-clay mx-auto mb-6" />
          <h2 className="font-display text-2xl lg:text-3xl font-medium text-charcoal mb-6">
            Dios en primer lugar
          </h2>
          <p className="text-charcoal/70 text-lg leading-relaxed">
            Reconocemos a Dios como fundamento y guía de nuestras acciones, decisiones y propósito institucional.
            Desde la fe, el respeto y el servicio, buscamos contribuir al bienestar integral de las personas
            con responsabilidad, ética y amor por la vida.
          </p>
        </div>
      </section>

      {/* Purpose & Mission */}
      <section className="py-20 lg:py-28 bg-mint-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-medium text-charcoal mb-4">Propósito</h2>
              <p className="text-charcoal/70 leading-relaxed">
                Contribuir al bienestar integral de las personas mediante la integración responsable de la
                fitoterapia, la nutrición naturopática, la educación para la salud y la investigación aplicada,
                promoviendo una cultura de prevención, autocuidado y estilos de vida saludables basados en
                la evidencia científica y el respeto por la naturaleza.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-medium text-charcoal mb-4">Misión</h2>
              <p className="text-charcoal/70 leading-relaxed">
                Brindar servicios integrales de bienestar, educación, investigación y desarrollo de productos
                naturales de alta calidad, fundamentados en principios científicos, conocimientos tradicionales
                validados y enfoques innovadores que favorezcan la prevención, el autocuidado y la mejora de
                la calidad de vida de las personas.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-medium text-charcoal mb-4">Visión</h2>
              <p className="text-charcoal/70 leading-relaxed">
                Ser una institución líder en salud integrativa, educación y desarrollo de soluciones naturales
                en Centroamérica, reconocida por su innovación, excelencia académica, compromiso científico y
                contribución al bienestar físico, mental y emocional de las comunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objective */}
      <section className="py-20 lg:py-28 bg-parchment">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl lg:text-3xl font-medium text-charcoal mb-6 text-center">
            Objetivo General
          </h2>
          <p className="text-charcoal/70 text-lg leading-relaxed text-center">
            Desarrollar un modelo integral de salud y bienestar que combine fitoterapia, nutrición naturopática,
            educación para la salud, investigación aplicada y desarrollo de productos naturales, con el fin de
            generar soluciones accesibles, seguras y efectivas que contribuyan a mejorar la calidad de vida de la población.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-mint-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl font-light text-charcoal mb-4 text-center">
            Valores Institucionales
          </h2>
          <p className="text-charcoal/60 text-center mb-16 max-w-2xl mx-auto">
            Los principios que guían cada decisión en Fitociencia Care™
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-parchment rounded-xl p-6">
                <v.icon className="w-8 h-8 text-earth-clay mb-4" />
                <h3 className="font-display text-lg font-medium text-charcoal mb-2">{v.title}</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Naturaleza con evidencia */}
      <section className="py-20 lg:py-28 bg-deep-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-light mb-6">
            "Naturaleza CON evidencia"
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Este es nuestro lema. Representa el equilibrio que buscamos en todo lo que hacemos:
            la sabiduría ancestral de las plantas medicinales, validada por la rigurosidad del método científico.
            No creemos en remedios milagrosos, sino en protocolos bien diseñados, basados en evidencia y
            respetuosos con la complejidad del cuerpo humano.
          </p>
        </div>
      </section>
    </div>
  );
}
