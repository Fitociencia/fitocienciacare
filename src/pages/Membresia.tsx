import { useEffect } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Check, BookOpen, Download, Users, Sparkles, ArrowRight } from "lucide-react";

export default function Membresia() {
  const { data: plan } = trpc.membership.getPlan.useQuery();
  const { isAuthenticated } = useAuth();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const benefits = [
    { icon: BookOpen, text: "Acceso ilimitado a todos los cursos" },
    { icon: Download, text: "Materiales descargables" },
    { icon: Sparkles, text: "Nuevos cursos cada mes" },
    { icon: Users, text: "Foro de comunidad" },
    { icon: Check, text: "Descuentos en productos" },
  ];

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium text-center">Membresía</p>
          <h1 className="font-display text-4xl lg:text-5xl font-light text-charcoal mb-6 text-center">
            Membresía Educativa
          </h1>
          <p className="text-charcoal/60 text-lg text-center max-w-2xl mx-auto mb-16">
            Al convertirte en miembro de Fitociencia Care™, tendrás acceso mensual a cursos educativos,
            recursos de bienestar, materiales descargables y contenido formativo.
          </p>

          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-sage/10">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl font-medium text-charcoal mb-2">
                {plan?.name || "Membresía Educativa Fitociencia Care™"}
              </h2>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="font-display text-5xl lg:text-6xl font-light text-earth-clay">
                  GTQ {plan?.monthlyPrice || "299"}
                </span>
                <span className="text-charcoal/50">/mes</span>
              </div>
              <p className="text-charcoal/60">
                Cancela cuando quieras. Sin compromisos de permanencia.
              </p>
            </div>

            <div className="space-y-4 mb-10 max-w-md mx-auto">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-deep-forest rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-mint-cream" />
                  </div>
                  <span className="text-charcoal">{b.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <a
                  href="https://wa.me/50200000000?text=Hola, quiero activar mi membresía mensual de Fitociencia Care™"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-deep-forest text-white rounded-full font-medium hover:bg-deep-forest/90 transition-all"
                >
                  Activar membresía <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-deep-forest text-white rounded-full font-medium hover:bg-deep-forest/90 transition-all"
                >
                  Inicia sesión para suscribirte <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link
                to="/cursos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-sage text-sage rounded-full font-medium hover:bg-sage/10 transition-all"
              >
                Ver cursos incluidos
              </Link>
            </div>
          </div>

          <div className="mt-12 bg-mint-cream rounded-xl p-6 text-center">
            <p className="text-charcoal/60 text-sm">
              ¿Ya eres miembro?{" "}
              <a href="https://wa.me/50200000000?text=Hola, quiero renovar mi membresía" target="_blank" rel="noopener noreferrer" className="text-earth-clay hover:underline">
                Renueva tu membresía por WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
