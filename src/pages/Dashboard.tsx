import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useMyBuilds } from "@/hooks/useBuilds";
import { useServices } from "@/hooks/useServices";
import { buildsApi } from "@/lib/buildsApi";
import { servicesApi } from "@/lib/servicesApi";
import { useState } from "react";
import { Loader2, Edit, Trash2, Eye } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { data: buildsData, isLoading: buildsLoading, error: buildsError } = useMyBuilds();
  const { data: servicesData, isLoading: servicesLoading } = useServices({ limit: 6 });
  const [selectedBuild, setSelectedBuild] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const handleViewDetails = (build: any) => {
    setSelectedBuild(build);
    setOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  // Debug logging
  console.log('Dashboard - Builds Data:', buildsData);
  console.log('Dashboard - Builds Loading:', buildsLoading);
  console.log('Dashboard - Builds Error:', buildsError);

  if (buildsLoading || servicesLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-orange-400 animate-spin mx-auto mb-4" />
            <p className="text-white">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="py-16 min-h-screen bg-black text-white mt-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 font-space tracking-tight">My Dashboard</h2>
            <p className="text-lg text-white">
              Welcome back, {user?.firstName} {user?.lastName}!
            </p>
          </div>

          {/* My Builds Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">My Saved Builds</h3>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500"
                onClick={() => window.location.href = '/#customize'}
              >
                Create New Build
              </Button>
            </div>

            {buildsError ? (
              <div className="text-center text-red-400 text-xl">
                <p>Error loading builds: {buildsError.message}</p>
                <p className="text-sm mt-2">Please try refreshing the page</p>
              </div>
            ) : !buildsData?.builds || buildsData.builds.length === 0 ? (
              <div className="text-center text-muted-foreground text-xl">
                <p>No builds saved yet.</p>
                <p className="text-sm mt-2 mb-4">Start customizing your car to see your builds here!</p>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500"
                  onClick={() => window.location.href = '/#customize'}
                >
                  Start Customizing
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {buildsData.builds.map((build) => (
                  <Card key={build._id} className="bg-gradient-to-br from-orange-900/60 via-red-900/60 to-black/70 backdrop-blur-xl text-zinc-100 shadow-xl hover:shadow-orange-500/20 transition-all duration-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-space text-zinc-100">{build.name}</CardTitle>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="text-zinc-300 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-zinc-300 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                          {build.carMake} {build.carModel}
                        </Badge>
                        <Badge variant="outline" className="border-orange-500/30 text-orange-300">
                          {buildsApi.getStatusDisplay(build.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video rounded-md overflow-hidden border border-orange-500/20 mb-4 bg-gradient-to-br from-automotive-darker to-automotive-dark flex items-center justify-center">
                        {build.images && build.images.length > 0 ? (
                          <img src={build.images[0]} alt="Car preview" className="w-full h-full object-contain" />
                        ) : (
                          <div className="text-center text-automotive-white">
                            <div className="text-4xl mb-2">🚗</div>
                            <div className="text-sm">No preview image</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Total Cost:</span>
                          <span className="text-orange-400 font-bold">
                            {buildsApi.formatTotalPrice(build.totalPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Duration:</span>
                          <span className="text-zinc-300">
                            {servicesApi.formatDuration(build.estimatedDuration)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Services:</span>
                          <span className="text-zinc-300">
                            {build.selectedServices?.length || 0} selected
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
                          onClick={() => handleViewDetails(build)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Available Services Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-white">Available Services</h3>
            {servicesData?.data.services && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesData.data.services.map((service) => (
                  <Card key={service._id} className="bg-gradient-to-br from-orange-900/60 via-red-900/60 to-black/70 backdrop-blur-xl text-zinc-100 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-space text-zinc-100">{service.name}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                          {service.category}
                        </Badge>
                        <Badge variant="outline" className="border-orange-500/30 text-orange-300">
                          {servicesApi.formatPrice(service.price)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-300 mb-4 line-clamp-3">
                        {service.description}
                      </p>
                      <div className="text-sm text-zinc-400 mb-2">
                        Duration: {servicesApi.formatDuration(service.duration)}
                      </div>
                      <Button variant="outline" className="w-full border-orange-500/30 text-orange-300 hover:bg-orange-500/10">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Build Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl text-white bg-gray-950">
          {selectedBuild && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedBuild.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Car Image */}
                <div className="aspect-video rounded-xl overflow-hidden border border-orange-500/20 bg-gradient-to-br from-automotive-darker to-automotive-dark flex items-center justify-center">
                  {selectedBuild.images && selectedBuild.images.length > 0 ? (
                    <img src={selectedBuild.images[0]} alt="Car preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center text-automotive-white">
                      <div className="text-6xl mb-2">🚗</div>
                      <div className="text-sm">No preview image</div>
                    </div>
                  )}
                </div>

                {/* Build Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-orange-400 mb-2">Car Information</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="text-zinc-400">Make:</span> {selectedBuild.carMake}</div>
                      <div><span className="text-zinc-400">Model:</span> {selectedBuild.carModel}</div>
                      <div><span className="text-zinc-400">Year:</span> {selectedBuild.carYear}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-orange-400 mb-2">Build Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="text-zinc-400">Status:</span> {buildsApi.getStatusDisplay(selectedBuild.status)}</div>
                      <div><span className="text-zinc-400">Total Price:</span> {buildsApi.formatTotalPrice(selectedBuild.totalPrice)}</div>
                      <div><span className="text-zinc-400">Duration:</span> {servicesApi.formatDuration(selectedBuild.estimatedDuration)}</div>
                      <div><span className="text-zinc-400">Services:</span> {selectedBuild.selectedServices?.length || 0} selected</div>
                    </div>
                  </div>

                  {selectedBuild.description && (
                    <div>
                      <h4 className="font-bold text-orange-400 mb-2">Description</h4>
                      <p className="text-sm text-zinc-300">{selectedBuild.description}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-orange-400 mb-2">Selected Services</h4>
                    <div className="space-y-2">
                      {selectedBuild.selectedServices?.map((service: any, index: number) => (
                        <div key={index} className="text-sm bg-zinc-800/50 p-2 rounded">
                          <div className="font-medium text-zinc-200">Service #{index + 1}</div>
                          <div className="text-zinc-400">Quantity: {service.quantity}</div>
                          {service.customNotes && (
                            <div className="text-zinc-400">Notes: {service.customNotes}</div>
                          )}
                        </div>
                      )) || <div className="text-sm text-zinc-400">No services selected</div>}
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500">
                    Created: {new Date(selectedBuild.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
