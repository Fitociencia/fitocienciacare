import { useEffect } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Calendar, User } from "lucide-react";

const categoryLabels: Record<string, string> = {
  fitoterapia: "Fitoterapia",
  nutricion_naturopatica: "Nutrición Naturopática",
  sistema_nervioso_autonomo: "Sistema Nervioso",
  eje_intestino_cerebro: "Eje Intestino-Cerebro",
  aromaterapia: "Aromaterapia",
  termoterapia: "Termoterapia",
  bienestar_emocional: "Bienestar Emocional",
  sueno_descanso: "Sueño y Descanso",
  salud_digestiva: "Salud Digestiva",
  autocuidado: "Autocuidado",
  investigacion_aplicada: "Investigación Aplicada",
};

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium">Contenido</p>
          <h1 className="font-display text-4xl lg:text-5xl font-light text-charcoal mb-12">
            Blog
          </h1>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts?.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-xl p-6 lg:p-8 group hover:shadow-lg transition-shadow"
                >
                  <span className="text-xs text-sage uppercase tracking-wider">
                    {categoryLabels[post.category || ""] || "General"}
                  </span>
                  <h2 className="font-display text-xl font-medium text-charcoal group-hover:text-earth-clay transition-colors mt-2 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-charcoal/60 text-sm line-clamp-3 mb-4">
                    {post.excerpt || (post.content ? post.content.slice(0, 150) + "..." : "")}
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
