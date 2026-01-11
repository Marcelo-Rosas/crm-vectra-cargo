import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CRMProvider } from '@/context/CRMContext'
import { QueryProvider } from '@/components/QueryProvider'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const App = () => (
  <QueryProvider>
    <BrowserRouter
      future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
    >
      <CRMProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </CRMProvider>
    </BrowserRouter>
  </QueryProvider>
)

export default App
