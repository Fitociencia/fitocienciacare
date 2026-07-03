import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Calendar, User, ArrowLeft, FileText, Lock } from "lucide-react";

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

export default function ResearchPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = trpc.research.getBySlug.useQuery({ slug: slug || "" });

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
        <Link to="/investigacion" className="text-earth-clay">Volver a investigación</Link>
      </div>
    );
  }

  const references = post.references
    ? typeof post.references === "string"
      ? JSON.parse(post.references)
      : post.references
    : [];

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <Link to="/investigacion" className="inline-flex items-center gap-2 text-sage hover:text-charcoal transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver a investigación
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-deep-forest rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-mint-cream" />
          </div>
          <div>
            <span className="text-sage text-sm uppercase tracking-wider">
              {categoryLabels[post.category || ""] || "Investigación"}
            </span>
            {post.visibility === "members_only" && (
              <span className="text-xs bg-earth-clay/10 text-earth-clay px-2 py-0.5 rounded-full flex items-center gap-1 ml-2">
                <Lock className="w-3 h-3" /> Solo miembros
              </span>
            )}
          </div>
        </div>

        <h1 className="font-display text-3xl lg:text-4xl font-medium text-charcoal mb-6">
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

        {post.abstract && (
          <div className="bg-mint-cream rounded-xl p-6 mb-8">
            <h2 className="font-display text-lg font-medium text-charcoal mb-2">Resumen</h2>
            <p className="text-charcoal/70 italic">{post.abstract}</p>
          </div>
        )}

        <div className="prose prose-lg max-w-none text-charcoal/80 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {references.length > 0 && (
          <div className="mt-12 pt-8 border-t border-charcoal/10">
            <h2 className="font-display text-xl font-medium text-charcoal mb-4">Referencias</h2>
            <ol className="space-y-2">
              {references.map((ref: string, i: number) => (
                <li key={i} className="text-charcoal/60 text-sm">{ref}</li>
              ))}
            </ol>
          </div>
        )}

        {post.pdfUrl && (
          <div className="mt-8">
            <a
              href={post.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-deep-forest text-white rounded-full font-medium hover:bg-deep-forest/90 transition-all"
            >
              <FileText className="w-4 h-4" /> Descargar PDF
            </a>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-charcoal/10">
          <p className="text-charcoal/50 text-sm text-center">
            <strong>Aviso:</strong> El contenido de investigación y educación compartido por Fitociencia Care™
            tiene fines informativos y formativos. No sustituye diagnóstico, tratamiento ni seguimiento médico profesional.
          </p>
        </div>
      </article>
    </div>
  );
}
