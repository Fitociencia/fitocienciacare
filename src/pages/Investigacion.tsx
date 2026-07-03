import { useEffect } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { FileText, Lock, Calendar, User } from "lucide-react";

const categoryLabels: Record<string, string> = {
  fitoterapia_clinica: "Fitoterapia Clínica",
  fitoquimica: "Fitoquímica",
  farmacognosia: "Farmacognosia",
  nutricion_naturopatica: "Nutrición Naturopática",
  aromaterapia: "Aromaterapia",
  termoterapia: "Termoterapia",
  sistema_nervioso_autonomo: "Sistema Nervioso Autónomo",
  eje_intestino_cerebro: "Eje Intestino-Cerebro",
  educacion_salud: "Educación para la Salud",
};

export default function Investigacion() {
  const { data: posts, isLoading } = trpc.research.list.useQuery();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium">Ciencia</p>
          <h1 className="font-display text-4xl lg:text-5xl font-light text-charcoal mb-4">
            Investigación
          </h1>
          <p className="text-charcoal/60 max-w-2xl mb-12">
            Artículos de investigación, revisiones sistemáticas y estudios científicos sobre fitoterapia,
            nutrición naturopática y bienestar integrativo.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts?.map((post) => (
                <Link
                  key={post.id}
                  to={`/investigacion/${post.slug}`}
                  className="bg-white rounded-xl p-6 lg:p-8 group hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-deep-forest rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-mint-cream" />
                    </div>
                    <div>
                      <span className="text-xs text-sage uppercase tracking-wider">
                        {categoryLabels[post.category || ""] || "Investigación"}
                      </span>
                      {post.visibility === "members_only" && (
                        <span className="text-xs bg-earth-clay/10 text-earth-clay px-2 py-0.5 rounded-full flex items-center gap-1 ml-2">
                          <Lock className="w-3 h-3" /> Solo miembros
                        </span>
                      )}
                    </div>
                  </div>
                  <h2 className="font-display text-xl font-medium text-charcoal group-hover:text-earth-clay transition-colors mb-3">
                    {post.title}
                  </h2>
                  <p className="text-charcoal/60 text-sm line-clamp-3 mb-4">
                    {post.abstract || ""}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-charcoal/40">
                    {post.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {post.author}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
