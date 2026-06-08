// MACY Line Checklist Data - extracted from Macy line checklist(2).xlsx

export const AREAS = [
  { id: 'macy-production', name: 'Production', icon: '🏭', color: '#ff6b9d', description: 'Batter deposit, conveyor, hopper, die' },
  { id: 'macy-decoration', name: 'Decoration', icon: '🎨', color: '#4facfe', description: 'Icing, injection, sprinkle, tray system' },
  { id: 'macy-oven', name: 'Oven', icon: '🔥', color: '#ff8c42', description: 'Oven interior, exterior, frame' },
  { id: 'macy-spiral', name: 'Spiral', icon: '🌀', color: '#00d084', description: 'Spiral belt, merging conveyors, drains' },
  { id: 'macy-palletizing', name: 'Palletizing', icon: '📦', color: '#a855f7', description: 'Metal detector, case packer, palletizer' },
];

export interface ChecklistItemData {
  id: string;
  areaId: string;
  phase: 'pre_cleaning' | 'post_cleaning';
  stepNumber: number;
  title: string;
  description: string;
  requiresPhoto: boolean;
}

export const CHECKLIST_ITEMS: ChecklistItemData[] = [
  // === MACY PRODUCTION - Pre-Cleaning ===
  {
    id: 'prod-pre-1', areaId: 'macy-production', phase: 'pre_cleaning', stepNumber: 1,
    title: 'Pre-Cleaning Inspection',
    description: 'Verify the equipment for any inadequate condition and safety issues. Check sensors and motor. Verify damage on All Equipments, frame, conveyor, Pipes, plugs and emergency button.',
    requiresPhoto: true,
  },
  {
    id: 'prod-pre-2', areaId: 'macy-production', phase: 'pre_cleaning', stepNumber: 2,
    title: 'Dismantling',
    description: 'Remove Die, Batter Pump, Transfer Pipes, Divider (if applicable), catchpans, and hopper unit.',
    requiresPhoto: true,
  },
  {
    id: 'prod-pre-3', areaId: 'macy-production', phase: 'pre_cleaning', stepNumber: 3,
    title: 'Dry Cleaning',
    description: 'Both Frame, Conveyors (Under & Top), Scrappers, and Floor.',
    requiresPhoto: true,
  },
  // === MACY PRODUCTION - Post-Cleaning ===
  {
    id: 'prod-post-4', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 1,
    title: 'Covering',
    description: 'Motors, sensors, air regulators and electric panels covered. Record: No. of equipment Covered ____ | No. of Bag Retrieved ____',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-5', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 2,
    title: 'Batter Depositor',
    description: 'Check Batter Depositor Frame is Clean.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-6', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 3,
    title: 'Batter Mixers',
    description: 'Mixers are Clean.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-7', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 4,
    title: 'Conveyor',
    description: 'Conveyors are cleaned and Air dried (top and underneath).',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-8', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 5,
    title: 'Up Tower',
    description: 'Up Tower is clean and Guards are fixed.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-9', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 6,
    title: 'Batter Pump',
    description: '(A) AND (B) PUMP are clean and fixed.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-10', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 7,
    title: 'Transfer Pipes',
    description: '(A) AND (B) SIDE PIPE are clean and fixed.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-11', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 8,
    title: 'Rubber Pipes',
    description: '(A) AND (B) PIPE are clean and fixed.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-12', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 9,
    title: 'Filters',
    description: '(A) AND (B) SIDE FILTER are clean and fixed.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-13', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 10,
    title: 'Divider',
    description: 'Both sides of divider, Installed correctly.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-14', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 11,
    title: 'Hopper',
    description: 'Inside and outside, Underneath Gasket and Die is Secure and clean.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-15', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 12,
    title: 'Stirrer',
    description: 'STIRRER is CLEAN.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-16', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 13,
    title: 'Rotary Valves and Die',
    description: 'Rotary valves are in position and die is fixed.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-17', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 14,
    title: 'Depositor Plate and Gasket',
    description: 'Plate and Holes are clean.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-18', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 15,
    title: 'Egg Cooler',
    description: 'Egg wash is done and Egg room is clean and sanitized.',
    requiresPhoto: true,
  },
  {
    id: 'prod-post-19', areaId: 'macy-production', phase: 'post_cleaning', stepNumber: 16,
    title: 'Floor',
    description: 'Floor is clean and Dry. No Sanitation Equipment is on the Floor.',
    requiresPhoto: true,
  },

  // === MACY DECORATION - Pre-Cleaning ===
  {
    id: 'dec-pre-1', areaId: 'macy-decoration', phase: 'pre_cleaning', stepNumber: 1,
    title: 'Pre-Cleaning Inspection',
    description: 'Verify the equipment for any inadequate condition and safety issues. Check sensors and motor. Verify damage on All Equipments, frame, conveyor, Pipes, plugs and emergency button.',
    requiresPhoto: true,
  },
  {
    id: 'dec-pre-2', areaId: 'macy-decoration', phase: 'pre_cleaning', stepNumber: 2,
    title: 'Dismantling',
    description: 'Remove Die, Icing Pipes, Icing Pumps, Transfer Pipes, and catchpans.',
    requiresPhoto: true,
  },
  {
    id: 'dec-pre-3', areaId: 'macy-decoration', phase: 'pre_cleaning', stepNumber: 3,
    title: 'Dry Cleaning',
    description: 'Both Frame, Conveyors (Under & Top), Scrappers, and Floor.',
    requiresPhoto: true,
  },
  // === MACY DECORATION - Post-Cleaning ===
  {
    id: 'dec-post-4', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 1,
    title: 'Covering',
    description: 'Motors, sensors, air regulators and electric panels covered. Record: No. of equipment Covered ____ | No. of Bag Retrieved ____',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-5', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 2,
    title: 'Depositor Side A and B',
    description: 'Depositor Side A and B CIP is done and Depositor is clean. Open both safety guards from top of decoration unit and inspect if there is any leakage of icing wash if needed.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-6', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 3,
    title: 'Injection Unit',
    description: 'Frame of Injection Unit is Clean.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-7', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 4,
    title: 'Hopper Toppers',
    description: 'Icing Hopper Topper and Icing Pump are Clean and assembled.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-8', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 5,
    title: 'Manifold A and B',
    description: 'Manifold A and B are clean and Blue Pipes are attached to the Depositor side A and B.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-9', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 6,
    title: 'Tray Denester',
    description: 'Tray Denester is clean and Stand is fixed.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-10', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 7,
    title: 'Sprinkle Depositor and Die',
    description: 'Sprinkle Depositor Conveyor is Clean and Air Dried. Sprinkle Die is Inserted.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-11', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 8,
    title: 'Tray Puller',
    description: 'Extractor is Clean.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-12', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 9,
    title: 'Filling Belt',
    description: 'Conveyor and Rollers are clean and Belt is Air Dried.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-13', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 10,
    title: 'Lid Denester',
    description: 'Lid Denester is Clean and Air Dried. No Water on Lid Denester Platform.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-14', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 11,
    title: 'Tray Closer',
    description: 'Tray Closer Rollers and Belts are Clean and Air Dried.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-15', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 12,
    title: 'Clamshell Conveyor',
    description: 'Clamshell Conveyor is clean and Air Dried.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-16', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 13,
    title: 'Floor',
    description: 'Floor is clean and Dry. No Sanitation Equipment is on the Floor.',
    requiresPhoto: true,
  },
  {
    id: 'dec-post-17', areaId: 'macy-decoration', phase: 'post_cleaning', stepNumber: 14,
    title: 'Drains',
    description: 'Strainer and drains are clean.',
    requiresPhoto: true,
  },

  // === MACY OVEN - Pre-Cleaning ===
  {
    id: 'oven-pre-1', areaId: 'macy-oven', phase: 'pre_cleaning', stepNumber: 1,
    title: 'Pre-Cleaning Inspection',
    description: 'Verify the equipment for any inadequate condition and safety issues. Check sensors and motor. Verify damage on frame, conveyor, Panels, plugs and emergency button.',
    requiresPhoto: true,
  },
  // === MACY OVEN - Post-Cleaning ===
  {
    id: 'oven-post-2', areaId: 'macy-oven', phase: 'post_cleaning', stepNumber: 1,
    title: 'Oven Inside',
    description: 'Inside Frame from top, bottom and sides are cleaned.',
    requiresPhoto: true,
  },
  {
    id: 'oven-post-3', areaId: 'macy-oven', phase: 'post_cleaning', stepNumber: 2,
    title: 'Oven Outside',
    description: 'Front cover, oven exit hood and doors are cleaned.',
    requiresPhoto: true,
  },
  {
    id: 'oven-post-4', areaId: 'macy-oven', phase: 'post_cleaning', stepNumber: 3,
    title: 'Floor',
    description: 'Floor is clean and Dry. No Sanitation Equipment is on the Floor.',
    requiresPhoto: true,
  },

  // === MACY SPIRAL - Pre-Cleaning ===
  {
    id: 'spiral-pre-1', areaId: 'macy-spiral', phase: 'pre_cleaning', stepNumber: 1,
    title: 'Pre-Cleaning Inspection',
    description: 'Verify the equipment for any inadequate condition and safety issues. Check sensors and motor. Verify damage on frame, conveyor, Panels, plugs and emergency button.',
    requiresPhoto: true,
  },
  // === MACY SPIRAL - Post-Cleaning ===
  {
    id: 'spiral-post-2', areaId: 'macy-spiral', phase: 'post_cleaning', stepNumber: 1,
    title: 'Covering',
    description: 'Motors, sensors, air regulators and electric panels covered. Record: No. of equipment Covered ____ | No. of Bag Retrieved ____',
    requiresPhoto: true,
  },
  {
    id: 'spiral-post-3', areaId: 'macy-spiral', phase: 'post_cleaning', stepNumber: 2,
    title: 'Conveyor',
    description: 'Spiral Belt and Merging Conveyors are Clean.',
    requiresPhoto: true,
  },
  {
    id: 'spiral-post-4', areaId: 'macy-spiral', phase: 'post_cleaning', stepNumber: 3,
    title: 'Floor',
    description: 'Floor is clean and Dry. No Sanitation Equipment is on the Floor.',
    requiresPhoto: true,
  },
  {
    id: 'spiral-post-5', areaId: 'macy-spiral', phase: 'post_cleaning', stepNumber: 4,
    title: 'Drains',
    description: 'Strainer and drains are clean.',
    requiresPhoto: true,
  },

  // === MACY PALLETIZING - Pre-Cleaning ===
  {
    id: 'pallet-pre-1', areaId: 'macy-palletizing', phase: 'pre_cleaning', stepNumber: 1,
    title: 'Pre-Cleaning Inspection',
    description: 'Verify the equipment for any inadequate condition and safety issues. Check sensors and motor. Verify damage on frame, conveyor, Panels, plugs and emergency button.',
    requiresPhoto: true,
  },
  // === MACY PALLETIZING - Post-Cleaning ===
  {
    id: 'pallet-post-2', areaId: 'macy-palletizing', phase: 'post_cleaning', stepNumber: 1,
    title: 'Covering',
    description: 'Motors, sensors, air regulators and electric panels covered. Record: No. of equipment Covered ____ | No. of Bag Retrieved ____',
    requiresPhoto: true,
  },
  {
    id: 'pallet-post-3', areaId: 'macy-palletizing', phase: 'post_cleaning', stepNumber: 2,
    title: 'Metal Detector and Belt',
    description: 'Metal detector and Belt is Clean and Sanitized.',
    requiresPhoto: true,
  },
  {
    id: 'pallet-post-4', areaId: 'macy-palletizing', phase: 'post_cleaning', stepNumber: 3,
    title: 'Case Packer Unit (JLS)',
    description: 'Conveyor, Robots and Frame are Clean and Sanitized.',
    requiresPhoto: true,
  },
  {
    id: 'pallet-post-5', areaId: 'macy-palletizing', phase: 'post_cleaning', stepNumber: 4,
    title: 'Case Sealing Machine',
    description: 'Case Sealing Machine is Air Cleaned and Sanitized.',
    requiresPhoto: true,
  },
  {
    id: 'pallet-post-6', areaId: 'macy-palletizing', phase: 'post_cleaning', stepNumber: 5,
    title: 'Box Making Machine',
    description: 'Box Making Machine is Air Cleaned and Sanitized.',
    requiresPhoto: true,
  },
  {
    id: 'pallet-post-7', areaId: 'macy-palletizing', phase: 'post_cleaning', stepNumber: 6,
    title: 'Palletizer',
    description: 'Palletizer is Air Cleaned and Sanitized.',
    requiresPhoto: true,
  },
  {
    id: 'pallet-post-8', areaId: 'macy-palletizing', phase: 'post_cleaning', stepNumber: 7,
    title: 'Floor',
    description: 'Floor is clean and Dry. No Sanitation Equipment is on the Floor.',
    requiresPhoto: true,
  },
];

export function getItemsForArea(areaId: string, phase: 'pre_cleaning' | 'post_cleaning') {
  return CHECKLIST_ITEMS
    .filter(item => item.areaId === areaId && item.phase === phase)
    .sort((a, b) => a.stepNumber - b.stepNumber);
}

export function getAreaById(areaId: string) {
  return AREAS.find(a => a.id === areaId);
}

export function getPreCleanCount(areaId: string) {
  return CHECKLIST_ITEMS.filter(i => i.areaId === areaId && i.phase === 'pre_cleaning').length;
}

export function getPostCleanCount(areaId: string) {
  return CHECKLIST_ITEMS.filter(i => i.areaId === areaId && i.phase === 'post_cleaning').length;
}
