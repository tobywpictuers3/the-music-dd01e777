import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Wellness from "./pages/Wellness";
import Travel from "./pages/Travel";
import Creativity from "./pages/Creativity";
import Growth from "./pages/Growth";
import About from "./pages/About";
import Authors from "./pages/Authors";
import Contact from "./pages/Contact";
import Students from "./pages/Students";
import StyleGuide from "./pages/StyleGuide";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Orchestras from "./pages/Orchestras";
import Performances from "./pages/Performances";
import StudentsDemo from "./pages/StudentsDemo";
import Blog from "./pages/blog";
import Sheets from "./pages/sheets";
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
          <Route path="/article/:id" element={<Article />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/creativity" element={<Creativity />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/about" element={<About />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/students" element={<Students />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/students-demo" element={<StudentsDemo />} />
          <Route path="/orchestras" element={<Orchestras />} />
          <Route path="/performances" element={<Performances />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/sheets" element={<Sheets />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
