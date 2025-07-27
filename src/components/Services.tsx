import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Zap, Car, CircleDot, Lightbulb, Volume2, Settings, Loader2, ArrowRight } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { servicesApi } from "@/lib/servicesApi";
import { Link } from "react-router-dom";

const Services = () => {
  const { data: servicesData, isLoading, error } = useServices({ limit: 6 });

  // Icon mapping for different service categories
  const getServiceIcon = (category: string) => {
    const iconMap: Record<string, JSX.Element> = {
      exterior: <Palette className="h-8 w-8 text-primary" />,
      performance: <Zap className="h-8 w-8 text-primary" />,
      interior: <Car className="h-8 w-8 text-primary" />,
      wheels: <CircleDot className="h-8 w-8 text-primary" />,
      lighting: <Lightbulb className="h-8 w-8 text-primary" />,
      audio: <Volume2 className="h-8 w-8 text-primary" />,
      other: <Settings className="h-8 w-8 text-primary" />
    };
    return iconMap[category] || <Settings className="h-8 w-8 text-primary" />;
  };

  if (isLoading) {
    return (
      <section id="services" className="py-24 bg-black scroll-snap-section text-zinc-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-space tracking-tight">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter leading-relaxed">
              Professional car modification services with premium quality parts and expert installation.
            </p>
          </div>
          
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-orange-400 animate-spin mx-auto mb-4" />
              <p className="text-zinc-300">Loading services...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-24 bg-black scroll-snap-section text-zinc-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-space tracking-tight">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter leading-relaxed">
              Professional car modification services with premium quality parts and expert installation.
            </p>
          </div>
          
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-red-400 mb-4">Failed to load services</p>
              <p className="text-zinc-300">Please try again later</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const services = servicesData?.data.services || [];

  return (
    <section id="services" className="py-24 bg-black scroll-snap-section text-zinc-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-space tracking-tight">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter leading-relaxed">
            Professional car modification services with premium quality parts and expert installation.
          </p>
        </div>
        
        {services.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-zinc-300">No services available at the moment</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {services.map((service) => (
                <Card key={service._id} className="modern-card group border-0 bg-gradient-to-br from-orange-900/60 via-red-900/60 to-black/70 backdrop-blur-xl text-zinc-100 shadow-xl hover:shadow-orange-500/20 transition-all duration-500">
                  <CardHeader className="text-center pb-6">
                    <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-orange-500/30 to-red-500/20 rounded-2xl group-hover:from-orange-400/40 group-hover:to-red-400/30 transition-all duration-500 w-fit">
                      {getServiceIcon(service.category)}
                    </div>
                    <CardTitle className="text-2xl font-bold font-space">{service.name}</CardTitle>
                    <div className="flex justify-center">
                      <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full font-medium capitalize">
                        {service.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base mb-6 leading-relaxed font-inter text-zinc-300/80">
                      {service.description}
                    </CardDescription>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-orange-400 font-space">
                        {servicesApi.formatPrice(service.price)}
                      </div>
                      <div className="text-sm text-zinc-400">
                        Duration: {servicesApi.formatDuration(service.duration)}
                      </div>
                      {service.features && service.features.length > 0 && (
                        <div className="text-sm text-zinc-400">
                          Features: {service.features.slice(0, 2).join(', ')}
                          {service.features.length > 2 && '...'}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group">
                  View All Services
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Services;