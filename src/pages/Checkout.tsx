import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/contexts/CartContext";
import { CreditCard, MessageCircle } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, refreshCart } = useCart();
  const createOrder = trpc.order.create.useMutation({
    onSuccess: () => {
      refreshCart();
      navigate("/orden-confirmada");
    },
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-parchment flex flex-col items-center justify-center gap-4">
        <p className="text-charcoal">Tu carrito está vacío</p>
        <button onClick={() => navigate("/tienda")} className="text-earth-clay">Ir a la tienda</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder.mutateAsync({
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      shippingAddress: form.address,
      notes: form.notes,
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: Number(item.priceAtTime),
      })),
      total,
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <h1 className="font-display text-3xl lg:text-4xl font-light text-charcoal mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Nombre completo *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage/30 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Correo electrónico *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage/30 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage/30 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-deep-forest/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Dirección de envío *</label>
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage/30 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-deep-forest/20 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Notas adicionales</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage/30 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-deep-forest/20 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={createOrder.isPending}
              className="w-full flex items-center justify-center gap-2 py-4 bg-deep-forest text-white rounded-full font-medium hover:bg-deep-forest/90 transition-all disabled:opacity-50"
            >
              {createOrder.isPending ? "Procesando..." : <><CreditCard className="w-5 h-5" /> Confirmar orden</>}
            </button>

            <a
              href={`https://wa.me/50200000000?text=Hola, quiero hacer un pedido:%0A%0A${items.map(i => `- ${i.productName} x${i.quantity}`).join("%0A")}%0A%0ATotal: GTQ ${total}%0A%0ANombre: ${form.name || "[Pendiente]"}%0ADirección: ${form.address || "[Pendiente]"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 border border-green-600 text-green-600 rounded-full font-medium hover:bg-green-50 transition-all mt-4"
            >
              <MessageCircle className="w-5 h-5" /> Comprar por WhatsApp
            </a>
          </form>

          {/* Order summary */}
          <div className="bg-white rounded-xl p-6 lg:p-8 h-fit">
            <h2 className="font-display text-xl font-medium text-charcoal mb-6">Resumen del pedido</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-charcoal font-medium">{item.productName}</p>
                    <p className="text-charcoal/50 text-sm">x{item.quantity}</p>
                  </div>
                  <p className="text-charcoal">GTQ {(Number(item.priceAtTime) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-charcoal/10 pt-4 flex items-center justify-between">
              <span className="font-medium text-charcoal">Total</span>
              <span className="font-display text-2xl text-earth-clay">GTQ {total}</span>
            </div>

            <div className="mt-6 bg-mint-cream rounded-xl p-4">
              <p className="text-charcoal/70 text-sm">
                <strong>Métodos de pago:</strong> Transferencia bancaria, depósito o pago en efectivo.
                También puedes coordinar tu pago por WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
