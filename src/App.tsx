import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Disorders from "./pages/Disorders";
import Contact from "./pages/Contact";
import Forms from "./pages/Forms";
import PatientPortal from "./pages/PatientPortal";
import Screening from "./pages/Screening";
import AdhdEducation from "./pages/AdhdEducation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/disorders" element={<Disorders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/patient-portal" element={<PatientPortal />} />
          <Route path="/screening" element={<Screening />} />
          <Route path="/slideshows" element={<AdhdEducation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
