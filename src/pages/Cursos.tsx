import { useEffect } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { BookOpen, Clock, User, ArrowRight, Lock } from "lucide-react";

const levelLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

export default function Cursos() {
  const { data: courses, isLoading } = trpc.course.list.useQuery();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium">Educación</p>
          <h1 className="font-display text-4xl lg:text-5xl font-light text-charcoal mb-4">
            Cursos
          </h1>
          <p className="text-charcoal/60 max-w-2xl mb-12">
            Contenido educativo desarrollado por profesionales en fitoterapia, nutrición naturopática
            y bienestar integrativo. Acceso con membresía mensual.
          </p>

          <div className="bg-deep-forest rounded-2xl p-8 lg:p-10 text-white mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl font-medium mb-2">Membresía Educativa</h2>
                <p className="text-white/60 max-w-xl">
                  Accede a todos los cursos, materiales descargables y contenido nuevo cada mes.
                </p>
              </div>
              <Link
                to="/membresia"
                className="inline-flex items-center gap-2 px-6 py-3 bg-earth-clay text-white rounded-full font-medium hover:bg-earth-clay/90 transition-all shrink-0"
              >
                Ver membresía <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses?.map((course) => (
                <Link
                  key={course.id}
                  to={`/cursos/${course.slug}`}
                  className="bg-white rounded-xl overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-deep-forest flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-mint-cream/40" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs bg-mint-cream text-deep-forest px-2 py-1 rounded-full">
                        {levelLabels[course.level || "beginner"]}
                      </span>
                      {course.requiresSubscription && (
                        <span className="text-xs bg-earth-clay/10 text-earth-clay px-2 py-1 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Membresía
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-medium text-charcoal group-hover:text-earth-clay transition-colors mb-2">
                      {course.title}
                    </h3>
                    <p className="text-charcoal/60 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-sm text-charcoal/50">
                      {course.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {course.duration}
                        </span>
                      )}
                      {course.instructor && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" /> {course.instructor}
                        </span>
                      )}
                    </div>
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
