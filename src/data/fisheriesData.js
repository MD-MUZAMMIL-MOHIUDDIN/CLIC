// ============================================================
// Fisheries & Aquaculture Management Data Model
// ============================================================

export const fisheries = {
  varieties: [
    { name: 'Catla (Surface Feeder)', density: '1,000 - 1,200 fingerlings/acre', feed: 'Plankton, rice bran, mustard oil cake', period: '10-12 months', size: '1 - 1.2 kg' },
    { name: 'Rohu (Column Feeder)', density: '1,500 - 1,800 fingerlings/acre', feed: 'Detritus, supplemental pellets', period: '10-12 months', size: '900g - 1 kg' },
    { name: 'Mrigal (Bottom Feeder)', density: '1,200 - 1,500 fingerlings/acre', feed: 'Decaying organic matter, bran mixture', period: '12 months', size: '800g - 1 kg' }
  ],
  pondsize: {
    guide: 'Ideal fish pond size ranges from 0.5 to 2.0 acres. Water depth should be maintained at 1.5 to 2.0 meters (5 to 6.5 feet). Soil must have at least 20-30% clay content to retain water.',
    calculator: {
      waterVolumeFormula: 'Length (m) × Width (m) × Avg Depth (m) = Volume (cubic meters)',
      densityFormula: 'Stocking Density = Water Volume (m³) × 1.2 fingerlings'
    }
  },
  weeding: [
    { type: 'Floating Weeds (Eichhornia, Pistia)', control: 'Manual physical removal. Maintain water flow.' },
    { type: 'Submerged Weeds (Hydrilla, Vallisneria)', control: 'Introduce Grass Carp fish (consumes weed). Dry the pond during preparation.' },
    { type: 'Emergent Weeds (Typha, Nymphaea)', control: 'Manual cutting below water level or chemical spraying on bunds.' }
  ],
  manuring: [
    { type: 'Basal Manuring', application: 'Apply 2,000 - 3,000 kg/acre Organic Raw Cow Dung (RCD) or Compost 15 days before stocking fingerlings.' },
    { type: 'Monthly Schedule', application: 'Apply 250 kg RCD, 10 kg Urea, and 15 kg Single Super Phosphate (SSP) per acre every month to maintain plankton bloom.' },
    { type: 'Lime Treatment', application: 'Apply 100 - 150 kg/acre of Agricultural Lime (CaCO3) annually to stabilize pH (optimum pH: 7.5 - 8.5).' }
  ]
};

export default fisheries;
