import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  Users,
  ShoppingCart,
  BookOpen,
  FlaskConical,
  CreditCard,
  ClipboardList,
  DollarSign,
  BarChart3,
  ClipboardCheck,
  Package,
  Save,
  Send,
} from "lucide-react";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

const defaultDisclaimer =
  "Esta orientacion tiene fines educativos y de bienestar. No sustituye diagnostico, tratamiento ni seguimiento medico profesional.";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const isAdmin = user?.role === "admin";

  const [priceDrafts, setPriceDrafts] = useState<Record<number, string>>({});
  const [checkupForm, setCheckupForm] = useState({
    userId: "",
    title: "",
    summary: "",
    observations: "",
    recommendations: "",
    productRecommendations: "",
    courseRecommendations: "",
    followUpNotes: "",
    practitionerName: "",
    status: "published" as "draft" | "published" | "archived",
  });
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "fitoterapia",
    isPublished: true,
  });
  const [researchForm, setResearchForm] = useState({
    title: "",
    slug: "",
    abstract: "",
    content: "",
    pdfUrl: "",
    category: "fitoterapia_clinica",
    visibility: "public" as "public" | "members_only",
    isPublished: true,
  });

  const { data: stats } = trpc.dashboard.stats.useQuery(undefined, { enabled: isAdmin });
  const { data: recentOrders } = trpc.dashboard.recentOrders.useQuery(undefined, { enabled: isAdmin });
  const { data: products } = trpc.product.list.useQuery(undefined, { enabled: isAdmin });
  const { data: clients } = trpc.medicalCheckup.listUsers.useQuery(undefined, { enabled: isAdmin });
  const { data: checkups } = trpc.medicalCheckup.list.useQuery({ limit: 8 }, { enabled: isAdmin });

  const updateProductMutation = trpc.product.update.useMutation({
    onSuccess: async () => {
      await utils.product.list.invalidate();
    },
  });

  const createCheckupMutation = trpc.medicalCheckup.create.useMutation({
    onSuccess: async () => {
      setCheckupForm({
        userId: "",
        title: "",
        summary: "",
        observations: "",
        recommendations: "",
        productRecommendations: "",
        courseRecommendations: "",
        followUpNotes: "",
        practitionerName: "",
        status: "published",
      });
      await utils.medicalCheckup.list.invalidate();
    },
  });

  const createBlogMutation = trpc.blog.create.useMutation({
    onSuccess: async () => {
      setBlogForm({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "fitoterapia",
        isPublished: true,
      });
      await utils.blog.list.invalidate();
    },
  });

  const createResearchMutation = trpc.research.create.useMutation({
    onSuccess: async () => {
      setResearchForm({
        title: "",
        slug: "",
        abstract: "",
        content: "",
        pdfUrl: "",
        category: "fitoterapia_clinica",
        visibility: "public",
        isPublished: true,
      });
      await utils.research.list.invalidate();
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div className="pt-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="animate-pulse text-sage">Cargando...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const statCards = [
    { label: "Usuarios", value: stats?.users || 0, icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Pedidos", value: stats?.orders || 0, icon: ShoppingCart, color: "bg-green-100 text-green-600" },
    { label: "Ingresos (GTQ)", value: stats?.revenue || 0, icon: DollarSign, color: "bg-yellow-100 text-yellow-600" },
    { label: "Cursos", value: stats?.courses || 0, icon: BookOpen, color: "bg-purple-100 text-purple-600" },
    { label: "Suscripciones", value: stats?.subscriptions || 0, icon: CreditCard, color: "bg-pink-100 text-pink-600" },
    { label: "Evaluaciones", value: stats?.assessments || 0, icon: ClipboardList, color: "bg-orange-100 text-orange-600" },
    { label: "Blog Posts", value: stats?.blogPosts || 0, icon: BookOpen, color: "bg-teal-100 text-teal-600" },
    { label: "Investigaciones", value: stats?.researchPosts || 0, icon: FlaskConical, color: "bg-indigo-100 text-indigo-600" },
    { label: "Chequeos", value: stats?.medicalCheckups || 0, icon: ClipboardCheck, color: "bg-emerald-100 text-emerald-600" },
  ];

  const saveProductPrice = (id: number, currentPrice: string | number) => {
    const nextPrice = priceDrafts[id] ?? String(currentPrice);
    updateProductMutation.mutate({ id, data: { price: nextPrice } });
  };

  const submitCheckup = (event: React.FormEvent) => {
    event.preventDefault();
    if (!checkupForm.userId) return;

    createCheckupMutation.mutate({
      userId: Number(checkupForm.userId),
      title: checkupForm.title,
      summary: checkupForm.summary,
      observations: checkupForm.observations || undefined,
      recommendations: splitLines(checkupForm.recommendations),
      productRecommendations: splitLines(checkupForm.productRecommendations),
      courseRecommendations: splitLines(checkupForm.courseRecommendations),
      followUpNotes: checkupForm.followUpNotes || undefined,
      practitionerName: checkupForm.practitionerName || undefined,
      status: checkupForm.status,
      disclaimer: defaultDisclaimer,
    });
  };

  const submitBlog = (event: React.FormEvent) => {
    event.preventDefault();
    createBlogMutation.mutate({
      ...blogForm,
      slug: blogForm.slug || slugify(blogForm.title),
    });
  };

  const submitResearch = (event: React.FormEvent) => {
    event.preventDefault();
    createResearchMutation.mutate({
      ...researchForm,
      slug: researchForm.slug || slugify(researchForm.title),
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-sage text-sm uppercase tracking-[0.15em] mb-1 font-medium">Panel de Administracion</p>
            <h1 className="font-display text-3xl font-light text-charcoal">Dashboard</h1>
          </div>
          <div className="w-10 h-10 bg-deep-forest rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-mint-cream" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-12">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 lg:p-6">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-charcoal/50 text-sm mb-1">{stat.label}</p>
              <p className="font-display text-2xl lg:text-3xl font-light text-charcoal">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 mb-8">
          <section className="bg-white rounded-xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-medium text-charcoal flex items-center gap-2">
                <Package className="w-5 h-5 text-sage" /> Editar precios
              </h2>
              <Link to="/tienda" className="text-sm text-earth-clay hover:text-deep-forest">
                Ver tienda
              </Link>
            </div>
            <div className="space-y-3">
              {products?.slice(0, 8).map((product) => (
                <div key={product.id} className="grid grid-cols-[1fr_120px_auto] gap-3 items-center border-b border-charcoal/5 pb-3">
                  <div>
                    <p className="text-charcoal font-medium">{product.name}</p>
                    <p className="text-charcoal/45 text-xs">{product.category}</p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={priceDrafts[product.id] ?? String(product.price)}
                    onChange={(event) => setPriceDrafts((prev) => ({ ...prev, [product.id]: event.target.value }))}
                    className="w-full rounded-lg border border-sage/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
                  />
                  <button
                    type="button"
                    onClick={() => saveProductPrice(product.id, product.price)}
                    disabled={updateProductMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-full bg-deep-forest px-4 py-2 text-sm font-medium text-white hover:bg-deep-forest/90 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                </div>
              ))}
              {!products?.length && <p className="text-charcoal/50 text-sm">No hay productos cargados.</p>}
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-medium text-charcoal mb-6 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-sage" /> Pedidos recientes
            </h2>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.slice(0, 6).map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b border-charcoal/5 pb-3">
                    <div>
                      <p className="text-charcoal font-medium">#{order.id} {order.customerName}</p>
                      <p className="text-charcoal/45 text-xs">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-earth-clay font-medium">GTQ {order.total}</p>
                      <p className="text-charcoal/45 text-xs">{order.orderStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-charcoal/50 text-sm">No hay pedidos aun.</p>
            )}
          </section>
        </div>

        <div className="grid lg:grid-cols-[1fr_0.85fr] gap-8 mb-8">
          <section className="bg-white rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-medium text-charcoal mb-6 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-sage" /> Publicar chequeo personalizado
            </h2>
            <form onSubmit={submitCheckup} className="space-y-4">
              <select
                required
                value={checkupForm.userId}
                onChange={(event) => setCheckupForm((prev) => ({ ...prev, userId: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              >
                <option value="">Seleccionar cliente</option>
                {clients?.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name || client.email || `Usuario ${client.id}`}
                  </option>
                ))}
              </select>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Titulo del chequeo"
                  value={checkupForm.title}
                  onChange={(event) => setCheckupForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
                />
                <input
                  placeholder="Profesional / equipo"
                  value={checkupForm.practitionerName}
                  onChange={(event) => setCheckupForm((prev) => ({ ...prev, practitionerName: event.target.value }))}
                  className="rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder="Resumen para el cliente"
                value={checkupForm.summary}
                onChange={(event) => setCheckupForm((prev) => ({ ...prev, summary: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <textarea
                rows={3}
                placeholder="Observaciones"
                value={checkupForm.observations}
                onChange={(event) => setCheckupForm((prev) => ({ ...prev, observations: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <textarea
                rows={4}
                placeholder="Recomendaciones, una por linea"
                value={checkupForm.recommendations}
                onChange={(event) => setCheckupForm((prev) => ({ ...prev, recommendations: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <textarea
                  rows={3}
                  placeholder="Productos sugeridos, uno por linea"
                  value={checkupForm.productRecommendations}
                  onChange={(event) => setCheckupForm((prev) => ({ ...prev, productRecommendations: event.target.value }))}
                  className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
                />
                <textarea
                  rows={3}
                  placeholder="Cursos o recursos sugeridos, uno por linea"
                  value={checkupForm.courseRecommendations}
                  onChange={(event) => setCheckupForm((prev) => ({ ...prev, courseRecommendations: event.target.value }))}
                  className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
                />
              </div>
              <div className="grid sm:grid-cols-[1fr_auto] gap-4">
                <input
                  placeholder="Notas de seguimiento"
                  value={checkupForm.followUpNotes}
                  onChange={(event) => setCheckupForm((prev) => ({ ...prev, followUpNotes: event.target.value }))}
                  className="rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
                />
                <select
                  value={checkupForm.status}
                  onChange={(event) => setCheckupForm((prev) => ({ ...prev, status: event.target.value as "draft" | "published" | "archived" }))}
                  className="rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
                >
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={createCheckupMutation.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-deep-forest px-6 py-3 text-sm font-medium text-white hover:bg-deep-forest/90 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Guardar chequeo
              </button>
            </form>
          </section>

          <section className="bg-white rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-medium text-charcoal mb-6">Chequeos recientes</h2>
            {checkups && checkups.length > 0 ? (
              <div className="space-y-3">
                {checkups.map((checkup) => (
                  <div key={checkup.id} className="border-b border-charcoal/5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-charcoal font-medium">{checkup.title}</p>
                        <p className="text-charcoal/45 text-xs">Cliente #{checkup.userId}</p>
                      </div>
                      <span className="text-xs rounded-full bg-mint-cream px-2 py-1 text-charcoal/70">
                        {checkup.status}
                      </span>
                    </div>
                    <p className="text-charcoal/55 text-sm mt-2 line-clamp-2">{checkup.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-charcoal/50 text-sm">No hay chequeos creados aun.</p>
            )}
          </section>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-medium text-charcoal mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sage" /> Nuevo blog post
            </h2>
            <form onSubmit={submitBlog} className="space-y-4">
              <input
                required
                placeholder="Titulo"
                value={blogForm.title}
                onChange={(event) => setBlogForm((prev) => ({ ...prev, title: event.target.value, slug: prev.slug || slugify(event.target.value) }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <input
                placeholder="slug"
                value={blogForm.slug}
                onChange={(event) => setBlogForm((prev) => ({ ...prev, slug: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <textarea
                rows={2}
                placeholder="Extracto"
                value={blogForm.excerpt}
                onChange={(event) => setBlogForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <textarea
                required
                rows={6}
                placeholder="Contenido"
                value={blogForm.content}
                onChange={(event) => setBlogForm((prev) => ({ ...prev, content: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <button
                type="submit"
                disabled={createBlogMutation.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-deep-forest px-6 py-3 text-sm font-medium text-white hover:bg-deep-forest/90 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar blog
              </button>
            </form>
          </section>

          <section className="bg-white rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-medium text-charcoal mb-6 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-sage" /> Nuevo paper de investigacion
            </h2>
            <form onSubmit={submitResearch} className="space-y-4">
              <input
                required
                placeholder="Titulo"
                value={researchForm.title}
                onChange={(event) => setResearchForm((prev) => ({ ...prev, title: event.target.value, slug: prev.slug || slugify(event.target.value) }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <input
                placeholder="slug"
                value={researchForm.slug}
                onChange={(event) => setResearchForm((prev) => ({ ...prev, slug: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <input
                placeholder="URL del PDF"
                value={researchForm.pdfUrl}
                onChange={(event) => setResearchForm((prev) => ({ ...prev, pdfUrl: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <textarea
                rows={2}
                placeholder="Resumen / abstract"
                value={researchForm.abstract}
                onChange={(event) => setResearchForm((prev) => ({ ...prev, abstract: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <textarea
                required
                rows={6}
                placeholder="Contenido"
                value={researchForm.content}
                onChange={(event) => setResearchForm((prev) => ({ ...prev, content: event.target.value }))}
                className="w-full rounded-xl border border-sage/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
              <div className="flex items-center gap-3">
                <select
                  value={researchForm.visibility}
                  onChange={(event) => setResearchForm((prev) => ({ ...prev, visibility: event.target.value as "public" | "members_only" }))}
                  className="rounded-xl border border-sage/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
                >
                  <option value="public">Publico</option>
                  <option value="members_only">Solo miembros</option>
                </select>
                <button
                  type="submit"
                  disabled={createResearchMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-deep-forest px-6 py-3 text-sm font-medium text-white hover:bg-deep-forest/90 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> Guardar paper
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
