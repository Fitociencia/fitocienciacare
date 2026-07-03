import { useEffect } from "react";
import { AlertTriangle, Shield, BookOpen, FlaskConical, CreditCard, FileText } from "lucide-react";

export default function Legal() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-20 min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <p className="text-sage text-sm uppercase tracking-[0.15em] mb-4 font-medium">Legal</p>
        <h1 className="font-display text-3xl lg:text-4xl font-light text-charcoal mb-12">
          Avisos Legales
        </h1>

        <div className="space-y-12">
          <section className="bg-white rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-earth-clay" />
              <h2 className="font-display text-xl font-medium text-charcoal">Aviso de Salud</h2>
            </div>
            <p className="text-charcoal/70 leading-relaxed">
              Los productos, protocolos y contenidos de Fitociencia Care™ tienen fines educativos y de apoyo al bienestar.
              No sustituyen diagnóstico, tratamiento o seguimiento médico profesional. Consulte a un profesional de salud
              antes de utilizar productos herbales, especialmente si está embarazada, en lactancia, toma medicamentos,
              tiene una condición médica o presenta alergias conocidas.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-deep-forest" />
              <h2 className="font-display text-xl font-medium text-charcoal">Política de Privacidad</h2>
            </div>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              Fitociencia Care™ se compromete a proteger la información personal de nuestros usuarios.
              Los datos recopilados se utilizan únicamente para fines de contacto, procesamiento de órdenes
              y mejora de nuestros servicios. No compartimos información con terceros sin consentimiento explícito.
            </p>
            <p className="text-charcoal/70 leading-relaxed">
              Al utilizar nuestros servicios, usted acepta nuestra política de recolección y uso de datos
              según lo descrito en este aviso.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-sage" />
              <h2 className="font-display text-xl font-medium text-charcoal">Términos y Condiciones</h2>
            </div>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              Al utilizar la plataforma de Fitociencia Care™, usted acepta los siguientes términos:
              Los productos son para uso personal y no para reventa. Las descripciones de productos son
              informativas y no constituyen claims médicos.
            </p>
            <p className="text-charcoal/70 leading-relaxed">
              Nos reservamos el derecho de modificar precios, productos y servicios sin previo aviso.
              Las órdenes están sujetas a disponibilidad y confirmación.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <FlaskConical className="w-6 h-6 text-earth-clay" />
              <h2 className="font-display text-xl font-medium text-charcoal">Aviso sobre Productos</h2>
            </div>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              Nuestros productos son formulados con ingredientes naturales. Los resultados pueden variar
              según el individuo. No garantizamos resultados específicos. Los productos no están destinados
              a diagnosticar, tratar, curar o prevenir ninguna enfermedad.
            </p>
            <p className="text-charcoal/70 leading-relaxed">
              <strong>Contraindicaciones:</strong> Consulte las contraindicaciones específicas de cada producto.
              En caso de reacción adversa, suspenda el uso y consulte a un profesional de salud.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-deep-forest" />
              <h2 className="font-display text-xl font-medium text-charcoal">Aviso sobre Cursos y Educación</h2>
            </div>
            <p className="text-charcoal/70 leading-relaxed">
              Nuestros cursos y contenido educativo tienen fines informativos y formativos.
              No constituyen capacitación médica ni reemplazan la formación profesional en salud.
              El contenido se proporciona "tal cual" sin garantías de ningún tipo.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-sage" />
              <h2 className="font-display text-xl font-medium text-charcoal">Términos de Membresía</h2>
            </div>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              La membresía educativa se renueva mensualmente. Puedes cancelar en cualquier momento
              antes de la fecha de renovación. El acceso a los cursos permanece activo mientras la
              membresía esté vigente.
            </p>
            <p className="text-charcoal/70 leading-relaxed">
              No se realizan reembolsos por períodos parciales de membresía. En caso de problemas
              técnicos, contacta a nuestro equipo de soporte.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-charcoal/40 text-sm">
            Fitociencia Care™ - Guatemala, Centroamérica © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
