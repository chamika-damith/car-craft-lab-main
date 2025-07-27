import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service.js';

dotenv.config();

const sampleServices = [
  // Exterior Services
  {
    name: 'Custom Paint Job',
    description: 'Professional custom paint job with premium automotive paint. Choose from our extensive color palette or bring your own color.',
    category: 'exterior',
    price: 2500,
    duration: 48,
    features: [
      'Premium automotive paint',
      'Color sanding and buffing',
      'Clear coat protection',
      '5-year warranty'
    ],
    requirements: [
      'Vehicle must be clean and free of major damage',
      'Paint booth required',
      'Weather conditions must be suitable'
    ]
  },
  {
    name: 'Body Kit Installation',
    description: 'Installation of custom body kits including front lip, side skirts, and rear diffuser.',
    category: 'exterior',
    price: 800,
    duration: 12,
    features: [
      'Professional installation',
      'Paint matching included',
      'Fitment guarantee',
      '1-year warranty'
    ],
    requirements: [
      'Compatible body kit must be provided',
      'Vehicle must be in good condition'
    ]
  },
  {
    name: 'Window Tinting',
    description: 'Professional window tinting with premium films for UV protection and privacy.',
    category: 'exterior',
    price: 300,
    duration: 4,
    features: [
      'Premium tint film',
      'UV protection',
      'Heat rejection',
      'Lifetime warranty'
    ],
    requirements: [
      'Windows must be clean',
      'Legal tint limits apply'
    ]
  },

  // Interior Services
  {
    name: 'Custom Upholstery',
    description: 'Custom seat upholstery with premium materials including leather, suede, and custom stitching.',
    category: 'interior',
    price: 1200,
    duration: 24,
    features: [
      'Premium materials',
      'Custom stitching patterns',
      'Heated seat compatibility',
      '3-year warranty'
    ],
    requirements: [
      'Seats must be in good structural condition',
      'Material selection required'
    ]
  },
  {
    name: 'Dashboard Wrap',
    description: 'Custom dashboard wrapping with premium vinyl materials for a modern look.',
    category: 'interior',
    price: 400,
    duration: 8,
    features: [
      'Premium vinyl materials',
      'Custom color options',
      'Professional installation',
      '2-year warranty'
    ],
    requirements: [
      'Dashboard must be clean',
      'No major damage to surface'
    ]
  },
  {
    name: 'LED Interior Lighting',
    description: 'Custom LED interior lighting installation with color-changing options and app control.',
    category: 'interior',
    price: 250,
    duration: 6,
    features: [
      'RGB LED strips',
      'Smartphone app control',
      'Multiple lighting zones',
      '1-year warranty'
    ],
    requirements: [
      '12V power source available',
      'Proper installation space'
    ]
  },

  // Performance Services
  {
    name: 'ECU Tuning',
    description: 'Professional ECU remapping to optimize engine performance and fuel efficiency.',
    category: 'performance',
    price: 600,
    duration: 3,
    features: [
      'Custom dyno tuning',
      'Performance optimization',
      'Fuel efficiency improvement',
      'Backup of original settings'
    ],
    requirements: [
      'Vehicle must be in good mechanical condition',
      'No engine modifications that could cause damage'
    ]
  },
  {
    name: 'Exhaust System Upgrade',
    description: 'High-performance exhaust system installation for improved sound and performance.',
    category: 'performance',
    price: 900,
    duration: 6,
    features: [
      'Stainless steel construction',
      'Performance headers',
      'Custom muffler',
      'Lifetime warranty'
    ],
    requirements: [
      'Compatible exhaust system',
      'Proper clearance for installation'
    ]
  },
  {
    name: 'Cold Air Intake',
    description: 'Performance cold air intake system for improved airflow and engine efficiency.',
    category: 'performance',
    price: 350,
    duration: 2,
    features: [
      'High-flow air filter',
      'Heat shield included',
      'Easy maintenance',
      '2-year warranty'
    ],
    requirements: [
      'Compatible intake system',
      'Proper engine bay space'
    ]
  },

  // Audio Services
  {
    name: 'Premium Sound System',
    description: 'Complete premium sound system installation with subwoofers, amplifiers, and custom enclosures.',
    category: 'audio',
    price: 1800,
    duration: 16,
    features: [
      'Premium speakers',
      'Subwoofer enclosure',
      'Amplifier installation',
      'Sound deadening',
      '3-year warranty'
    ],
    requirements: [
      'Vehicle must have adequate space',
      'Electrical system must support additional load'
    ]
  },
  {
    name: 'Head Unit Upgrade',
    description: 'Modern head unit installation with Apple CarPlay, Android Auto, and premium audio features.',
    category: 'audio',
    price: 500,
    duration: 4,
    features: [
      'Apple CarPlay/Android Auto',
      'Bluetooth connectivity',
      'Backup camera support',
      '1-year warranty'
    ],
    requirements: [
      'Compatible head unit',
      'Proper wiring harness'
    ]
  },

  // Lighting Services
  {
    name: 'LED Headlight Conversion',
    description: 'Professional LED headlight conversion for improved visibility and modern appearance.',
    category: 'lighting',
    price: 450,
    duration: 4,
    features: [
      'High-quality LED bulbs',
      'Proper beam pattern',
      'Heat management',
      '2-year warranty'
    ],
    requirements: [
      'Compatible headlight housing',
      'Proper electrical system'
    ]
  },
  {
    name: 'Underbody LED Kit',
    description: 'Custom underbody LED lighting installation with multiple color options and remote control.',
    category: 'lighting',
    price: 300,
    duration: 6,
    features: [
      'RGB LED strips',
      'Remote control',
      'Waterproof design',
      '1-year warranty'
    ],
    requirements: [
      'Clean underbody surface',
      '12V power source'
    ]
  },

  // Wheels Services
  {
    name: 'Custom Wheel Installation',
    description: 'Professional custom wheel and tire installation with balancing and alignment.',
    category: 'wheels',
    price: 1200,
    duration: 8,
    features: [
      'Wheel mounting and balancing',
      'Tire installation',
      'Alignment check',
      'Lug nut torque check'
    ],
    requirements: [
      'Compatible wheel and tire sizes',
      'Proper offset and clearance'
    ]
  },
  {
    name: 'Wheel Powder Coating',
    description: 'Professional wheel powder coating in custom colors with durable finish.',
    category: 'wheels',
    price: 600,
    duration: 24,
    features: [
      'Custom color options',
      'Durable powder coat finish',
      'Professional preparation',
      '3-year warranty'
    ],
    requirements: [
      'Wheels must be in good condition',
      'No major damage or cracks'
    ]
  }
];

const seedServices = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert sample services
    const services = await Service.insertMany(sampleServices);
    console.log(`✅ Successfully seeded ${services.length} services`);

    // Display categories
    const categories = [...new Set(services.map(service => service.category))];
    console.log('\n📋 Available categories:');
    categories.forEach(category => {
      const count = services.filter(service => service.category === category).length;
      console.log(`  - ${category}: ${count} services`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedServices(); 