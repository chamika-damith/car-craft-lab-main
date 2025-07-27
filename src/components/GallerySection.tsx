import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Share2 } from "lucide-react";

// Import car images
import bmwRedImg from "@/assets/bmw-m3-red.png";
import bmwBlueImg from "@/assets/bmw-m3-blue.png";
import bmwYellowImg from "@/assets/bmw-m3-yellow.png";
import heroCar from "@/assets/hero-car.jpg";

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    {
      id: 1,
      image: bmwRedImg,
      title: "BMW M3 Competition",
      description: "Stunning red BMW M3 with custom modifications",
      category: "Performance",
      likes: 128,
      views: 2456
    },
    {
      id: 2,
      image: bmwBlueImg,
      title: "BMW M3 Competition",
      description: "Elegant blue BMW M3 with premium upgrades",
      category: "Luxury",
      likes: 95,
      views: 1892
    },
    {
      id: 3,
      image: bmwYellowImg,
      title: "BMW M3 Competition",
      description: "Bold yellow BMW M3 with sport modifications",
      category: "Sport",
      likes: 156,
      views: 3124
    },
    {
      id: 4,
      image: heroCar,
      title: "Custom Build",
      description: "Exclusive custom car build showcase",
      category: "Custom",
      likes: 203,
      views: 4567
    }
  ];

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-24 bg-black text-zinc-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-space tracking-tight">Gallery</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter leading-relaxed">
            Explore our collection of custom car builds and modifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {galleryItems.map((item) => (
            <Card 
              key={item.id} 
              className="bg-gradient-to-br from-orange-900/60 via-red-900/60 to-black/70 backdrop-blur-xl text-zinc-100 shadow-xl hover:shadow-orange-500/20 transition-all duration-500 group cursor-pointer overflow-hidden"
              onClick={() => handleImageClick(item.image)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                        {item.category}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-zinc-300 hover:text-white">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-zinc-300 hover:text-white">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold font-space mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>❤️ {item.likes}</span>
                  <span>👁️ {item.views}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img 
                src={selectedImage} 
                alt="Gallery" 
                className="w-full h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                onClick={closeModal}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
