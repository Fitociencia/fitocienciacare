import { getDb } from "../api/queries/connection";
import {
  products,
  productImages,
  membershipPlans,
  courses,
  courseModules,
  lessons,
  blogPosts,
  researchPosts,
  siteSettings,
} from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed products
  console.log("Seeding products...");
  const productData = [
    {
      name: "Té Neurovegetativo",
      slug: "te-neurovegetativo",
      category: "fitoterapia" as const,
      shortDescription: "Infusión botánica para el equilibrio del sistema nervioso autónomo y la relajación.",
      fullDescription: "Nuestra fórmula signature combina cuatro plantas tradicionales en proporciones precisas para crear una infusión que acompaña los procesos naturales de equilibrio del sistema nervioso.",
      purpose: "Apoya el equilibrio del sistema nervioso autónomo, favorece la relajación y contribuye al bienestar general.",
      ingredients: JSON.stringify(["Melissa officinalis", "Matricaria chamomilla", "Tilia platyphyllos / Tilia europaea", "Citrus sinensis peel"]),
      suggestedUse: "Una taza en la mañana. Vertir agua caliente (no hirviendo) sobre una cucharada de la mezcla. Dejar reposar 5-7 minutos.",
      safetyNote: "No exceder la dosis recomendada. Consultar a un profesional de salud antes de usar si está embarazada, en lactancia o toma medicamentos.",
      contraindications: "Embarazo, lactancia, hipersensibilidad a alguno de los componentes.",
      price: "185.00",
      stock: 50,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Infusión Somnium",
      slug: "infusion-somnium",
      category: "fitoterapia" as const,
      shortDescription: "Mezcla nocturna de hierbas para favorecer la calidad del descanso.",
      fullDescription: "Fórmula nocturna diseñada para acompañar los procesos naturales de relajación previos al descanso.",
      purpose: "Favorece la relajación nocturna y apoya la calidad del descanso de manera natural.",
      ingredients: JSON.stringify(["Melissa officinalis", "Passiflora incarnata", "Matricaria chamomilla", "Lavandula angustifolia"]),
      suggestedUse: "Una taza 30-45 minutos antes de dormir.",
      safetyNote: "Puede causar somnolencia. No conducir ni operar maquinaria después de consumir. Consultar a un profesional de salud antes de usar.",
      contraindications: "Embarazo, lactancia, uso de sedantes, hipersensibilidad a alguno de los componentes.",
      price: "195.00",
      stock: 40,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Infusión Digestum",
      slug: "infusion-digestum",
      category: "fitoterapia" as const,
      shortDescription: "Apoyo digestivo natural con hierbas tradicionales.",
      fullDescription: "Fórmula tradicional que combina plantas conocidas por sus propiedades digestivas para acompañar el bienestar gastrointestinal.",
      purpose: "Apoya el bienestar digestivo y contribuye al equilibrio del eje intestino-cerebro.",
      ingredients: JSON.stringify(["Peumus boldus", "Foeniculum vulgare", "Mentha piperita"]),
      suggestedUse: "Una taza después de las comidas principales.",
      safetyNote: "Consultar a un profesional de salud antes de usar si tiene condiciones hepáticas o toma medicamentos.",
      contraindications: "Embarazo, obstrucción biliar, hipersensibilidad a alguno de los componentes.",
      price: "175.00",
      stock: 45,
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Sachets Sensōris™",
      slug: "sachets-sensoris",
      category: "sachets" as const,
      shortDescription: "Sachets aromáticos botánicos para bienestar sensorial y calma emocional.",
      fullDescription: "Cada sachet contiene una sinergia botánica cuidadosamente seleccionada para estimular el sentido del olfato y acompañar momentos específicos del día.",
      purpose: "Bienestar olfativo, calma emocional y autocuidado sensorial.",
      ingredients: JSON.stringify(["Lavandula angustifolia", "Citrus aurantium amara", "Rosmarinus officinalis", "Mentha spicata"]),
      suggestedUse: "Colocar cerca de la almohada, en el escritorio o en el automóvil. Reemplazar cada 2-3 semanas.",
      safetyNote: "No ingerir. Mantener fuera del alcance de niños y mascotas.",
      contraindications: "Alergia a componentes aromáticos, asma severa.",
      price: "125.00",
      stock: 60,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Almohadillas Térmicas",
      slug: "almohadillas-termicas",
      category: "termoterapia" as const,
      shortDescription: "Almohadillas térmicas de hierbas para relajación muscular y confort local.",
      fullDescription: "Almohadillas rellenas de una mezcla de semillas y hierbas aromáticas que retienen el calor. Diseñadas para aplicar en áreas específicas del cuerpo.",
      purpose: "Termoterapia para relajación muscular y confort local.",
      ingredients: null,
      suggestedUse: "Calentar en microondas por 1-2 minutos. Aplicar sobre la zona deseada por 15-20 minutos.",
      safetyNote: "Verificar temperatura antes de aplicar. No usar sobre piel irritada o heridas abiertas.",
      contraindications: "Embarazo (evitar zona abdominal), piel sensible, insensibilidad térmica.",
      price: "285.00",
      stock: 25,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Aceite de Ricino",
      slug: "aceite-ricino",
      category: "topicos" as const,
      shortDescription: "Aceite de ricino prensado en frío para aplicación tópica lumbar.",
      fullDescription: "Aceite de ricino puro, prensado en frío, tradicionalmente utilizado como parte de protocolos de autocuidado lumbar.",
      purpose: "Aplicación tópica para protocolo de autocuidado lumbar.",
      ingredients: JSON.stringify(["Ricinus communis (aceite de ricino) prensado en frío"]),
      suggestedUse: "Aplicar una capa fina sobre la zona lumbar. Cubrir con un paño de algodón y aplicar calor suave por 20-30 minutos, 3 veces por semana.",
      safetyNote: "Uso externo únicamente. No aplicar sobre piel irritada o heridas abiertas. Lavar bien las manos después de usar.",
      contraindications: "Embarazo, piel rota, alergia al aceite de ricino.",
      price: "145.00",
      stock: 30,
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Aceite NeuroMuscular",
      slug: "aceite-neuromuscular",
      category: "topicos" as const,
      shortDescription: "Aceite tópico para relajación muscular y confort local.",
      fullDescription: "Fórmula de aceites esenciales diluidos en aceite portador, diseñada para masaje tópico en áreas de tensión muscular.",
      purpose: "Relajación muscular y confort local por uso externo.",
      ingredients: JSON.stringify(["Arnica montana extracto", "Hypericum perforatum extracto", "Mentha piperita aceite esencial", "Rosmarinus officinalis aceite esencial"]),
      suggestedUse: "Aplicar una pequeña cantidad sobre la zona deseada y masajear suavemente. Usar después de la actividad física.",
      safetyNote: "Uso externo únicamente. Evitar contacto con ojos y mucosas. No aplicar sobre piel irritada.",
      contraindications: "Embarazo, lactancia, piel sensible, alergia a componentes.",
      price: "220.00",
      stock: 35,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Kit NeuroIntegrativo Fitociencia Care™",
      slug: "kit-neurointegrativo",
      category: "bundle" as const,
      shortDescription: "El kit completo con todos los componentes del Modelo NeuroIntegrativo.",
      fullDescription: "El Kit NeuroIntegrativo incluye todos los productos del modelo en un solo paquete con guía de protocolo de 8 semanas. Incluye: Té Neurovegetativo, Infusión Somnium, Infusión Digestum, Sachets Sensōris™, Almohadilla Térmica, Aceite de Ricino y Aceite NeuroMuscular.",
      purpose: "Protocolo completo de bienestar neurointegrativo de 8 semanas.",
      ingredients: null,
      suggestedUse: "Seguir el protocolo de 8 semanas incluido en la guía.",
      safetyNote: "Revisar las contraindicaciones de cada producto individual.",
      contraindications: "Ver contraindicaciones de cada producto individual.",
      price: "1450.00",
      stock: 15,
      isActive: true,
      isFeatured: true,
    },
  ];

  for (const p of productData) {
    await db.insert(products).values(p);
  }
  console.log("Products seeded.");

  // Seed membership plan
  console.log("Seeding membership plans...");
  await db.insert(membershipPlans).values({
    name: "Membresía Educativa Fitociencia Care™",
    slug: "membresia-educativa",
    description: "Acceso mensual a cursos educativos, recursos de bienestar, materiales descargables y contenido formativo creado para promover prevención, autocuidado y estilos de vida saludables.",
    monthlyPrice: "299.00",
    benefits: JSON.stringify([
      "Acceso ilimitado a todos los cursos",
      "Materiales descargables",
      "Nuevos cursos cada mes",
      "Foro de comunidad",
      "Descuentos en productos",
    ]),
    isActive: true,
  });
  console.log("Membership plans seeded.");

  // Seed courses
  console.log("Seeding courses...");
  const courseData = [
    {
      title: "Fundamentos de Fitoterapia Clínica",
      slug: "fundamentos-fitoterapia",
      description: "Introducción a la fitoterapia clínica: principios activos, formas farmacéuticas, contraindicaciones y aplicaciones prácticas.",
      level: "beginner" as const,
      duration: "12 horas",
      instructor: "Equipo Fitociencia Care™",
      requiresSubscription: true,
      category: "fitoterapia" as const,
      isPublished: true,
    },
    {
      title: "Nutrición Naturopática Aplicada",
      slug: "nutricion-naturopatica",
      description: "Principios de la nutrición naturopática y su aplicación en el bienestar integral.",
      level: "beginner" as const,
      duration: "10 horas",
      instructor: "Equipo Fitociencia Care™",
      requiresSubscription: true,
      category: "nutricion_naturopatica" as const,
      isPublished: true,
    },
    {
      title: "Sistema Nervioso y Bienestar",
      slug: "sistema-nervioso-bienestar",
      description: "Comprensión del sistema nervioso autónomo y estrategias naturales para su equilibrio.",
      level: "intermediate" as const,
      duration: "15 horas",
      instructor: "Equipo Fitociencia Care™",
      requiresSubscription: true,
      category: "sistema_nervioso" as const,
      isPublished: true,
    },
    {
      title: "Aromaterapia Científica",
      slug: "aromaterapia-cientifica",
      description: "Base científica de la aromaterapia, vía olfativa y aplicaciones terapéuticas.",
      level: "beginner" as const,
      duration: "8 horas",
      instructor: "Equipo Fitociencia Care™",
      requiresSubscription: true,
      category: "aromaterapia" as const,
      isPublished: true,
    },
  ];

  for (const c of courseData) {
    await db.insert(courses).values(c);
  }
  console.log("Courses seeded.");

  // Seed blog posts
  console.log("Seeding blog posts...");
  const blogData = [
    {
      title: "Melissa officinalis: La hierba de la calma",
      slug: "melissa-officinalis-hierba-calma",
      excerpt: "Descubre las propiedades de la melisa y su uso tradicional para acompañar procesos de relajación.",
      content: "## Melissa officinalis: La hierba de la calma\n\nLa Melissa officinalis, conocida comúnmente como toronjil o melisa, es una planta perenne de la familia Lamiaceae que ha sido utilizada durante siglos en la tradición herbal europea...",
      category: "fitoterapia" as const,
      author: "Equipo Fitociencia Care™",
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: "El eje intestino-cerebro: Conexión clave del bienestar",
      slug: "eje-intestino-cerebro-bienestar",
      excerpt: "Explora la fascinante conexión entre nuestro sistema digestivo y la salud mental.",
      content: "## El eje intestino-cerebro\n\nEl eje intestino-cerebro representa uno de los descubrimientos más importantes en neurociencia en las últimas décadas...",
      category: "eje_intestino_cerebro" as const,
      author: "Equipo Fitociencia Care™",
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: "Aromaterapia y sistema límbico",
      slug: "aromaterapia-sistema-limbico",
      excerpt: "Cómo los aromas influyen en nuestras emociones a través del sistema olfativo.",
      content: "## Aromaterapia y sistema límbico\n\nLa conexión entre el olfato y el sistema límbico es una de las vías más directas entre el mundo exterior y nuestra respuesta emocional...",
      category: "aromaterapia" as const,
      author: "Equipo Fitociencia Care™",
      isPublished: true,
      publishedAt: new Date(),
    },
  ];

  for (const b of blogData) {
    await db.insert(blogPosts).values(b);
  }
  console.log("Blog posts seeded.");

  // Seed research posts
  console.log("Seeding research posts...");
  const researchData = [
    {
      title: "Revisión sistemática: Fitoterapia en el apoyo al sistema nervioso autónomo",
      slug: "fitoterapia-sistema-nervioso-autonomo-revision",
      abstract: "Revisión sistemática de estudios clínicos sobre el uso de fitoterapia en el apoyo al equilibrio del sistema nervioso autónomo.",
      content: "## Resumen\n\nEsta revisión sistemática analiza la evidencia científica disponible sobre el uso de preparaciones fitoterapéuticas...",
      category: "fitoterapia_clinica" as const,
      author: "Dr. Equipo Fitociencia Care™",
      visibility: "public" as const,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: "Fitoquímica de Passiflora incarnata: Compuestos bioactivos",
      slug: "fitoquimica-passiflora-incarnata",
      abstract: "Análisis de los compuestos bioactivos presentes en Passiflora incarnata y su potencial bienestar.",
      content: "## Abstract\n\nPassiflora incarnata contiene una variedad de compuestos bioactivos incluyendo flavonoides, alcaloides y glicósidos...",
      category: "fitoquimica" as const,
      author: "Equipo de Investigación Fitociencia Care™",
      visibility: "members_only" as const,
      isPublished: true,
      publishedAt: new Date(),
    },
  ];

  for (const r of researchData) {
    await db.insert(researchPosts).values(r);
  }
  console.log("Research posts seeded.");

  // Seed site settings
  console.log("Seeding site settings...");
  const settingsData = [
    { key: "whatsapp", value: "+50200000000" },
    { key: "email", value: "info@fitocienciacare.com" },
    { key: "instagram", value: "@fitocienciacare" },
    { key: "tiktok", value: "@fitocienciacare" },
    { key: "address", value: "Guatemala, Centroamérica" },
    { key: "businessHours", value: "Lunes a Viernes: 9:00 AM - 6:00 PM" },
  ];

  for (const s of settingsData) {
    await db.insert(siteSettings).values(s);
  }
  console.log("Site settings seeded.");

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
