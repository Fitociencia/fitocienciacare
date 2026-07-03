import { Link } from "react-router";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-deep-forest text-white">
      {/* Upper section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-light mb-4">
              Comienza tu protocolo.
            </h2>
            <p className="text-white/60 mb-8 max-w-md text-lg">
              Agenda una consulta inicial para diseñar tu plan NeuroIntegrativo personalizado.
            </p>
            <a
              href="https://wa.me/50200000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-earth-clay text-white px-8 py-3 rounded-full font-medium hover:bg-earth-clay/90 transition-colors"
            >
              Agendar consulta
            </a>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-sage mt-1 shrink-0" />
              <div>
                <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Email</p>
                <p className="text-white/80">info@fitocienciacare.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-sage mt-1 shrink-0" />
              <div>
                <p className="text-sm text-white/40 uppercase tracking-wider mb-1">WhatsApp</p>
                <p className="text-white/80">+502 0000 0000</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-sage mt-1 shrink-0" />
              <div>
                <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Ubicación</p>
                <p className="text-white/80">Guatemala, Centroamérica</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Instagram className="w-5 h-5 text-sage mt-1 shrink-0" />
              <div>
                <p className="text-sm text-white/40 uppercase tracking-wider mb-1">Instagram</p>
                <p className="text-white/80">@fitocienciacare</p>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm uppercase tracking-wider text-white/40 mb-4">Productos</h4>
              <ul className="space-y-2">
                <li><Link to="/tienda" className="text-white/60 hover:text-white transition-colors text-sm">Todas las categorías</Link></li>
                <li><Link to="/tienda?category=fitoterapia" className="text-white/60 hover:text-white transition-colors text-sm">Fitoterapia</Link></li>
                <li><Link to="/tienda?category=sachets" className="text-white/60 hover:text-white transition-colors text-sm">Sachets</Link></li>
                <li><Link to="/tienda?category=termoterapia" className="text-white/60 hover:text-white transition-colors text-sm">Termoterapia</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-white/40 mb-4">Educación</h4>
              <ul className="space-y-2">
                <li><Link to="/cursos" className="text-white/60 hover:text-white transition-colors text-sm">Cursos</Link></li>
                <li><Link to="/membresia" className="text-white/60 hover:text-white transition-colors text-sm">Membresía</Link></li>
                <li><Link to="/blog" className="text-white/60 hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link to="/investigacion" className="text-white/60 hover:text-white transition-colors text-sm">Investigación</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-white/40 mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li><Link to="/evaluacion" className="text-white/60 hover:text-white transition-colors text-sm">Evaluación de bienestar</Link></li>
                <li><Link to="/consultas" className="text-white/60 hover:text-white transition-colors text-sm">Consultas</Link></li>
                <li><Link to="/modelo-neurointegrativo" className="text-white/60 hover:text-white transition-colors text-sm">Modelo NeuroIntegrativo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-white/40 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/legal" className="text-white/60 hover:text-white transition-colors text-sm">Aviso de salud</Link></li>
                <li><Link to="/legal" className="text-white/60 hover:text-white transition-colors text-sm">Privacidad</Link></li>
                <li><Link to="/legal" className="text-white/60 hover:text-white transition-colors text-sm">Términos</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lower section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2025 Fitociencia Care™. Todos los derechos reservados.
            </p>
            <p className="text-white/40 text-sm font-display italic">
              Naturaleza con evidencia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
