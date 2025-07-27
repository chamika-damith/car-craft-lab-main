import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Play, Star } from "lucide-react";
import heroImage from "@/assets/hero-car.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
          onError={(e) => {
            // Fallback to background image if video fails to load
            const videoElement = e.target as HTMLVideoElement;
            videoElement.style.display = 'none';
          }}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          <source src="/videos/hero-bg.webm" type="video/webm" />
          {/* Fallback background image */}
        </video>
        {/* Fallback background image */}
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-orange-900/40" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center animate-fade-in">
        <div className="max-w-6xl mx-auto">
          {/* Professional Badge */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 px-4 py-2 rounded-full">
              <Star className="h-4 w-4 text-orange-400 fill-current" />
              <span className="text-orange-300 text-sm font-medium">Premium Service Provider</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight font-space tracking-tight">
            <span className="block text-zinc-100">Craft Your</span>
            <span 
              className="block bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradient 3s ease infinite'
              }}
            >
              Dream Machine
            </span>
            <span className="block text-zinc-100 text-4xl md:text-5xl lg:text-6xl mt-4">
              With Precision
            </span>
          </h1>
        
          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-zinc-300 font-inter">
            Experience the pinnacle of automotive customization with our 
            <span className="text-orange-400 font-semibold"> premium performance modifications</span> and 
            <span className="text-orange-400 font-semibold"> aesthetic upgrades</span>.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-1">6+</div>
              <div className="text-sm text-zinc-400">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-1">500+</div>
              <div className="text-sm text-zinc-400">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-1">98%</div>
              <div className="text-sm text-zinc-400">Client Satisfaction</div>
            </div>
          </div>
        
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white px-12 py-6 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Start Customizing
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="group border-orange-500/30 text-orange-300 hover:bg-orange-500/10 hover:border-orange-400 px-12 py-6 text-lg font-semibold rounded-2xl transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Watch Our Work
              </span>
            </Button>
          </div>

          {/* Location Badge */}
          <div className="flex items-center justify-center gap-2 text-zinc-400">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="text-sm font-medium">Serving Colombo & Negombo</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;