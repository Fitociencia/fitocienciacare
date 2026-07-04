import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import { CartProvider } from "@/contexts/CartContext"
import App from './App.tsx'

const basename = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <TRPCProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>,
)
