import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Calendar, User, ArrowLeft } from "lucide-react";

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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: slug || "" });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="animate-pulse text-sage">Cargando artículo...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen bg-parchment flex flex-col items-center justify-center gap-4">
        <p className="text-charcoal">Artículo no encontrado</p>
        <Link to="/blog" className="text-earth-clay">Volver al blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sage hover:text-charcoal transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al blog
        </Link>

        <span className="text-sage text-sm uppercase tracking-wider">
          {categoryLabels[post.category || ""] || "General"}
        </span>
        <h1 className="font-display text-3xl lg:text-4xl font-medium text-charcoal mt-2 mb-6">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-charcoal/50 mb-10 pb-6 border-b border-charcoal/10">
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" /> {post.author}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          )}
        </div>

        {post.excerpt && (
          <p className="text-charcoal/70 text-lg italic mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-lg max-w-none text-charcoal/80 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        <div className="mt-16 pt-8 border-t border-charcoal/10">
          <p className="text-charcoal/50 text-sm text-center">
            <strong>Aviso:</strong> El contenido de este blog tiene fines educativos y formativos.
            No sustituye diagnóstico, tratamiento ni seguimiento médico profesional.
          </p>
        </div>
      </article>
    </div>
  );
}
