import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Check, ArrowRight, Leaf, Sparkles, Droplets, ThermometerSun, PackageCheck } from "lucide-react";

const categories = [
  { value: "", label: "Todos" },
  { value: "fitoterapia", label: "Fitoterapia" },
  { value: "termoterapia", label: "Termoterapia" },
  { value: "topicos", label: "Tópicos" },
  { value: "sachets", label: "Sachets" },
  { value: "bundle", label: "Kits" },
];

const productImages: Record<string, string> = {
  "te-neurovegetativo": "/products/te-neurovegetativo.jpg",
  "infusion-somnium": "/products/infusion-somnium.jpg",
  "infusion-digestum": "/products/infusion-digestum.jpg",
  "sachets-sensoris": "/products/sachets-sensoris.jpg",
  "almohadillas-termicas": "/products/almohadillas-termicas.jpg",
  "aceite-ricino": "/products/aceite-ricino.jpg",
  "aceite-neuromuscular": "/products/aceite-neuromuscular.jpg",
  "kit-neurointegrativo": "/products/kit-neurointegrativo.jpg",
};

const productAccent: Record<string, { color: string; tag: string; line: string; icon: typeof Leaf }> = {
  "te-neurovegetativo": {
    color: "#6a9e5a",
    tag: "Formula oral",
    line: "Sistema nervioso autonomo",
    icon: Leaf,
  },
  "infusion-somnium": {
    color: "#a090c0",
    tag: "Formula nocturna",
    line: "Descanso y pausa",
    icon: Sparkles,
  },
  "infusion-digestum": {
    color: "#5b8fa8",
    tag: "Formula digestiva",
    line: "Eje intestino-cerebro",
    icon: Leaf,
  },
  "sachets-sensoris": {
    color: "#a090c0",
    tag: "Via sensorial",
    line: "Aromaterapia botanica",
    icon: Sparkles,
  },
  "almohadillas-termicas": {
    color: "#5b8fa8",
    tag: "Termoterapia artesanal",
    line: "Calor y frio local",
    icon: ThermometerSun,
  },
  "aceite-ricino": {
    color: "#d4b06a",
    tag: "Topico vegetal",
    line: "Compresa y autocuidado",
    icon: Droplets,
  },
  "aceite-neuromuscular": {
    color: "#d4b06a",
    tag: "Topico artesanal",
    line: "Masaje y confort local",
    icon: Droplets,
  },
  "kit-neurointegrativo": {
    color: "#b8974a",
    tag: "Protocolo completo",
    line: "Rutina de 8 semanas",
    icon: PackageCheck,
  },
};

const fallbackShopProducts = [
  {
    id: 1,
    name: "Te Neurovegetativo",
    slug: "te-neurovegetativo",
    category: "fitoterapia",
    shortDescription: "Infusion botanica para acompanar el equilibrio del sistema nervioso autonomo.",
    price: "185.00",
    stock: 50,
    ingredients: ["Melissa officinalis", "Matricaria chamomilla", "Tilia europaea", "Citrus sinensis peel"],
    purpose: "Sistema nervioso autonomo",
  },
  {
    id: 2,
    name: "Infusion Somnium",
    slug: "infusion-somnium",
    category: "fitoterapia",
    shortDescription: "Mezcla nocturna de hierbas para favorecer una rutina de descanso tranquila.",
    price: "195.00",
    stock: 40,
    ingredients: ["Melissa officinalis", "Passiflora incarnata", "Matricaria chamomilla", "Lavandula angustifolia"],
    purpose: "Descanso nocturno",
  },
  {
    id: 7,
    name: "Infusion Digestum",
    slug: "infusion-digestum",
    category: "fitoterapia",
    shortDescription: "Apoyo digestivo natural con plantas tradicionales para el eje intestino-cerebro.",
    price: "175.00",
    stock: 45,
    ingredients: ["Peumus boldus", "Foeniculum vulgare", "Mentha piperita"],
    purpose: "Bienestar digestivo",
  },
  {
    id: 3,
    name: "Sachets Sensoris",
    slug: "sachets-sensoris",
    category: "sachets",
    shortDescription: "Sachets aromaticos botanicos para calma emocional y bienestar sensorial.",
    price: "125.00",
    stock: 60,
    ingredients: ["Lavandula angustifolia", "Citrus aurantium amara", "Rosmarinus officinalis", "Mentha spicata"],
    purpose: "Via olfativa",
  },
  {
    id: 4,
    name: "Almohadillas Termicas",
    slug: "almohadillas-termicas",
    category: "termoterapia",
    shortDescription: "Almohadillas de hierbas para calor terapeutico, relajacion muscular y confort local.",
    price: "285.00",
    stock: 25,
    ingredients: ["Semillas termicas", "Hierbas aromaticas"],
    purpose: "Calor y frio local",
  },
  {
    id: 5,
    name: "Aceite NeuroMuscular",
    slug: "aceite-neuromuscular",
    category: "topicos",
    shortDescription: "Aceite topico para masaje, relajacion muscular y confort localizado.",
    price: "220.00",
    stock: 35,
    ingredients: ["Arnica montana", "Hypericum perforatum", "Mentha piperita", "Rosmarinus officinalis"],
    purpose: "Masaje externo",
  },
  {
    id: 8,
    name: "Kit NeuroIntegrativo Fitociencia Care",
    slug: "kit-neurointegrativo",
    category: "bundle",
    shortDescription: "El protocolo completo con infusiones, sachets, termoterapia y aplicacion topica.",
    price: "1450.00",
    stock: 15,
    ingredients: ["Infusiones", "Sachets", "Termoterapia", "Topicos"],
    purpose: "Rutina de 8 semanas",
  },
];

function toTextList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.length > 0);
  }

  if (typeof value === "string") {
    try {
      return toTextList(JSON.parse(value));
    } catch {
      return value ? [value] : [];
    }
  }

  return [];
}

export default function Tienda() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [addedId, setAddedId] = useState<number | null>(null);
  const { data: products, isLoading } = trpc.product.list.useQuery(
    activeCategory ? { category: activeCategory as any } : undefined
  );
  const { addItem } = useCart();
  const displayProducts =
    products && products.length > 0
      ? products
      : fallbackShopProducts.filter((product) => {
          if (!activeCategory) return true;
          return product.category === activeCategory;
        });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleAddToCart = async (productId: number) => {
    await addItem(productId, 1);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="pt-20 min-h-screen bg-[#1a2e1a] text-[#f5f0e8]">
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(106,158,90,0.18),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(184,151,74,0.13),transparent_25%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end mb-10">
            <div>
              <p className="font-mono-data text-[#b8974a] text-xs uppercase tracking-[0.24em] mb-4">Tienda</p>
              <h1 className="font-display text-5xl lg:text-7xl font-light leading-none">
                Botica NeuroIntegrativa.
              </h1>
              <p className="mt-6 max-w-2xl text-[#a8c896] leading-relaxed">
                Formulas botanicas, topicos y termoterapia artesanal para acompanar protocolos de bienestar.
                Cada producto conserva lenguaje educativo y criterios de seguridad.
              </p>
            </div>
            <div className="border border-[#b8974a]/25 bg-black/20 p-5">
              <p className="font-mono-data text-[0.65rem] uppercase tracking-[0.18em] text-[#b8974a]">Seleccion asistida</p>
              <p className="mt-3 text-sm leading-relaxed text-[#ede5d5]/75">
                Si tienes embarazo, lactancia, medicamentos, alergias o una condicion medica, consulta antes de comprar.
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-12 border-y border-[#b8974a]/20 py-5">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? "bg-[#b8974a] text-[#1a2e1a]"
                    : "bg-transparent text-[#a8c896] border border-[#2d4a2d] hover:border-[#b8974a] hover:text-[#d4b06a]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {false && isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-[#b8974a]/20 bg-black/20 overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-white/10" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                    <div className="h-6 bg-white/10 rounded" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProducts.map((product) => {
                const meta = productAccent[product.slug] ?? {
                  color: "#b8974a",
                  tag: product.category,
                  line: "Fitociencia Care",
                  icon: Leaf,
                };
                const Icon = meta.icon;
                const ingredients = toTextList(product.ingredients).slice(0, 4);

                return (
                <div
                  key={product.id}
                  className="group flex min-h-full flex-col overflow-hidden border border-[#b8974a]/20 bg-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-[#b8974a]/70 hover:bg-black/30"
                >
                  <Link to={`/tienda/${product.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#0a140a]">
                      <img
                        src={productImages[product.slug] || "/products/kit-neurointegrativo.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a140a] via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                        <div>
                          <p className="font-mono-data text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: meta.color }}>
                            {meta.tag}
                          </p>
                          <p className="mt-1 text-xs text-[#ede5d5]/75">{meta.line}</p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm" style={{ color: meta.color }}>
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <Link to={`/tienda/${product.slug}`}>
                      <h3 className="font-display text-2xl font-medium text-[#f5f0e8] group-hover:text-[#d4b06a] transition-colors mb-3">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[#a8c896]/75 text-sm leading-relaxed mb-5 line-clamp-3">{product.shortDescription}</p>

                    <ul className="mb-6 flex-1 space-y-2">
                      {(ingredients.length > 0 ? ingredients : [product.purpose || "Producto botanico de bienestar"]).map((item) => (
                        <li key={item} className="flex gap-2 text-xs text-[#ede5d5]/75">
                          <span className="mt-2 h-px w-4 shrink-0 bg-[#b8974a]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between gap-3 border-t border-[#2d4a2d]/80 pt-5">
                      <div>
                        <span className="font-display text-3xl font-semibold leading-none text-[#d4b06a]">GTQ {product.price}</span>
                        <p className="mt-1 font-mono-data text-[0.6rem] uppercase tracking-[0.12em] text-[#a8c896]/55">stock {product.stock ?? 0}</p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          addedId === product.id
                            ? "bg-green-600 text-white"
                            : "bg-[#b8974a] text-[#1a2e1a] hover:bg-[#d4b06a]"
                        }`}
                      >
                        {addedId === product.id ? (
                          <><Check className="w-4 h-4" /> Agregado</>
                        ) : (
                          <><ShoppingCart className="w-4 h-4" /> Agregar</>
                        )}
                      </button>
                    </div>
                    <Link
                      to={`/tienda/${product.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm text-[#a8c896] hover:text-[#d4b06a] transition-colors"
                    >
                      Ver ficha tecnica <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
