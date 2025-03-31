import { BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import ThemeToggle from "./components/ThemeToggle";
import SoundToggle from "./components/SoundToggle";

// Lazy load non-critical components
const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const Feedbacks = lazy(() => import("./components/Feedbacks"));
const Achievements = lazy(() => import("./components/Achievements"));
const Contact = lazy(() => import("./components/Contact"));
const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </div>
        <Suspense fallback={<LoadingScreen />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingScreen />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<LoadingScreen />}>
          <Tech />
        </Suspense>
        <Suspense fallback={<LoadingScreen />}>
          <Works />
        </Suspense>
        <Suspense fallback={<LoadingScreen />}>
          <Achievements />
        </Suspense>
        <Suspense fallback={<LoadingScreen />}>
          <Feedbacks />
        </Suspense>
        <div className="relative z-0">
          <Suspense fallback={<LoadingScreen />}>
            <Contact />
          </Suspense>
          <Suspense fallback={<LoadingScreen />}>
            <StarsCanvas />
          </Suspense>
        </div>
        <ThemeToggle />
        <SoundToggle />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
