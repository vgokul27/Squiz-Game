import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

function AppContent() {
  const location = useLocation();

  // Routes where Navbar and Footer should NOT be shown
  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
    "/reset-password",
  ];

  // Routes where Navbar and Footer should be hidden (quiz in progress & results)
  const quizInProgressRoutes = [
    "/room/:code/lobby",
    "/room/:code/play",
    "/results/",
  ];

  const isAuthPage = authRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Only hide navbar for actual quiz gameplay routes, not creation routes
  const isQuizInProgress =
    (location.pathname.includes("/room/") &&
      (location.pathname.includes("/lobby") ||
        location.pathname.includes("/play"))) ||
    location.pathname.startsWith("/results/");

  const shouldHideNavFooter = isAuthPage || isQuizInProgress;

  return (
    <div className="min-h-screen bg-dark-50 text-white">
      {!shouldHideNavFooter && <Navbar />}
      <main>
        <AppRoutes />
      </main>
      {!shouldHideNavFooter && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#27272a",
            color: "#fff",
            border: "1px solid #a855f7",
          },
          success: {
            iconTheme: {
              primary: "#a855f7",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
