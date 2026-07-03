import { useEffect } from "react";
import { Link } from "react-router";
import { CheckCircle, Home, MessageCircle } from "lucide-react";

export default function OrdenConfirmada() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-20 min-h-screen bg-parchment flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-light text-charcoal mb-4">
          ¡Orden recibida!
        </h1>
        <p className="text-charcoal/70 mb-2">
          Gracias por tu compra. Hemos recibido tu orden correctamente.
        </p>
        <p className="text-charcoal/60 text-sm mb-8">
          Te contactaremos pronto por WhatsApp para confirmar tu pedido y coordinar el pago y envío.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-deep-forest text-white rounded-full font-medium hover:bg-deep-forest/90 transition-all"
          >
            <Home className="w-4 h-4" /> Volver al inicio
          </Link>
          <a
            href="https://wa.me/50200000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-green-600 text-green-600 rounded-full font-medium hover:bg-green-50 transition-all"
          >
            <MessageCircle className="w-4 h-4" /> Contactar por WhatsApp
          </a>
        </div>

        <div className="mt-12 bg-mint-cream rounded-xl p-6">
          <p className="text-charcoal/50 text-sm">
            <strong>Nota:</strong> Esta plataforma utiliza un sistema de órdenes por confirmación.
            Tu pedido será procesado una vez confirmemos la disponibilidad y el pago.
          </p>
        </div>
      </div>
    </div>
  );
}
