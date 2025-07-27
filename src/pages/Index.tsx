import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Customizer from "@/components/Customizer";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to section when navigating from other pages
    if (location.state?.scrollTo) {
      const section = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Small delay to ensure page is rendered
    }
  }, [location.state]);

  return (
    <div className="min-h-screen scroll-snap bg-black text-zinc-100">
      <Header />
      <main>
      <Hero />
      <Services />
      <Customizer />
      <GallerySection />
      <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
