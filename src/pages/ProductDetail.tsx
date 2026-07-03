import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingCart,
  Check,
  ArrowLeft,
  AlertTriangle,
  Info,
  Leaf,
  Moon,
  Droplets,
  ThermometerSun,
  Sparkles,
  FlaskConical,
  Minus,
  Plus,
} from "lucide-react";

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

type ProductMeta = {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: string;
  stock: number;
  accent: string;
  accentSoft: string;
  label: string;
  icon: typeof Leaf;
  shortDescription: string;
  fullDescription: string;
  purpose: string;
  scientificName?: string;
  ingredients: Array<{ name: string; function: string }>;
  dosing: Array<{ label: string; value: string }>;
  application: Array<{ title: string; description: string }>;
  protocolNotes: string[];
  safetyNote: string;
  contraindications: string;
  related: string[];
};

const technicalCatalog: Record<string, ProductMeta> = {
  "te-neurovegetativo": {
    id: 1,
    name: "Te Neurovegetativo",
    slug: "te-neurovegetativo",
    category: "fitoterapia",
    price: "185.00",
    stock: 50,
    accent: "#6a9e5a",
    accentSoft: "rgba(106, 158, 90, 0.16)",
    label: "Formula oral · SNA",
    icon: Leaf,
    scientificName: "Melissa · Matricaria · Tilia · Citrus",
    shortDescription: "Infusion botanica para acompanamiento del sistema nervioso autonomo.",
    fullDescription:
      "Formula de uso diario para acompanar rutinas de calma, pausa consciente y regulacion neurovegetativa. Integra melisa, manzanilla, tilo y cascara de naranja como base botanica suave.",
    purpose: "Apoya el equilibrio del sistema nervioso autonomo, la relajacion y la pausa diaria.",
    ingredients: [
      { name: "Melissa officinalis", function: "calma · acido rosmarinico" },
      { name: "Matricaria chamomilla", function: "relajacion digestiva" },
      { name: "Tilia europaea", function: "pausa nerviosa" },
      { name: "Citrus sinensis peel", function: "nota citrica · aroma" },
    ],
    dosing: [
      { label: "Dosis", value: "1 taza al dia" },
      { label: "Infusion", value: "5-7 min" },
      { label: "Temperatura", value: "90-95 C" },
      { label: "Momento", value: "manana o tarde" },
    ],
    application: [
      { title: "Preparacion", description: "Verter agua caliente sobre la mezcla botanica y dejar reposar tapado." },
      { title: "Rutina", description: "Tomar en un momento de pausa, respiracion lenta o cierre de jornada." },
      { title: "Sinergia", description: "Puede combinarse con sachet de calma o termoterapia suave segun orientacion." },
    ],
    protocolNotes: [
      "Introduccion sugerida en semana 1 del protocolo.",
      "Puede usarse como segunda taza de apoyo segun tolerancia.",
      "Registrar respuesta subjetiva de calma y energia.",
    ],
    safetyNote: "Consultar a un profesional de salud si toma medicamentos, esta embarazada o en lactancia.",
    contraindications: "Hipersensibilidad a alguno de los componentes.",
    related: ["Sachets Sensoris", "Almohadillas Termicas", "Kit NeuroIntegrativo"],
  },
  "infusion-somnium": {
    id: 2,
    name: "Infusion Somnium",
    slug: "infusion-somnium",
    category: "fitoterapia",
    price: "195.00",
    stock: 40,
    accent: "#a090c0",
    accentSoft: "rgba(123, 107, 158, 0.18)",
    label: "Formula nocturna",
    icon: Moon,
    scientificName: "Melissa · Passiflora · Matricaria · Lavandula",
    shortDescription: "Mezcla nocturna para acompanar una rutina de descanso tranquila.",
    fullDescription:
      "Infusion de cierre del dia formulada para preparar el cuerpo para el descanso mediante plantas tradicionalmente usadas en rutinas de relajacion nocturna.",
    purpose: "Favorece la relajacion nocturna y la calidad subjetiva del descanso.",
    ingredients: [
      { name: "Melissa officinalis", function: "calma nocturna" },
      { name: "Passiflora incarnata", function: "flavonoides · descanso" },
      { name: "Matricaria chamomilla", function: "suavidad digestiva" },
      { name: "Lavandula angustifolia", function: "aroma · linalool" },
    ],
    dosing: [
      { label: "Dosis", value: "1 taza" },
      { label: "Momento", value: "30-45 min antes de dormir" },
      { label: "Temperatura", value: "85-90 C" },
      { label: "Infusion", value: "5-7 min" },
    ],
    application: [
      { title: "Preparacion", description: "Preparar una taza suave y tomar en ambiente tranquilo." },
      { title: "Higiene del sueno", description: "Acompanarla con luz baja, respiracion lenta y pantalla reducida." },
      { title: "Sinergia", description: "Puede combinarse con sachet de calma profunda en almohada." },
    ],
    protocolNotes: [
      "Se integra usualmente desde la semana 2.",
      "Evaluar somnolencia y ajustar horario.",
      "Suspender antes de procedimientos con anestesia si un profesional lo indica.",
    ],
    safetyNote: "Puede causar somnolencia. No conducir ni operar maquinaria tras consumir.",
    contraindications: "Embarazo, lactancia, uso de sedantes o alergia a componentes.",
    related: ["Te Neurovegetativo", "Sachets Sensoris", "Almohadillas Termicas"],
  },
  "infusion-digestum": {
    id: 7,
    name: "Infusion Digestum",
    slug: "infusion-digestum",
    category: "fitoterapia",
    price: "175.00",
    stock: 45,
    accent: "#5b8fa8",
    accentSoft: "rgba(91, 143, 168, 0.18)",
    label: "Formula digestiva",
    icon: FlaskConical,
    scientificName: "Peumus · Foeniculum · Mentha",
    shortDescription: "Apoyo digestivo natural para el eje intestino-cerebro.",
    fullDescription:
      "Formula botanica para despues de comidas, con boldo, hinojo y menta como apoyo tradicional de bienestar digestivo y sensacion de ligereza.",
    purpose: "Apoya el bienestar digestivo y el equilibrio del eje intestino-cerebro.",
    ingredients: [
      { name: "Peumus boldus", function: "boldina · apoyo digestivo" },
      { name: "Foeniculum vulgare", function: "trans-anetol · gas" },
      { name: "Mentha piperita", function: "mentol · frescor" },
    ],
    dosing: [
      { label: "Dosis", value: "1 taza" },
      { label: "Momento", value: "post-comida principal" },
      { label: "Temperatura", value: "88-92 C" },
      { label: "Infusion", value: "5 min" },
    ],
    application: [
      { title: "Uso diario", description: "Tomar despues de comida principal cuando se busca apoyo digestivo." },
      { title: "Registro", description: "Observar distension, incomodidad digestiva y energia despues de comer." },
      { title: "Sinergia", description: "Puede complementar termoterapia abdominal suave segun orientacion." },
    ],
    protocolNotes: [
      "Se introduce en semanas de integracion digestiva.",
      "Puede acompanarse de diario alimentario.",
      "Revisar tolerancia si hay antecedentes biliares o hepaticos.",
    ],
    safetyNote: "Consultar a un profesional si tiene condiciones hepaticas, biliares o toma medicamentos.",
    contraindications: "Embarazo, obstruccion biliar o hipersensibilidad a componentes.",
    related: ["Kit NeuroIntegrativo", "Aceite de Ricino", "Almohadillas Termicas"],
  },
  "sachets-sensoris": {
    id: 3,
    name: "Sachets Sensoris",
    slug: "sachets-sensoris",
    category: "sachets",
    price: "125.00",
    stock: 60,
    accent: "#a090c0",
    accentSoft: "rgba(160, 144, 192, 0.18)",
    label: "Via sensorial",
    icon: Sparkles,
    scientificName: "Lavandula · Citrus · Rosmarinus · Mentha",
    shortDescription: "Sachets aromaticos botanicos para bienestar olfativo y pausa emocional.",
    fullDescription:
      "Sachets de hierbas secas para modular el ambiente mediante via olfativa. Se usan cerca de la almohada, escritorio o bolso como recordatorio sensorial de pausa.",
    purpose: "Bienestar olfativo, autocuidado sensorial y acompanamiento de calma emocional.",
    ingredients: [
      { name: "Lavandula angustifolia", function: "linalool · calma" },
      { name: "Citrus aurantium amara", function: "nota citrica" },
      { name: "Rosmarinus officinalis", function: "claridad aromatica" },
      { name: "Mentha spicata", function: "frescor" },
    ],
    dosing: [
      { label: "Uso", value: "no ingerir" },
      { label: "Ubicacion", value: "almohada · escritorio · bolso" },
      { label: "Duracion", value: "2-3 semanas" },
      { label: "Formato", value: "sachet botanico" },
    ],
    application: [
      { title: "Pausa sensorial", description: "Acercar el sachet y respirar de forma lenta durante 1-3 minutos." },
      { title: "Descanso", description: "Ubicar cerca de la almohada, sin contacto directo con ojos o mucosas." },
      { title: "Trabajo", description: "Usar como senal olfativa para bajar velocidad mental durante el dia." },
    ],
    protocolNotes: [
      "Puede emparejarse con almohadillas termicas.",
      "FC-S01 calma, FC-S02 serenidad activa, FC-S03 rescate segun necesidad.",
      "Reemplazar si pierde intensidad aromatica.",
    ],
    safetyNote: "No ingerir. Mantener fuera del alcance de ninos y mascotas.",
    contraindications: "Alergia a componentes aromaticos, asma severa o sensibilidad olfativa marcada.",
    related: ["Infusion Somnium", "Te Neurovegetativo", "Almohadillas Termicas"],
  },
  "aceite-neuromuscular": {
    id: 5,
    name: "Aceite NeuroMuscular",
    slug: "aceite-neuromuscular",
    category: "topicos",
    price: "220.00",
    stock: 35,
    accent: "#d4b06a",
    accentSoft: "rgba(212, 176, 106, 0.16)",
    label: "Topico · macerado artesanal",
    icon: Droplets,
    scientificName: "Prunus · Arnica · Rosmarinus · Mentha",
    shortDescription: "Aceite topico para masaje, tension muscular y confort localizado.",
    fullDescription:
      "Base de almendra dulce con macerados botanicos y aceites esenciales diluidos para masaje externo en zonas de tension muscular.",
    purpose: "Apoyo topico para relajacion muscular y confort local por uso externo.",
    ingredients: [
      { name: "Aceite de almendra dulce", function: "base portadora" },
      { name: "Arnica montana", function: "macerado topico" },
      { name: "Rosmarinus officinalis", function: "aroma · circulacion local" },
      { name: "Mentha piperita", function: "mentol · sensacion fresca" },
      { name: "Zingiber officinale", function: "sensacion termica" },
    ],
    dosing: [
      { label: "Cantidad", value: "pequena capa" },
      { label: "Masaje", value: "5-10 min" },
      { label: "Zona", value: "cuello · hombros · lumbar" },
      { label: "Frecuencia", value: "segun tolerancia" },
    ],
    application: [
      { title: "Preparar zona", description: "Aplicar sobre piel integra, limpia y seca." },
      { title: "Masaje", description: "Masajear con presion moderada, evitando mucosas y area ocular." },
      { title: "Termoterapia", description: "Combinar con calor solo si hay buena tolerancia y orientacion adecuada." },
    ],
    protocolNotes: [
      "Puede integrarse desde semana 3 para tension cervico-dorsal.",
      "Realizar test de parche en piel sensible.",
      "No ingerir. Solo uso externo.",
    ],
    safetyNote: "Uso externo unicamente. Evitar contacto con ojos, mucosas, heridas o dermatitis activa.",
    contraindications: "Embarazo, lactancia, epilepsia, piel sensible o alergia a componentes.",
    related: ["Almohadillas Termicas", "Te Neurovegetativo", "Sachets Sensoris"],
  },
  "aceite-ricino": {
    id: 8,
    name: "Aceite de Ricino",
    slug: "aceite-ricino",
    category: "topicos",
    price: "145.00",
    stock: 30,
    accent: "#d4b06a",
    accentSoft: "rgba(212, 176, 106, 0.16)",
    label: "Compresa · topico vegetal",
    icon: Droplets,
    scientificName: "Ricinus communis",
    shortDescription: "Aceite de ricino prensado en frio para rutinas topicas de autocuidado.",
    fullDescription:
      "Aceite vegetal denso tradicionalmente usado en compresas externas. Se integra como apoyo corporal dentro de rutinas guiadas de bienestar.",
    purpose: "Aplicacion topica para protocolo de autocuidado lumbar o abdominal segun orientacion.",
    ingredients: [{ name: "Ricinus communis", function: "aceite vegetal base" }],
    dosing: [
      { label: "Uso", value: "externo" },
      { label: "Aplicacion", value: "capa fina" },
      { label: "Compresa", value: "panio de algodon" },
      { label: "Tiempo", value: "20-60 min segun protocolo" },
    ],
    application: [
      { title: "Aplicar", description: "Colocar capa fina sobre zona indicada y cubrir con panio de algodon." },
      { title: "Calor suave", description: "Puede combinarse con calor moderado si no hay contraindicaciones." },
      { title: "Retirar", description: "Limpiar la piel y observar tolerancia local." },
    ],
    protocolNotes: [
      "En protocolos, puede usarse 2-3 veces por semana.",
      "No usar durante menstruacion activa si hay sensibilidad o indicacion contraria.",
      "Evitar si hay fiebre o dolor abdominal no evaluado.",
    ],
    safetyNote: "Uso externo unicamente. No aplicar sobre piel irritada o heridas abiertas.",
    contraindications: "Embarazo, menstruacion activa si hay sensibilidad, fiebre, piel lesionada u obstruccion intestinal diagnosticada.",
    related: ["Infusion Digestum", "Almohadillas Termicas", "Kit NeuroIntegrativo"],
  },
  "almohadillas-termicas": {
    id: 4,
    name: "Almohadillas Termicas",
    slug: "almohadillas-termicas",
    category: "termoterapia",
    price: "285.00",
    stock: 25,
    accent: "#5b8fa8",
    accentSoft: "rgba(91, 143, 168, 0.18)",
    label: "Termoterapia artesanal",
    icon: ThermometerSun,
    scientificName: "Semillas · hierbas · algodon",
    shortDescription: "Almohadillas de semillas y hierbas para calor o frio local.",
    fullDescription:
      "Sistema de termoterapia artesanal para sesiones de accion termica y olfatoria. Puede usarse caliente o frio segun necesidad y zona.",
    purpose: "Apoya relajacion muscular, confort local y rutinas de descanso.",
    ingredients: [
      { name: "Linaza", function: "retencion termica" },
      { name: "Alpiste", function: "peso y adaptacion" },
      { name: "Hierbas aromaticas", function: "via olfativa" },
      { name: "Algodon", function: "textil natural" },
    ],
    dosing: [
      { label: "Calor", value: "1-2 min microondas" },
      { label: "Frio", value: "refrigerar o congelar" },
      { label: "Sesion", value: "15-20 min" },
      { label: "Zona", value: "lumbar · cuello · abdomen" },
    ],
    application: [
      { title: "Verificar temperatura", description: "Probar siempre antes de aplicar sobre la piel." },
      { title: "Aplicar", description: "Usar sobre la zona deseada durante 15-20 minutos." },
      { title: "Emparejar", description: "Puede combinarse con sachet Sensoris y aceite topico segun protocolo." },
    ],
    protocolNotes: [
      "N1 Base, N2 Sueno, N3 Energia, N4 Dolores segun necesidad.",
      "Casos especiales: respiratoria, articular y menstrual.",
      "No dormir con la almohadilla caliente sobre la piel.",
    ],
    safetyNote: "Verificar temperatura antes de aplicar. No usar sobre piel irritada o con heridas.",
    contraindications: "Insensibilidad termica, piel sensible, heridas abiertas, embarazo en zona abdominal sin orientacion profesional.",
    related: ["Sachets Sensoris", "Aceite NeuroMuscular", "Infusion Somnium"],
  },
  "kit-neurointegrativo": {
    id: 6,
    name: "Kit NeuroIntegrativo Fitociencia Care",
    slug: "kit-neurointegrativo",
    category: "bundle",
    price: "1450.00",
    stock: 15,
    accent: "#b8974a",
    accentSoft: "rgba(184, 151, 74, 0.18)",
    label: "Protocolo completo",
    icon: Leaf,
    scientificName: "Oral · sensorial · topico · termico",
    shortDescription: "Kit completo para rutina NeuroIntegrativa de 8 semanas.",
    fullDescription:
      "Reune infusiones, sachets, termoterapia y apoyo topico para construir una rutina integral guiada por etapas.",
    purpose: "Protocolo completo de bienestar neurointegrativo.",
    ingredients: [
      { name: "Te Neurovegetativo", function: "base reguladora" },
      { name: "Somnium", function: "apoyo nocturno" },
      { name: "Digestum", function: "apoyo digestivo" },
      { name: "Sachets Sensoris", function: "via olfativa" },
      { name: "Almohadilla termica", function: "via termica" },
      { name: "Aceite topico", function: "masaje local" },
    ],
    dosing: [
      { label: "Duracion", value: "8 semanas" },
      { label: "Vias", value: "oral · sensorial · topica · termica" },
      { label: "Seguimiento", value: "segun consulta" },
      { label: "Formato", value: "kit integral" },
    ],
    application: [
      { title: "Semana 1-2", description: "Base de calma y descanso con infusion y via sensorial." },
      { title: "Semana 3-4", description: "Integracion digestiva y apoyo topico en zonas de tension." },
      { title: "Semana 5-8", description: "Ajuste de termoterapia, registro y consolidacion de rutina." },
    ],
    protocolNotes: [
      "Ideal con evaluacion inicial previa.",
      "Permite adaptar productos segun objetivo principal.",
      "Incluye aviso de seguridad por cada componente.",
    ],
    safetyNote: "Revisar contraindicaciones de cada producto individual antes de usar.",
    contraindications: "Dependen de cada componente del kit. Consultar si hay embarazo, lactancia, medicamentos o condicion medica.",
    related: ["Evaluacion de bienestar", "Consulta integrativa", "Membresia educativa"],
  },
};

function toTextList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") {
    try {
      return toTextList(JSON.parse(value));
    } catch {
      return value ? [value] : [];
    }
  }
  return [];
}

function mergeProduct(apiProduct: any, fallback: ProductMeta | undefined): ProductMeta | undefined {
  if (!apiProduct && !fallback) return undefined;
  if (!apiProduct) return fallback;

  const ingredients = toTextList(apiProduct.ingredients);
  return {
    ...(fallback ?? technicalCatalog["kit-neurointegrativo"]),
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    category: apiProduct.category,
    price: String(apiProduct.price),
    stock: apiProduct.stock ?? fallback?.stock ?? 0,
    shortDescription: apiProduct.shortDescription ?? fallback?.shortDescription ?? "",
    fullDescription: apiProduct.fullDescription ?? fallback?.fullDescription ?? apiProduct.shortDescription ?? "",
    purpose: apiProduct.purpose ?? fallback?.purpose ?? "",
    ingredients:
      ingredients.length > 0
        ? ingredients.map((name) => ({
            name,
            function: fallback?.ingredients.find((item) => item.name === name)?.function ?? "componente botanico",
          }))
        : fallback?.ingredients ?? [],
    safetyNote: apiProduct.safetyNote ?? fallback?.safetyNote ?? "",
    contraindications: apiProduct.contraindications ?? fallback?.contraindications ?? "",
  };
}

export default function ProductDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const fallback = technicalCatalog[slug];
  const { data: apiProduct } = trpc.product.getBySlug.useQuery(
    { slug },
    {
      enabled: Boolean(slug),
      retry: false,
    },
  );
  const product = useMemo(() => mergeProduct(apiProduct, fallback), [apiProduct, fallback]);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addItem(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setIsAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="pt-20 min-h-screen bg-[#1a2e1a] text-[#f5f0e8] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p>Producto no encontrado.</p>
        <Link to="/tienda" className="text-[#d4b06a]">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const Icon = product.icon;

  return (
    <div className="pt-20 min-h-screen bg-[#1a2e1a] text-[#f5f0e8]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(106,158,90,0.16),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(184,151,74,0.12),transparent_28%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <Link to="/tienda" className="mb-8 inline-flex items-center gap-2 text-[#a8c896] hover:text-[#d4b06a] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver a la tienda
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14 items-start">
            <div className="order-2 lg:order-1 lg:sticky lg:top-28">
              <div className="relative aspect-[4/3.35] overflow-hidden border border-[#b8974a]/25 bg-[#0a140a] shadow-2xl shadow-black/25 lg:aspect-[4/4.3]">
                <img
                  src={productImages[product.slug] || "/products/kit-neurointegrativo.jpg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a140a] via-[#0a140a]/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono-data text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: product.accent }}>
                      {product.label}
                    </p>
                    <p className="mt-2 text-sm text-[#ede5d5]/70">{product.scientificName}</p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm" style={{ color: product.accent }}>
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-px border border-[#b8974a]/15 bg-[#b8974a]/15">
                {[
                  ["Ficha", "FC-PRO"],
                  ["Lote", product.category.slice(0, 3).toUpperCase()],
                  ["Estado", product.stock > 0 ? "Disponible" : "Agotado"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#0a140a]/90 px-3 py-3 text-center">
                    <p className="font-mono-data text-[0.55rem] uppercase tracking-[0.16em] text-[#b8974a]">{label}</p>
                    <p className="mt-1 text-xs text-[#ede5d5]/80">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="font-mono-data text-[#b8974a] text-xs uppercase tracking-[0.24em] mb-4">Ficha tecnica</p>
              <h1 className="font-display text-5xl lg:text-7xl font-light leading-none">{product.name}</h1>
              {product.scientificName && (
                <p className="mt-4 font-mono-data text-sm uppercase tracking-[0.14em]" style={{ color: product.accent }}>
                  {product.scientificName}
                </p>
              )}
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#a8c896]">{product.fullDescription}</p>

              <div className="mt-8 grid grid-cols-2 gap-px border border-[#b8974a]/20 bg-[#b8974a]/20 sm:grid-cols-4">
                {[
                  ["Categoria", product.category],
                  ["Precio", `GTQ ${product.price}`],
                  ["Stock", `${product.stock}`],
                  ["Via", product.label],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#132513] p-4">
                    <p className="font-mono-data text-[0.58rem] uppercase tracking-[0.16em] text-[#b8974a]">{label}</p>
                    <p className="mt-2 text-sm text-[#ede5d5]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border border-[#b8974a]/25 bg-[#0a140a]/75 p-4 shadow-xl shadow-black/15 sm:p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono-data text-[0.62rem] uppercase tracking-[0.18em] text-[#b8974a]">Cantidad</p>
                    <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-[#b8974a]/30 bg-[#132513] p-1.5">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a140a] text-[#ede5d5] transition-colors hover:bg-[#203820]"
                        aria-label="Reducir cantidad"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-14 text-center font-display text-3xl leading-none text-[#f5f0e8]">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b8974a] text-[#132513] transition-colors hover:bg-[#d4b06a]"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-[#b8974a]/15 pt-4 text-left sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right">
                    <p className="font-mono-data text-[0.62rem] uppercase tracking-[0.18em] text-[#a8c896]/70">Subtotal</p>
                    <p className="mt-2 font-display text-3xl text-[#d4b06a]">
                      GTQ {(Number(product.price) * quantity).toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-[#ede5d5]/50">Precio por unidad: GTQ {product.price}</p>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock <= 0}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium transition-all ${
                    added
                      ? "bg-green-600 text-white"
                      : "bg-[#b8974a] text-[#1a2e1a] hover:bg-[#d4b06a] disabled:cursor-not-allowed disabled:opacity-60"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <ShoppingCart className="w-5 h-5" /> Agregando...
                    </>
                  ) : added ? (
                    <>
                      <Check className="w-5 h-5" /> Agregado al carrito
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" /> Agregar al carrito
                    </>
                  )}
                </button>
                <p className="mt-3 text-xs leading-relaxed text-[#a8c896]/65">
                  Agrega la cantidad deseada y revisa el carrito antes de finalizar. Las recomendaciones de uso se mantienen en esta ficha.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#b8974a]/15 bg-[#0f1c0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono-data text-[#b8974a] text-xs uppercase tracking-[0.22em] mb-4">Funcion dentro del protocolo</p>
              <h2 className="font-display text-3xl lg:text-5xl font-light">{product.purpose}</h2>
            </div>
            <div className="grid gap-px border border-[#2d4a2d] bg-[#2d4a2d] sm:grid-cols-2">
              {product.ingredients.map((ingredient) => (
                <div key={ingredient.name} className="bg-[#132513] p-5">
                  <p className="text-[#ede5d5]">{ingredient.name}</p>
                  <p className="mt-2 font-mono-data text-[0.65rem] uppercase tracking-[0.1em]" style={{ color: product.accent }}>
                    {ingredient.function}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="border border-[#b8974a]/20 bg-black/20 p-6">
            <h2 className="font-display text-2xl font-medium mb-5 flex items-center gap-2">
              <Info className="h-5 w-5" style={{ color: product.accent }} /> Dosificacion y uso
            </h2>
            <div className="space-y-3">
              {product.dosing.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 text-sm">
                  <span className="text-[#a8c896]/75">{row.label}</span>
                  <span className="font-mono-data text-right text-[#d4b06a]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#b8974a]/20 bg-black/20 p-6 lg:col-span-2">
            <h2 className="font-display text-2xl font-medium mb-5">Tecnica de aplicacion</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {product.application.map((step, index) => (
                <div key={step.title} className="border border-[#2d4a2d] p-4" style={{ background: product.accentSoft }}>
                  <p className="font-display text-4xl leading-none text-[#d4b06a]/55">0{index + 1}</p>
                  <h3 className="mt-4 font-medium text-[#f5f0e8]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#ede5d5]/75">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#b8974a]/20 bg-black/20 p-6 lg:col-span-2">
            <h2 className="font-display text-2xl font-medium mb-5">Notas de protocolo</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.protocolNotes.map((note) => (
                <li key={note} className="flex gap-3 text-sm leading-relaxed text-[#ede5d5]/80">
                  <span className="mt-2 h-px w-5 shrink-0 bg-[#b8974a]" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[#8b4020]/40 bg-[#301405]/50 p-6">
            <h2 className="font-display text-2xl font-medium mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#e8c0a0]" /> Seguridad
            </h2>
            <p className="text-sm leading-relaxed text-[#ede5d5]/80">{product.safetyNote}</p>
            <p className="mt-4 font-mono-data text-[0.62rem] uppercase tracking-[0.15em] text-[#e8c0a0]">Contraindicaciones</p>
            <p className="mt-2 text-sm leading-relaxed text-[#ede5d5]/70">{product.contraindications}</p>
          </div>
        </div>

        <div className="mt-12 border border-[#b8974a]/20 bg-[#0a140a]/70 p-6">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[#b8974a]">Relacionados</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.related.map((item) => (
              <span key={item} className="rounded-full border border-[#2d4a2d] px-4 py-2 text-sm text-[#a8c896]">
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-sm leading-relaxed text-[#a8c896]/60">
          <strong className="text-[#ede5d5]/70">Aviso:</strong> Esta ficha tiene fines educativos y de apoyo al bienestar.
          No sustituye diagnostico, tratamiento ni seguimiento medico profesional.
        </p>
      </section>
    </div>
  );
}
