import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";


function RouterComponent() {
  return (
    <Router base="/">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

import { useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Check if the loader has been shown in this session
    const hasSeenLoader = sessionStorage.getItem("hasSeenLoader");
    if (!hasSeenLoader) {
      setShowLoader(true);
      sessionStorage.setItem("hasSeenLoader", "true");
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          {showLoader && <LoadingScreen />}
          <Toaster />
          <RouterComponent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
