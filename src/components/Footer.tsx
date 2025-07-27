import { Car, Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-automotive-darker text-automotive-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Apex Auto Mods</span>
            </div>
            <p className="text-automotive-gray leading-relaxed">
              Premium car modifications and performance upgrades. Transform your ride with our expert services.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-automotive-gray hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-automotive-gray hover:text-primary cursor-pointer transition-colors" />
              <Youtube className="h-6 w-6 text-automotive-gray hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-automotive-gray hover:text-primary transition-colors">Paint & Wraps</Link>
              <Link to="/" className="block text-automotive-gray hover:text-primary transition-colors">Performance Tuning</Link>
              <Link to="/" className="block text-automotive-gray hover:text-primary transition-colors">Body Kits</Link>
              <Link to="/" className="block text-automotive-gray hover:text-primary transition-colors">Wheels & Tires</Link>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-automotive-gray">123 Galle Road, Colombo 03</p>
                  <p className="text-automotive-gray">+94 11 234 5678</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-automotive-gray">456 Main Street, Negombo</p>
                  <p className="text-automotive-gray">+94 31 987 6543</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-automotive-gray">info@apexautomods.lk</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-automotive-gray">+94 77 123 4567</span>
              </div>
            </div>
          </div>
          
          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-automotive-gray">Mon-Sat: 8AM-6PM</span>
              </div>
              <p className="text-automotive-gray">Sundays: Closed</p>
              <p className="text-automotive-gray">Emergency services available</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-automotive-gray/20 mt-12 pt-8 text-center">
          <p className="text-automotive-gray">
            © 2024 Apex Auto Mods Garage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;