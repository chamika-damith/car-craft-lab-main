import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useServices } from "@/hooks/useServices";
import { useCreateBuild } from "@/hooks/useBuilds";
import { useAuth } from "@/hooks/useAuth";
import { servicesApi } from "@/lib/servicesApi";
import { Loader2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import car images
import bmwRedImg from "@/assets/bmw-m3-red.png";
import bmwBlueImg from "@/assets/bmw-m3-blue.png";
import bmwYellowImg from "@/assets/bmw-m3-yellow.png";
import heroCar from "@/assets/hero-car.jpg";

// Import modification images
import frontSplitterRed from "@/assets/bmw-m3-red-Front-Splitter.png";
import sideSkirtRed from "@/assets/bmw-m3-red-Side-Skirts.png";
import rearSpoilerRed from "@/assets/bmw-m3-red-Rear-Spoiler.png";
import frontSplitterYellow from "@/assets/bmw-m3-yellow-Front-Splitter.png";
import sideSkirtYellow from "@/assets/bmw-m3-yellow-Side-Skirts.png";
import rearSpoilerYellow from "@/assets/bmw-m3-yellow-\nRear-Spoiler.png"; // TODO: Consider renaming this file to remove the line break for maintainability
import rearDiffuserYellow from "@/assets/bmw-m3-yellow-Rear-Diffuser.png";

const carImages: Record<string, Record<string, string>> = {
  "BMW M3 Competition": {
    Red: bmwRedImg,
    Blue: bmwBlueImg,
    Yellow: bmwYellowImg,
  },
  // Add more models/colors as needed
};

const Customizer = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [buildDescription, setBuildDescription] = useState("");
  
  // Fetch services from API
  const { data: servicesData, isLoading: servicesLoading } = useServices();
  const createBuildMutation = useCreateBuild();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const carModels = [
    { name: "BMW M3 Competition", year: "2024" },
    { name: "Audi RS5 Coupe", year: "2024" },
    { name: "Mercedes AMG GT 63 S", year: "2024" },
    { name: "Porsche 911 Turbo S", year: "2024" }
  ];
  
  const colors = [
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Yellow", value: "#eab308" },
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" }
  ];
  
  // Use real services from API instead of hardcoded modifications
  const modifications = servicesData?.data.services || [];
  
  const totalCost = selectedMods.reduce((sum, modId) => {
    const mod = modifications.find(m => m._id === modId);
    return sum + (mod ? mod.price : 0);
  }, 0);

  const totalDuration = selectedMods.reduce((sum, modId) => {
    const mod = modifications.find(m => m._id === modId);
    return sum + (mod ? mod.duration : 0);
  }, 0);
  
  const handleModToggle = (modId: string) => {
    setSelectedMods(prev => 
      prev.includes(modId) 
        ? prev.filter(id => id !== modId)
        : [...prev, modId]
    );
  };

  // Handle image loading
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  
  useEffect(() => {
    if (!selectedModel || !selectedColor) {
      setPreviewImg(null);
      return;
    }
    setIsLoading(true);
    // Simulate loading
    const timeout = setTimeout(() => {
      const img = carImages[selectedModel]?.[selectedColor] || heroCar;
      setPreviewImg(img);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [selectedModel, selectedColor]);

  // Show modification overlays if any, otherwise show previewImg
  const getModifiedImage = useMemo(() => {
    if (!selectedModel || !selectedColor || selectedMods.length === 0) return previewImg;
    
    // Only BMW M3 Competition supports overlays in this demo
    if (selectedModel === "BMW M3 Competition") {
      // Get the selected modification names and categories from the API services
      const selectedModsData = selectedMods.map(modId => {
        const mod = modifications.find(m => m._id === modId);
        return {
          name: mod?.name || '',
          category: mod?.category || ''
        };
      });

      console.log('Selected mods data:', selectedModsData);

      // Map modification names and categories to images
      if (selectedColor === "Red") {
        // Check for body kit or exterior modifications
        if (selectedModsData.some(mod => 
          mod.name.toLowerCase().includes('body kit') || 
          mod.name.toLowerCase().includes('front splitter') ||
          mod.category.toLowerCase().includes('exterior')
        )) {
          return frontSplitterRed;
        } else if (selectedModsData.some(mod => 
          mod.name.toLowerCase().includes('side skirt') ||
          mod.category.toLowerCase().includes('exterior')
        )) {
          return sideSkirtRed;
        } else if (selectedModsData.some(mod => 
          mod.name.toLowerCase().includes('rear spoiler') ||
          mod.category.toLowerCase().includes('exterior')
        )) {
          return rearSpoilerRed;
        }
      } else if (selectedColor === "Yellow") {
        // Check for body kit or exterior modifications
        if (selectedModsData.some(mod => 
          mod.name.toLowerCase().includes('body kit') || 
          mod.name.toLowerCase().includes('front splitter') ||
          mod.category.toLowerCase().includes('exterior')
        )) {
          return frontSplitterYellow;
        } else if (selectedModsData.some(mod => 
          mod.name.toLowerCase().includes('side skirt') ||
          mod.category.toLowerCase().includes('exterior')
        )) {
          return sideSkirtYellow;
        } else if (selectedModsData.some(mod => 
          mod.name.toLowerCase().includes('rear spoiler') ||
          mod.category.toLowerCase().includes('exterior')
        )) {
          return rearSpoilerYellow;
        } else if (selectedModsData.some(mod => 
          mod.name.toLowerCase().includes('rear diffuser') || 
          mod.name.toLowerCase().includes('exhaust') ||
          mod.category.toLowerCase().includes('performance')
        )) {
          return rearDiffuserYellow;
        }
      } else if (selectedColor === "Blue") {
        // For blue, show modified blue car for exterior modifications
        if (selectedModsData.some(mod => 
          mod.name.toLowerCase().includes('body kit') || 
          mod.name.toLowerCase().includes('front splitter') ||
          mod.category.toLowerCase().includes('exterior')
        )) {
          return bmwBlueImg; // Show blue car with body kit effect
        }
      }
    }
    
    // For other car models or colors, show the basic car image
    return previewImg;
  }, [selectedModel, selectedColor, selectedMods, previewImg, modifications]);

  const handleSaveBuild = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedModel || !selectedColor) {
      return;
    }

    // Auto-generate build name if not provided
    const name = buildName || `${selectedModel} ${selectedColor} Custom Build`;
    
    // Create build data
    const buildData = {
      name,
      description: buildDescription || `Custom ${selectedModel} build with ${selectedColor} color and ${selectedMods.length} modifications`,
      carModel: selectedModel,
      carYear: 2024, // Extract year from model or use current year
      carMake: selectedModel.split(' ')[0], // Extract make from model name
      selectedServices: selectedMods.map(modId => ({
        service: modId,
        quantity: 1,
        customNotes: `Applied to ${selectedModel} in ${selectedColor}`
      })),
      isPublic: false,
      tags: [selectedColor, selectedModel.split(' ')[0], 'custom'],
      images: getModifiedImage ? [getModifiedImage] : []
    };

    console.log('Saving build with data:', buildData);
    console.log('Selected mods:', selectedMods);
    console.log('Available modifications:', modifications);

    createBuildMutation.mutate(buildData);
  };

  if (servicesLoading) {
    return (
      <section id="customize" className="py-24 bg-black text-zinc-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-space tracking-tight">Customize Your Car</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter leading-relaxed">
              Build your dream car with our interactive customizer.
            </p>
          </div>
          
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-orange-400 animate-spin mx-auto mb-4" />
              <p className="text-zinc-300">Loading customizer...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="customize" className="py-24 bg-black text-zinc-100 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-space tracking-tight">Customize Your Car</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter leading-relaxed">
            Build your dream car with our interactive customizer.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Car Preview - Sticky on large screens */}
          <div className="lg:sticky lg:top-8 space-y-6 h-fit">
            <Card className="modern-card border-0 bg-gradient-to-br from-orange-900/60 via-red-900/60 to-black/70 backdrop-blur-xl text-zinc-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold font-space">Car Preview</CardTitle>
                {selectedMods.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedMods.map(modId => {
                      const mod = modifications.find(m => m._id === modId);
                      return mod ? (
                        <Badge key={modId} variant="secondary" className="text-xs bg-orange-500/20 text-orange-300">
                          {mod.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-automotive-darker to-automotive-dark flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="h-12 w-12 text-orange-400 animate-spin" />
                  ) : getModifiedImage ? (
                    <img src={getModifiedImage} alt="Car preview" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-automotive-white">Select a model and color to preview</span>
                  )}
                </div>
                {selectedMods.length > 0 && (
                  <div className="mt-3 text-sm text-zinc-400">
                    <p>Applied modifications: {selectedMods.length}</p>
                    <p className="text-xs">Note: Visual changes may not reflect all modifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Customization Options - Scrollable content */}
          <div className="space-y-6 overflow-visible">
            {/* Car Model Selection */}
            <Card className="modern-card border-0 bg-gradient-to-br from-orange-900/60 via-red-900/60 to-black/70 backdrop-blur-xl text-zinc-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold font-space">Select Car Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {carModels.map((model) => (
                    <Button
                      key={model.name}
                      variant={selectedModel === model.name ? "default" : "outline"}
                      className={`text-sm ${selectedModel === model.name ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-500/30 text-orange-300 hover:bg-orange-500/10'}`}
                      onClick={() => setSelectedModel(model.name)}
                    >
                      {model.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Color Selection */}
            <Card className="modern-card border-0 bg-gradient-to-br from-orange-900/60 via-red-900/60 to-black/70 backdrop-blur-xl text-zinc-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold font-space">Select Color</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {colors.map((color) => (
                    <Button
                      key={color.name}
                      variant={selectedColor === color.name ? "default" : "outline"}
                      className={`text-sm ${selectedColor === color.name ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-500/30 text-orange-300 hover:bg-orange-500/10'}`}
                      onClick={() => setSelectedColor(color.name)}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/20" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Modifications Selection */}
            <Card className="modern-card border-0 bg-gradient-to-br from-orange-900/60 via-red-900/60 to-black/70 backdrop-blur-xl text-zinc-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold font-space">Select Modifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modifications.map((mod) => (
                    <div key={mod._id} className="flex items-center justify-between p-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedMods.includes(mod._id)}
                          onCheckedChange={() => handleModToggle(mod._id)}
                          className="border-orange-500 data-[state=checked]:bg-orange-500"
                        />
                        <div>
                          <div className="font-medium text-zinc-100">{mod.name}</div>
                          <div className="text-sm text-zinc-400">{mod.description}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {mod.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {servicesApi.formatDuration(mod.duration)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-400">{servicesApi.formatPrice(mod.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Build Details */}
            <Card className="modern-card border-0 bg-gradient-to-br from-orange-900/60 via-red-900/60 to-black/70 backdrop-blur-xl text-zinc-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold font-space">Build Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Build Name</label>
                  <input
                    type="text"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    placeholder="My Custom BMW Build"
                    className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-600 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Description (Optional)</label>
                  <textarea
                    value={buildDescription}
                    onChange={(e) => setBuildDescription(e.target.value)}
                    placeholder="Describe your custom build..."
                    rows={3}
                    className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-600 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Total Cost */}
            <Card className="modern-card border-0 bg-gradient-to-br from-orange-900/60 via-red-900/60 to-black/70 backdrop-blur-xl text-zinc-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold font-space">Build Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Total Cost:</span>
                    <span className="text-2xl font-bold text-orange-400">
                      {servicesApi.formatPrice(totalCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Estimated Duration:</span>
                    <span className="text-zinc-100">
                      {servicesApi.formatDuration(totalDuration)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Modifications:</span>
                    <span className="text-zinc-100">{selectedMods.length} selected</span>
                  </div>
                </div>
                
                {!isAuthenticated ? (
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                    onClick={() => navigate('/login')}
                  >
                    Login to Save Build
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                    onClick={handleSaveBuild}
                    disabled={!selectedModel || !selectedColor || createBuildMutation.isPending}
                  >
                    {createBuildMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Build...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Build
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Customizer;