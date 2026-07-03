import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  Leaf, FlaskConical, ChevronRight, ArrowRight, Sparkles, Heart, Brain, Moon, Sun, Wind,
  Droplets, Flame, MessageCircle, ShoppingBag, ThermometerSun
} from "lucide-react";

function Hero() {
  return (
    <section className="relative min-h-screen flex items-end pb-20 lg:pb-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-forest/70 via-deep-forest/40 to-deep-forest/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <p className="text-white/50 text-sm uppercase tracking-[0.15em] mb-6 font-medium">
            Modelo NeuroIntegrativo
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-light text-white leading-[0.95] mb-8">
            <span className="italic font-normal">Fitoterapia,</span><br />
            <span className="italic font-normal">Aromaterapia,</span><br />
            <span className="italic font-normal">Termoterapia.</span>
          </h1>
          <p className="text-white/60 text-lg lg:text-xl max-w-xl leading-relaxed mb-10">
            Un sistema integrado de bienestar basado en evidencia científica y tradición botánica.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/modelo-neurointegrativo"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/40 text-white rounded-full font-medium hover:bg-white hover:text-deep-forest transition-all duration-300"
            >
              Explorar el Modelo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/evaluacion"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-earth-clay text-white rounded-full font-medium hover:bg-earth-clay/90 transition-all duration-300"
            >
              Evaluar mi bienestar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Introduction() {
  return (
    <section className="py-24 lg:py-32 bg-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl lg:text-5xl font-light text-charcoal leading-tight mb-8">
              El cuerpo humano es un ecosistema.
            </h2>
            <p className="text-charcoal/80 text-lg lg:text-xl leading-relaxed max-w-xl">
              Durante siglos, las tradiciones botánicas han reconocido lo que la ciencia moderna ahora confirma:
              el bienestar integral emerge del equilibrio entre el sistema nervioso, la respuesta hormonal y
              los ritmos naturales del cuerpo. Nuestro modelo no es un tratamiento — es un lenguaje.
            </p>
          </div>
          <div className="lg:col-span-5 lg:pt-8">
            <p className="text-charcoal/70 leading-relaxed mb-6">
              El Modelo NeuroIntegrativo Fitociencia Care™ sintetiza fitoterapia clínica, aromaterapia sensorial,
              termoterapia térmica y aplicación tópica en un protocolo de 8 semanas diseñado para acompañar
              procesos de equilibrio natural.
            </p>
            <Link
              to="/nosotros"
              className="inline-flex items-center gap-2 text-earth-clay font-medium hover:gap-3 transition-all"
            >
              Conocer la historia <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  const pillars = [
    {
      icon: Leaf,
      title: "Fitoterapia",
      description: "Infusiones botánicas formuladas con evidencia científica para apoyar el equilibrio del sistema nervioso, la calidad del descanso y el bienestar digestivo.",
    },
    {
      icon: Sparkles,
      title: "Aromaterapia",
      description: "Sachets Sensōris™ diseñados para estimular la vía olfativa y acompañar la regulación emocional a través del sistema límbico.",
    },
    {
      icon: Sun,
      title: "Termoterapia",
      description: "Almohadillas térmicas de hierbas que aplican calor terapéutico para favorecer la relajación muscular y el confort local.",
    },
    {
      icon: FlaskConical,
      title: "Aplicación Tópica",
      description: "Aceites naturales para uso externo que complementan el protocolo de bienestar neurointegrativo.",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-mint-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium">Nuestro enfoque</p>
        <h2 className="font-display text-3xl lg:text-5xl font-light text-charcoal mb-16">
          Cuatro pilares del bienestar.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="bg-parchment rounded-2xl p-8 lg:p-10 group hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-deep-forest rounded-xl flex items-center justify-center mb-6 group-hover:bg-earth-clay transition-colors">
                <pillar.icon className="w-7 h-7 text-mint-cream" />
              </div>
              <h3 className="font-display text-2xl font-medium text-charcoal mb-3">{pillar.title}</h3>
              <p className="text-charcoal/70 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const shopCollections = [
    {
      icon: Leaf,
      tag: "Formulas orales",
      title: "Infusiones Fitoterapeuticas",
      description: "Tres formulas herbales artesanales para calma, descanso y bienestar digestivo.",
      includes: [
        "Te Neurovegetativo - sistema nervioso autonomo",
        "Somnium - rutina nocturna de descanso",
        "Digestum - digestion y eje intestino-cerebro",
        "Opcion individual o kit completo",
      ],
      price: "GTQ 175+",
      label: "por infusion",
      href: "/tienda?category=fitoterapia",
      accent: "#6a9e5a",
    },
    {
      icon: Sparkles,
      tag: "Via sensorial",
      title: "Sachets Sensoris",
      description: "Intervencion aromatica botanica para acompanar pausas, sueno y calma emocional.",
      includes: [
        "Lavanda, citricos, romero y menta",
        "Uso en almohada, escritorio o bolso",
        "Bienestar olfativo y ritual de pausa",
        "Reemplazo sugerido cada 2 a 3 semanas",
      ],
      price: "GTQ 125",
      label: "por sachet",
      href: "/tienda?category=sachets",
      accent: "#a090c0",
    },
    {
      icon: Droplets,
      tag: "Topico artesanal",
      title: "Aceite NeuroMuscular",
      description: "Aceite externo para masaje en zonas de tension y confort localizado.",
      includes: [
        "Arnica, hiperico, menta y romero",
        "Aplicacion externa en masaje suave",
        "Rutina post-actividad o final del dia",
        "Evitar ojos, mucosas y piel irritada",
      ],
      price: "GTQ 220",
      label: "presentacion topica",
      href: "/tienda/aceite-neuromuscular",
      accent: "#d4b06a",
    },
    {
      icon: Heart,
      tag: "Linea femenina",
      title: "Aceite de Ricino",
      description: "Base vegetal para compresas y protocolos corporales de autocuidado.",
      includes: [
        "Ricinus communis prensado en frio",
        "Aplicacion lumbar o local externa",
        "Puede combinarse con calor suave",
        "No aplicar en piel rota o irritada",
      ],
      price: "GTQ 145",
      label: "uso externo",
      href: "/tienda/aceite-ricino",
      accent: "#c8a8d8",
    },
    {
      icon: Flame,
      tag: "Linea dolor",
      title: "Pomadas y topicos",
      description: "Linea complementaria para rutinas de masaje y confort muscular segun intensidad.",
      includes: [
        "Opciones de uso cotidiano o intensivo",
        "Consulta segun zona y sensibilidad",
        "Complementa termoterapia y masaje",
        "Disponible bajo orientacion del equipo",
      ],
      price: "Consultar",
      label: "segun formula",
      href: "/contacto",
      accent: "#e8c0a0",
    },
    {
      icon: ThermometerSun,
      tag: "Termoterapia artesanal",
      title: "Almohadillas Termicas",
      description: "Semillas y hierbas seleccionadas para calor o frio local en rutinas de bienestar.",
      includes: [
        "Uso calor y frio segun necesidad",
        "Apoyo en tension muscular y descanso",
        "Aplicacion de 15 a 20 minutos",
        "Consultar tamano y zona de uso",
      ],
      price: "GTQ 285",
      label: "almohadilla herbal",
      href: "/tienda?category=termoterapia",
      accent: "#5b8fa8",
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-[#1a2e1a] text-[#f5f0e8] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(106,158,90,0.16),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(184,151,74,0.12),transparent_28%),radial-gradient(circle_at_80%_90%,rgba(123,107,158,0.10),transparent_30%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <div>
            <p className="font-mono-data text-[#b8974a] text-xs uppercase tracking-[0.24em] mb-4">Tienda</p>
            <h2 className="font-display text-4xl lg:text-6xl font-light leading-tight">
              Shop NeuroIntegrativo.
            </h2>
            <p className="mt-5 max-w-2xl text-[#a8c896] leading-relaxed">
              Productos botanicos organizados por via de apoyo: oral, sensorial, topica y termica.
              Formulas educativas para acompanar rutinas de bienestar con criterio de seguridad.
            </p>
          </div>
          <Link
            to="/tienda"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#b8974a]/50 px-6 py-3 text-[#d4b06a] font-medium hover:bg-[#b8974a] hover:text-[#1a2e1a] transition-all"
          >
            Ver tienda completa <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {shopCollections.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="group flex min-h-[360px] flex-col border border-[#b8974a]/20 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#b8974a]/70 hover:bg-black/30"
            >
              <div className="border-b border-[#2d4a2d]/70 p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="font-mono-data text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: item.accent }}>
                    {item.tag}
                  </p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5" style={{ color: item.accent }}>
                    <item.icon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="font-display text-2xl font-medium leading-tight text-[#f5f0e8]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#a8c896]/80">{item.description}</p>
              </div>
              <div className="flex-1 p-6">
                <ul className="space-y-3">
                  {item.includes.map((include) => (
                    <li key={include} className="flex gap-3 text-sm text-[#ede5d5]/85">
                      <span className="mt-2 h-px w-5 shrink-0 bg-[#b8974a]" />
                      <span>{include}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-end justify-between gap-4 border-t border-[#2d4a2d]/70 p-6">
                <div>
                  <p className="font-display text-3xl font-semibold leading-none text-[#d4b06a]">{item.price}</p>
                  <p className="mt-2 font-mono-data text-[0.65rem] uppercase tracking-[0.12em] text-[#a8c896]/60">{item.label}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#b8974a] px-4 py-2 text-sm font-medium text-[#1a2e1a] transition group-hover:bg-[#d4b06a]">
                  <ShoppingBag className="h-4 w-4" /> Ver
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border border-[#b8974a]/20 bg-[#0a140a]/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[#b8974a]">Compra asistida</p>
            <p className="mt-2 text-[#ede5d5]/80">
              Si no sabes que formula elegir, agenda una orientacion antes de comprar.
            </p>
          </div>
          <Link
            to="/consultas"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1ebe5a] transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Consultar por WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const benefits = [
    { icon: Brain, title: "Sistema Nervioso", description: "Apoya el equilibrio del sistema autónomo mediante fitoterapia clínica y estímulo sensorial dirigido." },
    { icon: Moon, title: "Calidad del Sueño", description: "El protocolo nocturno combina infusiones específicas con termoterapia lumbar y sachets de lavanda." },
    { icon: Heart, title: "Bienestar Digestivo", description: "La conexión intestino-cerebro se aborda mediante nutrición naturopática orientada al equilibrio." },
    { icon: Wind, title: "Relajación Muscular", description: "Aceites tópicos neuromusculares y almohadillas térmicas trabajan en sinergia para aliviar la tensión." },
  ];

  return (
    <section className="py-24 lg:py-32 bg-mint-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium">Áreas de Bienestar</p>
        <h2 className="font-display text-3xl lg:text-5xl font-light text-charcoal mb-16">
          Un sistema, múltiples beneficios.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="bg-parchment rounded-2xl p-8">
              <div className="w-12 h-12 bg-earth-clay rounded-full flex items-center justify-center mb-5">
                <b.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-medium text-charcoal mb-2">{b.title}</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MembershipPreview() {
  const { data: plan } = trpc.membership.getPlan.useQuery();

  return (
    <section className="py-24 lg:py-32 bg-deep-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-white/50 text-sm uppercase tracking-[0.15em] mb-4 font-medium">Educación</p>
            <h2 className="font-display text-3xl lg:text-5xl font-light mb-6">
              Aprende con nosotros.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Al convertirte en miembro de Fitociencia Care™, tendrás acceso mensual a cursos educativos,
              recursos de bienestar, materiales descargables y contenido formativo creado para promover
              prevención, autocuidado y estilos de vida saludables.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/membresia"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-earth-clay text-white rounded-full font-medium hover:bg-earth-clay/90 transition-all"
              >
                Iniciar membresía <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/cursos"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/40 text-white rounded-full font-medium hover:bg-white hover:text-deep-forest transition-all"
              >
                Ver cursos
              </Link>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 lg:p-10 border border-white/10">
            <h3 className="font-display text-2xl font-medium mb-4">Membresía Mensual</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display text-5xl font-light">GTQ {plan?.monthlyPrice || "299"}</span>
              <span className="text-white/50">/mes</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Acceso ilimitado a todos los cursos",
                "Materiales descargables",
                "Nuevos cursos cada mes",
                "Foro de comunidad",
                "Descuentos en productos",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70">
                  <ChevronRight className="w-4 h-4 text-earth-clay shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/40 text-sm">
              Cancela cuando quieras. Sin compromisos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogPreview() {
  const { data: posts } = trpc.blog.list.useQuery({ limit: 3 });

  return (
    <section className="py-24 lg:py-32 bg-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium">Contenido</p>
            <h2 className="font-display text-3xl lg:text-5xl font-light text-charcoal">
              Blog & Investigación.
            </h2>
          </div>
          <Link
            to="/blog"
            className="mt-4 lg:mt-0 inline-flex items-center gap-2 text-earth-clay font-medium hover:gap-3 transition-all"
          >
            Ver todo el contenido <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts?.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group"
            >
              <div className="bg-mint-cream rounded-xl p-8 h-full hover:shadow-md transition-shadow">
                <p className="text-sage text-xs uppercase tracking-wider mb-3">{post.category || "General"}</p>
                <h3 className="font-display text-xl font-medium text-charcoal group-hover:text-earth-clay transition-colors mb-3">
                  {post.title}
                </h3>
                <p className="text-charcoal/60 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt || post.content?.slice(0, 150) + "..."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AssessmentCTA() {
  return (
    <section className="py-24 lg:py-32 bg-earth-clay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl lg:text-5xl font-light text-white mb-6">
          ¿Listo para comenzar?
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
          Realiza nuestra evaluación de bienestar para recibir orientación personalizada
          sobre el protocolo NeuroIntegrativo más adecuado para ti.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/evaluacion"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-earth-clay rounded-full font-medium hover:bg-white/90 transition-all"
          >
            Realizar evaluación <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/consultas"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/40 text-white rounded-full font-medium hover:bg-white hover:text-earth-clay transition-all"
          >
            Agendar consulta
          </Link>
        </div>
      </div>
    </section>
  );
}

function Disclaimer() {
  return (
    <section className="py-12 bg-parchment border-t border-charcoal/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-charcoal/50 text-sm leading-relaxed">
          <strong className="text-charcoal/70">Aviso de salud:</strong> Los productos, protocolos y contenidos de Fitociencia Care™
          tienen fines educativos y de apoyo al bienestar. No sustituyen diagnóstico, tratamiento o seguimiento médico profesional.
          Consulte a un profesional de salud antes de utilizar productos herbales, especialmente si está embarazada,
          en lactancia, toma medicamentos, tiene una condición médica o presenta alergias conocidas.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <Pillars />
      <FeaturedProducts />
      <Benefits />
      <MembershipPreview />
      <BlogPreview />
      <AssessmentCTA />
      <Disclaimer />
    </>
  );
}
