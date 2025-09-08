import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/ScrollToTop";
import DashboardPage from "@/pages/dashboard";
import AnalyzerPage from "@/pages/analyzer";
import HistoryPage from "@/pages/history";
import ReportPage from "@/pages/report";
import MonitoringPage from "@/pages/monitoring";
import DocumentationPage from "@/pages/documentation";
import SettingsPage from "@/pages/settings";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import CookiesPage from "@/pages/cookies";
import DisclaimerPage from "@/pages/disclaimer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScrollToTop smooth={true} delay={100} />
      <Navigation />
      <main className="pt-16 flex-1">
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/analyzer" component={AnalyzerPage} />
          <Route path="/history" component={HistoryPage} />
          <Route path="/report" component={ReportPage} />
          <Route path="/monitoring" component={MonitoringPage} />
          <Route path="/documentation" component={DocumentationPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/cookies" component={CookiesPage} />
          <Route path="/disclaimer" component={DisclaimerPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="phisheye-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
