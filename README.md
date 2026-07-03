# Fitociencia Care™ — Plataforma Full-Stack de Bienestar Integrativo

Una plataforma completa de bienestar, educación, investigación y comercio electrónico construida para Fitociencia Care™, una institución de salud integrativa basada en Guatemala, Centroamérica.

**URL en producción:** https://juc7xlhitzt3c.kimi.page

---

## Características Principales

### Sitio Web Público
- **Inicio** — Hero con imagen botánica, pilares del modelo, productos destacados, beneficios, membresía, blog
- **Nosotros** — Propósito, misión, visión, valores institucionales, "Dios en primer lugar"
- **Modelo NeuroIntegrativo** — Las 5 vías del bienestar, protocolo de 8 semanas, rutina diaria
- **Tienda** — Catálogo de productos con filtros por categoría, carrito de compras
- **Carrito y Checkout** — Sistema completo de compra con confirmación de orden
- **Cursos** — Página de cursos educativos con acceso controlado por membresía
- **Membresía** — Sistema de suscripción mensual educativa
- **Blog** — Publicaciones de bienestar con categorías
- **Investigación** — Artículos de investigación científica con visibilidad pública/miembros
- **Evaluación de Bienestar** — Formulario interactivo de evaluación personalizada
- **Consultas** — Servicios de consulta y orientación de bienestar
- **Contacto** — Formulario de contacto, WhatsApp, redes sociales
- **Legal** — Avisos de salud, privacidad, términos, disclaimers

### Panel de Administración (`/admin`)
- Dashboard con estadísticas (usuarios, pedidos, ingresos, cursos, suscripciones)
- Lista de pedidos recientes con estados
- Accesos rápidos a gestión de productos, cursos y evaluaciones

### Sistema de Autenticación
- Login con OAuth 2.0 (sistema Kimi)
- Roles de usuario: customer, member, admin
- Middleware de protección de rutas

### Base de Datos (MySQL + Drizzle ORM)
- **19 tablas**: users, profiles, products, carts, orders, payments, subscriptions, courses, lessons, blogPosts, researchPosts, wellnessAssessments, siteSettings, y más
- Relaciones definidas entre tablas
- Datos semilla incluidos (8 productos, 4 cursos, 3 posts de blog, 2 investigaciones, plan de membresía)

### tRPC Routers (Type-safe API)
- `product` — CRUD de productos
- `cart` — Gestión de carrito (sesión + usuario)
- `order` — Creación y gestión de órdenes
- `blog` — CRUD de publicaciones de blog
- `research` — CRUD de investigaciones
- `course` — CRUD de cursos y módulos
- `membership` — Gestión de suscripciones
- `assessment` — Envío y listado de evaluaciones
- `settings` — Configuración del sitio
- `dashboard` — Estadísticas para admin
- `auth` — Autenticación OAuth

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Estilos | Tailwind CSS 3.4 + shadcn/ui |
| Backend | Hono + tRPC 11 + esbuild |
| Base de Datos | MySQL + Drizzle ORM |
| Auth | OAuth 2.0 (Kimi) |
| Iconos | Lucide React |

---

## Estructura del Proyecto

```
/mnt/agents/output/app/
├── api/                      # Backend (Hono + tRPC)
│   ├── routers/              # Routers tRPC
│   ├── middleware.ts         # Auth middleware
│   ├── context.ts            # Contexto de tRPC
│   └── boot.ts               # Entry point del servidor
├── db/                       # Esquema y migraciones
│   ├── schema.ts             # 19 tablas de Drizzle ORM
│   ├── relations.ts          # Relaciones entre tablas
│   ├── seed.ts               # Datos semilla
│   └── reset.ts              # Script para reiniciar DB
├── src/
│   ├── pages/                # 20+ páginas React
│   ├── components/
│   │   └── layout/           # Navbar, Footer
│   ├── contexts/
│   │   └── CartContext.tsx    # Estado global del carrito
│   ├── hooks/
│   │   └── useAuth.ts        # Hook de autenticación
│   ├── providers/
│   │   └── trpc.tsx          # Cliente tRPC
│   ├── App.tsx               # Router con todas las rutas
│   └── main.tsx              # Entry point
├── public/                   # Imágenes generadas
│   ├── products/             # 8 imágenes de productos
│   └── hero-bg.jpg           # Imagen del hero
├── contracts/                # Constantes y tipos compartidos
├── design.md                 # Documento de diseño
├── backend.md                # Documento del backend
└── README.md                 # Este archivo
```

---

## Instrucciones de Instalación

### 1. Instalar dependencias
```bash
cd /mnt/agents/output/app
npm install
```

### 2. Configurar variables de entorno
El archivo `.env` ya está configurado con las credenciales de la base de datos.

### 3. Crear base de datos y semilla (ya hecho)
```bash
# Reiniciar tablas (si es necesario)
npx tsx db/reset.ts

# Aplicar esquema
npm run db:push

# Sembrar datos
npx tsx db/seed.ts
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```
Abre http://localhost:3000

### 5. Construir para producción
```bash
npm run build
```

---

## Cómo Crear un Usuario Admin

El sistema usa OAuth 2.0 para autenticación. Para convertir un usuario en admin:

1. Inicia sesión normalmente a través del login
2. Actualiza el rol en la base de datos:
```sql
UPDATE users SET role = 'admin' WHERE id = <user_id>;
```

---

## Datos Semilla Incluidos

### Productos (8)
- Té Neurovegetativo — GTQ 185.00
- Infusión Somnium — GTQ 195.00
- Infusión Digestum — GTQ 175.00
- Sachets Sensōris™ — GTQ 125.00
- Almohadillas Térmicas — GTQ 285.00
- Aceite de Ricino — GTQ 145.00
- Aceite NeuroMuscular — GTQ 220.00
- Kit NeuroIntegrativo — GTQ 1,450.00

### Cursos (4)
- Fundamentos de Fitoterapia Clínica
- Nutrición Naturopática Aplicada
- Sistema Nervioso y Bienestar
- Aromaterapia Científica

### Blog (3 posts)
- Melissa officinalis: La hierba de la calma
- El eje intestino-cerebro
- Aromaterapia y sistema límbico

### Investigación (2 artículos)
- Revisión sistemática: Fitoterapia en el SNA
- Fitoquímica de Passiflora incarnata

---

## Flujo de Compra

1. Usuario navega productos en `/tienda`
2. Agrega al carrito (sesión anónima o autenticada)
3. Revisa carrito en `/carrito`
4. Completa checkout en `/checkout` con datos de envío
5. Orden confirmada en `/orden-confirmada`
6. Coordinación de pago y envío por WhatsApp

## Flujo de Membresía

1. Usuario ve `/membresia`
2. Contacta por WhatsApp para activar
3. Admin crea suscripción en la base de datos
4. Usuario accede a cursos mientras la suscripción esté activa
5. Si la suscripción vence, el acceso se bloquea

---

## Lenguaje de Bienestar

Todos los contenidos usan lenguaje cuidadoso de bienestar:
- ✅ "Apoya el equilibrio", "favorece la relajación", "contribuye al bienestar"
- ❌ Evita: "cura", "trata", "sana", "garantiza resultados"

---

## Licencia

© 2025 Fitociencia Care™ — Todos los derechos reservados.
