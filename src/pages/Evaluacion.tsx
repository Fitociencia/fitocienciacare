import { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { CheckCircle, AlertTriangle, Send } from "lucide-react";

const supportOptions = [
  { value: "infusion", label: "Infusiones / Fitoterapia" },
  { value: "topico", label: "Productos tópicos" },
  { value: "sensorial", label: "Aromaterapia / Sachets" },
  { value: "nutricion", label: "Nutrición / Consulta" },
  { value: "consulta", label: "Consulta personalizada" },
];

export default function Evaluacion() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", age: "", email: "", whatsapp: "", mainConcern: "",
    stressLevel: 5, sleepQuality: 5, digestiveDiscomfort: 5,
    muscleTension: 5, energyLevel: 5, medications: "",
    pregnancyLactation: false, allergies: "",
    preferredSupport: [] as string[], consent: false,
  });

  const submitMutation = trpc.assessment.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      name: form.name,
      age: form.age ? parseInt(form.age) : undefined,
      email: form.email,
      whatsapp: form.whatsapp || undefined,
      mainConcern: form.mainConcern || undefined,
      stressLevel: form.stressLevel,
      sleepQuality: form.sleepQuality,
      digestiveDiscomfort: form.digestiveDiscomfort,
      muscleTension: form.muscleTension,
      energyLevel: form.energyLevel,
      medications: form.medications || undefined,
      pregnancyLactation: form.pregnancyLactation,
      allergies: form.allergies || undefined,
      preferredSupport: form.preferredSupport.length > 0 ? form.preferredSupport : undefined,
      consent: form.consent,
    });
  };

  const toggleSupport = (value: string) => {
    setForm((prev) => ({
      ...prev,
      preferredSupport: prev.preferredSupport.includes(value)
        ? prev.preferredSupport.filter((s) => s !== value)
        : [...prev.preferredSupport, value],
    }));
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center py-20">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-light text-charcoal mb-4">
            ¡Evaluación enviada!
          </h1>
          <p className="text-charcoal/70 mb-4">
            Gracias por completar la evaluación. Esta evaluación no constituye diagnóstico médico.
          </p>
          <p className="text-charcoal/60 text-sm">
            El equipo de Fitociencia Care™ revisará tus respuestas para orientarte hacia una consulta
            o protocolo de bienestar adecuado. Te contactaremos pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium">Bienestar</p>
        <h1 className="font-display text-3xl lg:text-4xl font-light text-charcoal mb-4">
          Evaluación de Bienestar
        </h1>
        <p className="text-charcoal/60 mb-12">
          Esta evaluación nos ayuda a orientarte hacia el protocolo de bienestar más adecuado para ti.
          No constituye diagnóstico médico.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal info */}
          <div className="bg-white rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-medium text-charcoal mb-6">Información personal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Nombre completo *</label>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-deep-forest/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Edad</label>
                <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-deep-forest/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-deep-forest/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">WhatsApp</label>
                <input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-deep-forest/20" />
              </div>
            </div>
          </div>

          {/* Wellness assessment */}
          <div className="bg-white rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-medium text-charcoal mb-6">Áreas de bienestar</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-2">¿Cuál es tu principal preocupación de bienestar?</label>
              <textarea rows={3} value={form.mainConcern} onChange={(e) => setForm({ ...form, mainConcern: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-deep-forest/20 resize-none" />
            </div>

            {[
              { key: "stressLevel", label: "Nivel de estrés (1-10)" },
              { key: "sleepQuality", label: "Calidad del sueño (1-10)" },
              { key: "digestiveDiscomfort", label: "Malestar digestivo (1-10)" },
              { key: "muscleTension", label: "Tensión muscular (1-10)" },
              { key: "energyLevel", label: "Nivel de energía (1-10)" },
            ].map((field) => (
              <div key={field.key} className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-2">{field.label}</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form[field.key as keyof typeof form] as number}
                  onChange={(e) => setForm({ ...form, [field.key]: parseInt(e.target.value) })}
                  className="w-full accent-deep-forest"
                />
                <div className="flex justify-between text-xs text-charcoal/40 mt-1">
                  <span>Bajo (1)</span>
                  <span className="font-medium text-deep-forest">{form[field.key as keyof typeof form]}</span>
                  <span>Alto (10)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Health info */}
          <div className="bg-white rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-medium text-charcoal mb-6">Información de salud</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">¿Tomas algún medicamento actualmente?</label>
                <textarea rows={2} value={form.medications} onChange={(e) => setForm({ ...form, medications: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-deep-forest/20 resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="pregnancy" checked={form.pregnancyLactation} onChange={(e) => setForm({ ...form, pregnancyLactation: e.target.checked })} className="w-5 h-5 accent-deep-forest" />
                <label htmlFor="pregnancy" className="text-charcoal">¿Estás embarazada o en período de lactancia?</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Alergias conocidas</label>
                <textarea rows={2} value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-deep-forest/20 resize-none" />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-medium text-charcoal mb-6">Preferencias de apoyo</h2>
            <p className="text-charcoal/60 text-sm mb-4">Selecciona las opciones que te interesan:</p>
            <div className="flex flex-wrap gap-3">
              {supportOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleSupport(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    form.preferredSupport.includes(opt.value)
                      ? "bg-deep-forest text-white"
                      : "bg-mint-cream text-charcoal hover:bg-sage/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Consent */}
          <div className="bg-earth-clay/10 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="consent" required checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="w-5 h-5 accent-deep-forest mt-0.5" />
              <label htmlFor="consent" className="text-charcoal/80 text-sm">
                Entiendo que esta evaluación no constituye diagnóstico médico ni reemplaza la consulta con un profesional de salud.
                Doy mi consentimiento para que Fitociencia Care™ utilice esta información para orientarme sobre bienestar. *
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitMutation.isPending || !form.consent}
            className="w-full flex items-center justify-center gap-2 py-4 bg-deep-forest text-white rounded-full font-medium hover:bg-deep-forest/90 transition-all disabled:opacity-50"
          >
            {submitMutation.isPending ? "Enviando..." : <><Send className="w-5 h-5" /> Enviar evaluación</>}
          </button>

          <div className="flex items-start gap-2 text-charcoal/50 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Esta evaluación tiene fines educativos y de orientación al bienestar. No sustituye diagnóstico,
              tratamiento o seguimiento médico profesional.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
