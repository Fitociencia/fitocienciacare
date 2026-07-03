import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Instagram, Clock, Send, MessageCircle } from "lucide-react";

export default function Contacto() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium">Contacto</p>
          <h1 className="font-display text-4xl lg:text-5xl font-light text-charcoal mb-12">
            Estamos aquí para ti.
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact info */}
            <div>
              <p className="text-charcoal/70 text-lg leading-relaxed mb-10">
                ¿Tienes preguntas sobre nuestros productos, cursos o servicios?
                Estamos disponibles para ayudarte a encontrar el camino hacia tu bienestar integral.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-mint-cream rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-deep-forest" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal mb-1">WhatsApp</h3>
                    <p className="text-charcoal/60">+502 0000 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-mint-cream rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-deep-forest" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal mb-1">Email</h3>
                    <p className="text-charcoal/60">info@fitocienciacare.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-mint-cream rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-deep-forest" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal mb-1">Ubicación</h3>
                    <p className="text-charcoal/60">Guatemala, Centroamérica</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-mint-cream rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-deep-forest" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal mb-1">Horario</h3>
                    <p className="text-charcoal/60">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-mint-cream rounded-xl flex items-center justify-center shrink-0">
                    <Instagram className="w-5 h-5 text-deep-forest" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal mb-1">Instagram</h3>
                    <p className="text-charcoal/60">@fitocienciacare</p>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/50200000000"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-earth-clay text-white rounded-full font-medium hover:bg-earth-clay/90 transition-all"
              >
                <MessageCircle className="w-5 h-5" /> Escríbenos por WhatsApp
              </a>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 lg:p-10">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-medium text-charcoal mb-2">¡Mensaje enviado!</h3>
                  <p className="text-charcoal/60">Te responderemos lo antes posible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Nombre</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-deep-forest/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-deep-forest/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Mensaje</label>
                    <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-deep-forest/20 resize-none" />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-deep-forest text-white rounded-full font-medium hover:bg-deep-forest/90 transition-all">
                    <Send className="w-5 h-5" /> Enviar mensaje
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
