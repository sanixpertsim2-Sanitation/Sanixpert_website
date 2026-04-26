/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const CLIENTS = [
  { name: 'Ferrero Rocher', logo: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&h=100&fit=crop&q=80' },
  { name: 'Maple Leaf Foods', logo: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200&h=100&fit=crop&q=80' },
  { name: 'Bimbo Bakery', logo: 'https://images.unsplash.com/photo-1614850523544-633075d9e54a?w=200&h=100&fit=crop&q=80' },
  { name: 'Give & Go', logo: 'https://images.unsplash.com/photo-1614850523011-8f49ff246608?w=200&h=100&fit=crop&q=80' },
  { name: 'ATB Farms', logo: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&h=100&fit=crop&q=80' },
  { name: 'Erimeats', logo: 'https://images.unsplash.com/photo-1614850523011-8f49ff246608?w=200&h=100&fit=crop&q=80' },
];

export const SERVICES = [
  {
    title: 'Precision Micro-Cleaning',
    description: 'Advanced protocols targeting L. monocytogenes and Salmonella in high-risk food manufacturing environments.',
    icon: 'ShieldCheck',
    features: ['ATP Surface Testing', 'Biofilm Removal', 'Daily Sanitation Logs']
  },
  {
    title: 'Equipment Deconstruction',
    description: 'Specialized deep-clean cycles for multi-head weighers, complex slicers, and spiral freezers.',
    icon: 'Settings',
    features: ['Mechanical Audit', 'Sensitive Part Protection', 'Zero-Damage Guarantee']
  },
  {
    title: 'Chemical Engineering',
    description: 'Custom formula development and management of Health Canada certified food-grade agents.',
    icon: 'Droplets',
    features: ['Optimized Dilution', 'Safe Chemical Storage', 'Material Safety Data']
  },
  {
    title: 'GFSI Audit Support',
    description: 'Leading digital documentation systems for SQF, BRC, and CFIA compliance verification.',
    icon: 'FileText',
    features: ['Digital Reporting', 'Staff Training', 'Continuous Improvement']
  },
];

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'San-X V-900 Scrubber',
    category: 'Equipment',
    price: 14250.00,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
    description: 'Autonomous industrial steam cleaner with ultrasonic disinfection modules.',
    specs: ['99.9% Pathogen Kill Rate', 'HEPA Filtration', 'IP69K Rated']
  },
  {
    id: 'p2',
    name: 'Ultra-Pure Degreaser',
    category: 'Chemicals',
    price: 385.00,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
    description: 'Heavy-duty protein and soil remover for poultry and meat processing.',
    specs: ['Biodegradable', 'No-Rinse Formula', 'Concentrated']
  },
  {
    id: 'p3',
    name: 'Tech-Guard PPE Suite',
    category: 'PPE',
    price: 155.00,
    image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=800&h=600&fit=crop',
    description: 'High-visibility industrial sanitation ensemble with chemical resistance.',
    specs: ['Breathable Fabric', 'Reinforced Welds', 'Size: S-XXXL']
  },
];

export const PROCESS_STEPS = [
  { step: '01', title: 'Facility Audit', desc: 'Detailed microbiological and workflow baseline analysis.' },
  { step: '02', title: 'Custom Protocol', desc: 'Engineering site-specific cleaning regimes and frequency.' },
  { step: '03', title: 'Expert Execution', desc: '24/7 sanitation teams managed by precision KPIs.' },
  { step: '04', title: 'Verification', desc: 'ATP testing and digital reporting for audit readiness.' },
];

export const TESTIMONIALS = [
  {
    quote: "SaniXperts transformed our sanitation flow... absolute precision. Their team is an extension of our quality department.",
    author: "Plant Manager",
    company: "Ferrero Rocher Brantford"
  },
  {
    quote: "The switch to their custom chemical formulas reduced our water consumption by 30% while maintaining superior cleanliness.",
    author: "Operations Director",
    company: "Maple Leaf Foods"
  }
];
