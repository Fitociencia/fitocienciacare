import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { BookOpen, Clock, User, ArrowLeft, Lock, PlayCircle } from "lucide-react";

const levelLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = trpc.course.getBySlug.useQuery({ slug: slug || "" });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="animate-pulse text-sage">Cargando curso...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-20 min-h-screen bg-parchment flex flex-col items-center justify-center gap-4">
        <p className="text-charcoal">Curso no encontrado</p>
        <Link to="/cursos" className="text-earth-clay">Volver a cursos</Link>
      </div>
    );
  }

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <Link to="/cursos" className="inline-flex items-center gap-2 text-sage hover:text-charcoal transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver a cursos
        </Link>

        {/* Header */}
        <div className="bg-deep-forest rounded-2xl p-8 lg:p-12 text-white mb-12">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full">
              {levelLabels[course.level || "beginner"]}
            </span>
            <span className="text-xs bg-earth-clay text-white px-3 py-1 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> Requiere membresía
            </span>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-light mb-4">{course.title}</h1>
          <p className="text-white/70 text-lg max-w-2xl mb-6">{course.description}</p>
          <div className="flex flex-wrap gap-6 text-white/60 text-sm">
            {course.duration && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {course.duration}
              </span>
            )}
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {totalLessons} lecciones
            </span>
            {course.instructor && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" /> {course.instructor}
              </span>
            )}
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-medium text-charcoal mb-6">Contenido del curso</h2>
          {course.modules?.map((mod, i) => (
            <div key={mod.id} className="bg-white rounded-xl overflow-hidden">
              <div className="p-6 border-b border-charcoal/5">
                <p className="text-sage text-sm uppercase tracking-wider mb-1">Módulo {i + 1}</p>
                <h3 className="font-display text-lg font-medium text-charcoal">{mod.title}</h3>
                {mod.description && <p className="text-charcoal/60 text-sm mt-1">{mod.description}</p>}
              </div>
              <div className="divide-y divide-charcoal/5">
                {mod.lessons?.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-4 p-4 hover:bg-mint-cream/50 transition-colors">
                    <div className="w-10 h-10 bg-deep-forest/10 rounded-full flex items-center justify-center shrink-0">
                      {lesson.isPreview ? (
                        <PlayCircle className="w-5 h-5 text-deep-forest" />
                      ) : (
                        <Lock className="w-4 h-4 text-charcoal/40" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-charcoal font-medium">{lesson.title}</p>
                      {lesson.duration && <p className="text-charcoal/50 text-sm">{lesson.duration}</p>}
                    </div>
                    {lesson.isPreview && (
                      <span className="text-xs bg-mint-cream text-deep-forest px-2 py-1 rounded-full">Preview</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-mint-cream rounded-2xl p-8 text-center">
          <h3 className="font-display text-xl font-medium text-charcoal mb-3">
            Accede a este curso con tu membresía
          </h3>
          <p className="text-charcoal/60 mb-6">
            Únete a nuestra membresía educativa para acceder a todos los cursos y materiales.
          </p>
          <Link
            to="/membresia"
            className="inline-flex items-center gap-2 px-8 py-3 bg-deep-forest text-white rounded-full font-medium hover:bg-deep-forest/90 transition-all"
          >
            Iniciar membresía
          </Link>
        </div>
      </div>
    </div>
  );
}
