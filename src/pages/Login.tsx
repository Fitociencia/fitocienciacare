import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, CheckCircle2, Leaf, Lock, Mail, UserRound } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;

  if (!kimiAuthUrl || !appID) {
    return null;
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

type Mode = "login" | "signup";

const inputClass =
  "w-full rounded-xl border border-sage/30 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-deep-forest focus:ring-2 focus:ring-deep-forest/15";

export default function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const oauthUrl = getOAuthUrl();
  const [mode, setMode] = useState<Mode>("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    whatsapp: "",
    country: "",
    city: "",
    mainConcern: "",
    consent: false,
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/mi-cuenta");
    },
  });

  const signupMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/mi-cuenta");
    },
  });

  const errorMessage = loginMutation.error?.message || signupMutation.error?.message;
  const isPending = loginMutation.isPending || signupMutation.isPending;

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();
    if (!signupForm.consent) return;
    signupMutation.mutate({
      ...signupForm,
      whatsapp: signupForm.whatsapp || undefined,
      country: signupForm.country || undefined,
      city: signupForm.city || undefined,
      mainConcern: signupForm.mainConcern || undefined,
      consent: true,
    });
  };

  return (
    <div className="min-h-screen bg-parchment pt-20">
      <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden lg:flex bg-deep-forest text-mint-cream px-12 py-14 flex-col justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-mint-cream/80 hover:text-white transition-colors">
              <Leaf className="w-5 h-5" />
              Fitociencia Care
            </Link>
          </div>
          <div className="max-w-md">
            <p className="text-earth-clay text-sm uppercase tracking-[0.18em] mb-4">Cuenta privada</p>
            <h1 className="font-display text-5xl font-light leading-tight mb-6">
              Tu espacio de bienestar personalizado.
            </h1>
            <p className="text-mint-cream/70 leading-relaxed">
              Crea tu cuenta para guardar evaluaciones, ver chequeos personalizados, revisar pedidos y acceder a recursos de membresia.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-mint-cream/70">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-earth-clay shrink-0" />
              <p>Informacion protegida con acceso por sesion privada.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-earth-clay shrink-0" />
              <p>Chequeos publicados solo son visibles para el cliente asignado.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
          <div className="w-full max-w-xl">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 text-deep-forest">
                <Leaf className="w-5 h-5" />
                Fitociencia Care
              </Link>
            </div>

            <div className="mb-8">
              <p className="text-sage text-sm uppercase tracking-[0.15em] mb-3 font-medium">Acceso de clientes</p>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-charcoal">
                {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
              </h2>
              <p className="mt-3 text-charcoal/60 text-sm leading-relaxed">
                {mode === "login"
                  ? "Entra para ver tus pedidos, membresia y chequeos personalizados."
                  : "Completa estos datos para preparar tu perfil y orientar mejor tus recomendaciones."}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-full bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "login" ? "bg-deep-forest text-white" : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                Iniciar sesion
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "signup" ? "bg-deep-forest text-white" : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                Crear cuenta
              </button>
            </div>

            {errorMessage && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-charcoal">
                    <Mail className="w-4 h-4 text-sage" /> Email
                  </span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-charcoal">
                    <Lock className="w-4 h-4 text-sage" /> Password
                  </span>
                  <input
                    required
                    type="password"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                    className={inputClass}
                  />
                </label>
                <Button type="submit" disabled={isPending} size="lg" className="w-full rounded-full">
                  {isPending ? "Entrando..." : "Entrar a mi cuenta"}
                  {!isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block sm:col-span-2">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-charcoal">
                      <UserRound className="w-4 h-4 text-sage" /> Nombre completo
                    </span>
                    <input
                      required
                      type="text"
                      autoComplete="name"
                      value={signupForm.name}
                      onChange={(event) => setSignupForm((prev) => ({ ...prev, name: event.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-charcoal">Email</span>
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={signupForm.email}
                      onChange={(event) => setSignupForm((prev) => ({ ...prev, email: event.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-charcoal">Password</span>
                    <input
                      required
                      minLength={8}
                      type="password"
                      autoComplete="new-password"
                      value={signupForm.password}
                      onChange={(event) => setSignupForm((prev) => ({ ...prev, password: event.target.value }))}
                      className={inputClass}
                    />
                    <span className="mt-1 block text-xs text-charcoal/45">Minimo 8 caracteres, con letras y numeros.</span>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-charcoal">WhatsApp</span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="+502..."
                      value={signupForm.whatsapp}
                      onChange={(event) => setSignupForm((prev) => ({ ...prev, whatsapp: event.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-charcoal">Pais</span>
                    <input
                      type="text"
                      autoComplete="country-name"
                      value={signupForm.country}
                      onChange={(event) => setSignupForm((prev) => ({ ...prev, country: event.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-charcoal">Ciudad</span>
                    <input
                      type="text"
                      autoComplete="address-level2"
                      value={signupForm.city}
                      onChange={(event) => setSignupForm((prev) => ({ ...prev, city: event.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-charcoal">Principal objetivo de bienestar</span>
                    <textarea
                      rows={3}
                      placeholder="Ej. descanso, digestion, estres, tension muscular, energia..."
                      value={signupForm.mainConcern}
                      onChange={(event) => setSignupForm((prev) => ({ ...prev, mainConcern: event.target.value }))}
                      className={`${inputClass} resize-none`}
                    />
                  </label>
                </div>

                <label className="flex items-start gap-3 rounded-xl bg-earth-clay/10 p-4 text-sm text-charcoal/75">
                  <input
                    required
                    type="checkbox"
                    checked={signupForm.consent}
                    onChange={(event) => setSignupForm((prev) => ({ ...prev, consent: event.target.checked }))}
                    className="mt-1 h-4 w-4 accent-deep-forest"
                  />
                  <span>
                    Entiendo que Fitociencia Care usa esta informacion para orientar bienestar educativo y que no sustituye diagnostico, tratamiento ni seguimiento medico profesional.
                  </span>
                </label>

                <Button type="submit" disabled={isPending || !signupForm.consent} size="lg" className="w-full rounded-full">
                  {isPending ? "Creando cuenta..." : "Crear mi cuenta"}
                  {!isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>
            )}

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-charcoal/10" />
              <span className="text-xs uppercase tracking-[0.16em] text-charcoal/40">o</span>
              <div className="h-px flex-1 bg-charcoal/10" />
            </div>

            <button
              type="button"
              disabled={!oauthUrl}
              onClick={() => {
                if (oauthUrl) window.location.href = oauthUrl;
              }}
              className="w-full rounded-full border border-sage/30 bg-white px-5 py-3 text-sm font-medium text-charcoal transition hover:border-deep-forest disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuar con Kimi
            </button>
            {!oauthUrl && (
              <p className="mt-3 text-center text-xs text-charcoal/45">
                Kimi OAuth se activara cuando configures las variables de entorno.
              </p>
            )}

            <Link to="/" className="mt-6 block text-center text-sm text-sage hover:text-deep-forest transition-colors">
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
