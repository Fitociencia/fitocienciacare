import { useEffect } from "react";
import { Link } from "react-router";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

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

export default function Carrito() {
  const { items, total, removeItem, updateQuantity, isLoading } = useCart();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="animate-pulse text-sage">Cargando carrito...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <ShoppingBag className="w-16 h-16 text-sage/40 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-light text-charcoal mb-4">Tu carrito está vacío</h1>
          <p className="text-charcoal/60 mb-8">Explora nuestros productos naturales y comienza tu protocolo de bienestar.</p>
          <Link to="/tienda" className="inline-flex items-center gap-2 px-8 py-3 bg-deep-forest text-white rounded-full font-medium hover:bg-deep-forest/90 transition-all">
            Ver productos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <h1 className="font-display text-3xl lg:text-4xl font-light text-charcoal mb-12">Carrito de compras</h1>

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 lg:p-6 flex items-center gap-4 lg:gap-6">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-deep-forest/5 shrink-0">
                <img
                  src={productImages[item.productSlug] || "/products/kit-neurointegrativo.jpg"}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/tienda/${item.productSlug}`} className="font-display text-lg font-medium text-charcoal hover:text-earth-clay transition-colors block truncate">
                  {item.productName}
                </Link>
                <p className="text-earth-clay font-medium">GTQ {item.priceAtTime}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center border border-sage/30 rounded-full hover:bg-sage/10 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-charcoal">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-sage/30 rounded-full hover:bg-sage/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-charcoal/40 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-10 bg-white rounded-xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-charcoal/70">Subtotal</span>
            <span className="font-display text-xl text-charcoal">GTQ {total}</span>
          </div>
          <div className="flex items-center justify-between mb-8 pt-4 border-t border-charcoal/10">
            <span className="font-medium text-charcoal">Total</span>
            <span className="font-display text-2xl text-earth-clay">GTQ {total}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/checkout"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-deep-forest text-white rounded-full font-medium hover:bg-deep-forest/90 transition-all"
            >
              Proceder al pago <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/50200000000?text=Hola, quiero comprar estos productos: ${items.map(i => `${i.productName} x${i.quantity}`).join(", ")}. Total: GTQ ${total}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-sage text-sage rounded-full font-medium hover:bg-sage/10 transition-all"
            >
              Comprar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
