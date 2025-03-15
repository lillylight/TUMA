
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import WalletConfigProvider, { useWallet } from "@/hooks/use-wallet";
import { useEffect } from "react";
import { contractService } from "@/lib/contract-service";
import Landing from "./pages/Landing";
import Documents from "./pages/Documents";
import Send from "./pages/Send";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Contract address on Base network
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual deployed contract address

const queryClient = new QueryClient();

// Protected route component
interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { isConnected } = useWallet();
  
  if (!isConnected) {
    return <Navigate to="/landing" replace />;
  }
  
  return <>{element}</>;
};

const AppContent = () => {
  const { isConnected, address } = useWallet();
  
  // Initialize contract service when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      contractService.initialize(CONTRACT_ADDRESS)
        .catch(error => console.error("Failed to initialize contract service:", error));
    }
  }, [isConnected, address]);
  
  // Detect initial theme preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("tuma-ui-theme");
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  return (
    <ThemeProvider defaultTheme={initialTheme as "dark" | "light" | "system"}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute element={<Send />} />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/send" element={<ProtectedRoute element={<Send />} />} />
            <Route path="/documents" element={<ProtectedRoute element={<Documents />} />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletConfigProvider>
        <AppContent />
      </WalletConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
