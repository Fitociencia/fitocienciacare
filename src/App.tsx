import { Routes, Route } from 'react-router'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Nosotros from './pages/Nosotros'
import ModeloNeuroIntegrativo from './pages/ModeloNeuroIntegrativo'
import Tienda from './pages/Tienda'
import ProductDetail from './pages/ProductDetail'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import OrdenConfirmada from './pages/OrdenConfirmada'
import Cursos from './pages/Cursos'
import CourseDetail from './pages/CourseDetail'
import Membresia from './pages/Membresia'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Investigacion from './pages/Investigacion'
import ResearchPost from './pages/ResearchPost'
import Evaluacion from './pages/Evaluacion'
import Consultas from './pages/Consultas'
import Contacto from './pages/Contacto'
import Legal from './pages/Legal'
import MiCuenta from './pages/MiCuenta'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/modelo-neurointegrativo" element={<ModeloNeuroIntegrativo />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/tienda/:slug" element={<ProductDetail />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orden-confirmada" element={<OrdenConfirmada />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:slug" element={<CourseDetail />} />
          <Route path="/membresia" element={<Membresia />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/investigacion" element={<Investigacion />} />
          <Route path="/investigacion/:slug" element={<ResearchPost />} />
          <Route path="/evaluacion" element={<Evaluacion />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/mi-cuenta" element={<MiCuenta />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
