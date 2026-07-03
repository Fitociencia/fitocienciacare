import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { Menu, X, ShoppingCart, Leaf, User, LogOut } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Modelo", href: "/modelo-neurointegrativo" },
  { label: "Productos", href: "/tienda" },
  { label: "Cursos", href: "/cursos" },
  { label: "Blog", href: "/blog" },
  { label: "Investigación", href: "/investigacion" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const showSolid = scrolled || !isHome;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showSolid
            ? "bg-deep-forest/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Leaf className={`w-6 h-6 ${showSolid ? "text-mint-cream" : "text-white"}`} />
              <span className={`font-display text-xl lg:text-2xl font-medium tracking-tight ${showSolid ? "text-white" : "text-white"}`}>
                Fitociencia Care™
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-opacity hover:opacity-70 ${
                    showSolid ? "text-white/90" : "text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/carrito"
                className={`relative p-2 transition-opacity hover:opacity-70 ${showSolid ? "text-white" : "text-white"}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-earth-clay text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="hidden lg:flex items-center gap-2">
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className={`px-3 py-2 text-sm font-medium transition-opacity hover:opacity-70 ${showSolid ? "text-white/90" : "text-white/90"}`}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/mi-cuenta"
                    className={`p-2 transition-opacity hover:opacity-70 ${showSolid ? "text-white" : "text-white"}`}
                  >
                    <User className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden lg:block px-4 py-2 text-sm font-medium border rounded-full transition-all hover:bg-white hover:text-deep-forest ${
                    showSolid ? "text-white border-white/40" : "text-white border-white/40"
                  }`}
                >
                  Iniciar sesión
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 ${showSolid ? "text-white" : "text-white"}`}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-deep-forest pt-20">
          <div className="flex flex-col items-center gap-6 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-white/90 text-lg font-medium hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/mi-cuenta" className="text-white/90 text-lg font-medium">
                  Mi Cuenta
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="text-white/90 text-lg font-medium">
                    Panel Admin
                  </Link>
                )}
                <button onClick={logout} className="text-earth-clay text-lg font-medium flex items-center gap-2">
                  <LogOut className="w-5 h-5" /> Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="text-white text-lg font-medium border border-white/40 px-6 py-2 rounded-full">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
