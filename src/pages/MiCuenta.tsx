import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  User, Package, BookOpen, CreditCard, LogOut,
  AlertTriangle, ClipboardCheck
} from "lucide-react";

function toTextList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return toTextList(parsed);
    } catch {
      return value.trim() ? [value] : [];
    }
  }

  return [];
}

export default function MiCuenta() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { data: orders } = trpc.order.myOrders.useQuery(undefined, { enabled: isAuthenticated });
  const { data: subscription } = trpc.membership.getMySubscription.useQuery(undefined, { enabled: isAuthenticated });
  const { data: checkups } = trpc.medicalCheckup.myReports.useQuery(undefined, { enabled: isAuthenticated });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
    return (
      <div className="pt-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="animate-pulse text-sage">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const subStatus = subscription?.status;
  const isActive = subStatus === "active" || subStatus === "trialing";

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <h1 className="font-display text-3xl lg:text-4xl font-light text-charcoal mb-12">
          Mi Cuenta
        </h1>

        {/* Profile */}
        <div className="bg-white rounded-xl p-6 lg:p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-deep-forest rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-mint-cream" />
            </div>
            <div>
              <h2 className="font-display text-xl font-medium text-charcoal">{user?.name || "Usuario"}</h2>
              <p className="text-charcoal/60 text-sm">{user?.email || ""}</p>
            </div>
          </div>
        </div>

        {/* Personalized checkups */}
        <div className="bg-white rounded-xl p-6 lg:p-8 mb-8">
          <h2 className="font-display text-lg font-medium text-charcoal mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-sage" /> Mis chequeos personalizados
          </h2>
          {checkups && checkups.length > 0 ? (
            <div className="space-y-5">
              {checkups.map((checkup) => {
                const recommendations = toTextList(checkup.recommendations);
                const productRecommendations = toTextList(checkup.productRecommendations);
                const courseRecommendations = toTextList(checkup.courseRecommendations);

                return (
                  <article key={checkup.id} className="border border-sage/20 rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-display text-xl font-medium text-charcoal">{checkup.title}</h3>
                        <p className="text-charcoal/50 text-sm">
                          {new Date(checkup.reportDate).toLocaleDateString("es-ES")}
                          {checkup.practitionerName ? ` - ${checkup.practitionerName}` : ""}
                        </p>
                      </div>
                      <span className="w-fit text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                        Publicado
                      </span>
                    </div>

                    <p className="text-charcoal/70 text-sm leading-relaxed mb-4">{checkup.summary}</p>

                    {checkup.observations && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-charcoal mb-1">Observaciones</p>
                        <p className="text-charcoal/60 text-sm leading-relaxed">{checkup.observations}</p>
                      </div>
                    )}

                    {recommendations.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-charcoal mb-2">Recomendaciones</p>
                        <ul className="space-y-2">
                          {recommendations.map((item) => (
                            <li key={item} className="text-charcoal/65 text-sm flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sage shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(productRecommendations.length > 0 || courseRecommendations.length > 0) && (
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        {productRecommendations.length > 0 && (
                          <div className="bg-mint-cream rounded-xl p-4">
                            <p className="text-sm font-medium text-charcoal mb-2">Productos sugeridos</p>
                            <p className="text-charcoal/60 text-sm">{productRecommendations.join(", ")}</p>
                          </div>
                        )}
                        {courseRecommendations.length > 0 && (
                          <div className="bg-mint-cream rounded-xl p-4">
                            <p className="text-sm font-medium text-charcoal mb-2">Recursos sugeridos</p>
                            <p className="text-charcoal/60 text-sm">{courseRecommendations.join(", ")}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {checkup.followUpNotes && (
                      <p className="text-charcoal/60 text-sm mb-3">
                        <span className="font-medium text-charcoal">Seguimiento:</span> {checkup.followUpNotes}
                      </p>
                    )}

                    <p className="text-charcoal/45 text-xs leading-relaxed">
                      {checkup.disclaimer ||
                        "Esta orientacion tiene fines educativos y de bienestar. No sustituye diagnostico, tratamiento ni seguimiento medico profesional."}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <div>
              <p className="text-charcoal/50 text-sm mb-4">Aun no tienes chequeos personalizados publicados.</p>
              <Link
                to="/evaluacion"
                className="inline-flex items-center gap-2 px-6 py-2 bg-deep-forest text-white rounded-full text-sm font-medium hover:bg-deep-forest/90 transition-all"
              >
                Completar evaluacion
              </Link>
            </div>
          )}
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-xl p-6 lg:p-8 mb-8">
          <h2 className="font-display text-lg font-medium text-charcoal mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sage" /> Membresía
          </h2>
          {isActive ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-green-600 font-medium">Membresía activa</span>
              </div>
              <p className="text-charcoal/60 text-sm">
                Válida hasta: {subscription?.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString("es-ES")
                  : "Próxima renovación"}
              </p>
              <Link
                to="/cursos"
                className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-deep-forest text-white rounded-full text-sm font-medium hover:bg-deep-forest/90 transition-all"
              >
                <BookOpen className="w-4 h-4" /> Ver mis cursos
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-charcoal/30 rounded-full" />
                <span className="text-charcoal/60">Sin membresía activa</span>
              </div>
              <Link
                to="/membresia"
                className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-earth-clay text-white rounded-full text-sm font-medium hover:bg-earth-clay/90 transition-all"
              >
                Activar membresía
              </Link>
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="bg-white rounded-xl p-6 lg:p-8 mb-8">
          <h2 className="font-display text-lg font-medium text-charcoal mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-sage" /> Mis Pedidos
          </h2>
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-charcoal/5 last:border-0">
                  <div>
                    <p className="text-charcoal font-medium">Orden #{order.id}</p>
                    <p className="text-charcoal/50 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-earth-clay font-medium">GTQ {order.total}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.orderStatus === "delivered" ? "bg-green-100 text-green-600" :
                      order.orderStatus === "shipped" ? "bg-blue-100 text-blue-600" :
                      "bg-yellow-100 text-yellow-600"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-charcoal/50 text-sm">No tienes pedidos aún.</p>
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-charcoal/50 text-sm mb-8">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Los productos y servicios de Fitociencia Care™ tienen fines educativos y de apoyo al bienestar.
            No sustituyen diagnóstico, tratamiento o seguimiento médico profesional.
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 border border-red-300 text-red-500 rounded-full font-medium hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
