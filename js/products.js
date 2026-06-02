const PRODUCTS = [
  {
    id: "phantom-cargo-baggy-jeans",
    name: "Phantom Cargo Baggy Jeans",
    price: 1299,
    category: "utility",
    type: "baggy",
    description: "Washed black baggy denim with cargo pockets, contrast stitching & wide-leg silhouette.",
    images: [
      "assets/baggy_jeans_black.jpg"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Washed Black", hex: "#2b2b2b" }
    ],
    rating: 4.9,
    reviewsCount: 174,
    features: ["14.5oz Heavyweight Denim", "Double Utility Cargo Pockets", "Skate Fit Wide-Leg Silhouette", "YKK Zippers"]
  },
  {
    id: "acid-indigo-distressed-jeans",
    name: "Acid Indigo Distressed Jeans",
    price: 1299,
    category: "washed",
    type: "baggy",
    description: "Distressed light-wash blue baggy jeans with ripped knees & frayed hems for that raw skater look.",
    images: [
      "assets/baggy_jeans_blue.jpeg"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Acid Light Blue", hex: "#a4c2e6" }
    ],
    rating: 4.8,
    reviewsCount: 142,
    features: ["Destroyed Knee Detailing", "Frayed Stacking Hems", "Hand-finished Whiskering", "Loose Skater Silhouette"]
  },
  {
    id: "zenith-graffiti-baggy-jeans",
    name: "Zenith Graffiti Baggy Jeans",
    price: 1499,
    category: "printed",
    type: "super-baggy",
    description: "Dark indigo baggy jeans with custom streetwear graffiti prints & screen-printed graphic side panels.",
    images: [
      "assets/baggy_jeans_printed.jpeg"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Raw Dark Indigo", hex: "#161b2e" }
    ],
    rating: 4.9,
    reviewsCount: 96,
    features: ["Multicolor Graffiti Screen-print", "Rigid Raw Selvedge Feel", "High-density Embroidery", "Custom Back Pocket Branding"]
  },
  {
    id: "stealth-multi-strap-jeans",
    name: "Stealth Multi-Strap Cargo Jeans",
    price: 1499,
    category: "utility",
    type: "super-baggy",
    description: "Washed black utility denim with adjustable tactical nylon straps & heavy-duty D-ring buckle details.",
    images: [
      "assets/bagy1.png"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Stealth Black", hex: "#141414" }
    ],
    rating: 4.7,
    reviewsCount: 88,
    features: ["Tactical Nylon Leg Straps", "Utility D-Ring Key Loops", "Deep Side Slash Pockets", "Reinforced Knee Panels"]
  },
  {
    id: "ember-bleach-splash-jeans",
    name: "Ember Bleach Splash Jeans",
    price: 1299,
    category: "washed",
    type: "baggy",
    description: "Mid-wash baggy jeans with unique hand-applied bleach splatter — every piece is one of a kind.",
    images: [
      "assets/jean3.jpeg"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Bleached Splatter Blue", hex: "#7a95bd" }
    ],
    rating: 4.6,
    reviewsCount: 64,
    features: ["One-of-a-kind Bleached Splash", "Soft Washed Comfy Denim", "Extra Wide Foot Opening", "Leather Waist Patch"]
  },
  {
    id: "krypton-cyber-embroidered-jeans",
    name: "Krypton Cyber Embroidered Jeans",
    price: 1499,
    category: "printed",
    type: "super-baggy",
    description: "Deep indigo wide-leg jeans with neon green cyber wireframe embroidery down the side panels.",
    images: [
      "assets/jean5..jpeg"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Cyber Neon Indigo", hex: "#11172a" }
    ],
    rating: 4.9,
    reviewsCount: 115,
    features: ["Cyber Wireframe Embroidery", "High-Density Neon Stitching", "Baggy Skater Profile", "Logo Waist Button"]
  },
  {
    id: "selvedge-raw-skater-jeans",
    name: "Selvedge Raw Skater Jeans",
    price: 1499,
    category: "classic",
    type: "super-baggy",
    description: "14oz Japanese raw selvedge denim in a wide-leg skate profile — fades naturally with wear.",
    images: [
      "assets/bagy.png"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Raw Selvedge Indigo", hex: "#0f1322" }
    ],
    rating: 4.8,
    reviewsCount: 102,
    features: ["14oz Japanese Selvedge Denim", "Raw Unwashed Finish", "Signature Red Outseam ID", "Triple-needle Stitched Seams"]
  },
  {
    id: "nexus-paneled-patchwork-jeans",
    name: "Nexus Paneled Patchwork Jeans",
    price: 1299,
    category: "classic",
    type: "baggy",
    description: "Reconstructed baggy jeans with paneled indigo, grey & bleach-wash denim blocks and raw frayed seams.",
    images: [
      "assets/baggy_jeans_blue.jpeg"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Contrast Patchwork Blue", hex: "#4b6c96" }
    ],
    rating: 4.7,
    reviewsCount: 79,
    features: ["Paneled Colorblock Design", "Raw Exposed Fraying Seams", "100% Cotton Sturdy Denim", "Washed Skate Fitting"]
  },
  {
    id: "nova-slit-baggy-jeans",
    name: "Nova Slit Baggy Jeans",
    price: 1299,
    category: "washed",
    type: "baggy",
    description: "Mid-wash vintage blue baggy jeans featuring subtle side-ankle slits and reinforced stitching.",
    images: [
      "assets/baggy_jeans_blue.jpeg"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Vintage Blue", hex: "#5275a1" }
    ],
    rating: 4.8,
    reviewsCount: 84,
    features: ["Side-Ankle Vent Slits", "Heavyweight 14oz Washed Cotton", "Loose Drape Profile"]
  },
  {
    id: "apex-grey-wash-baggy-jeans",
    name: "Apex Grey Wash Baggy Jeans",
    price: 1299,
    category: "washed",
    type: "baggy",
    description: "Stone-washed grey baggy jeans with pre-faded knee accents and stacked hems.",
    images: [
      "assets/baggy_jeans_black.jpg"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Stone Grey", hex: "#4a4a4a" }
    ],
    rating: 4.7,
    reviewsCount: 62,
    features: ["Mineral Grey Acid Wash", "Pre-Faded Knee Highlights", "Relaxed Street Fit"]
  },
  {
    id: "overdrive-painted-super-baggy-jeans",
    name: "Overdrive Painted Super Baggy Jeans",
    price: 1499,
    category: "printed",
    type: "super-baggy",
    description: "Extra wide-leg raw indigo denim decorated with custom hand-painted splattered streetwear graffiti.",
    images: [
      "assets/bagy.png"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Graffiti Indigo", hex: "#1d233a" }
    ],
    rating: 4.9,
    reviewsCount: 110,
    features: ["Custom Neon Graffiti Paint Splatters", "Extreme Stacking Wide Opening", "Thick 14.5oz Heavyweight Feel"]
  },
  {
    id: "vortex-paneled-super-baggy-jeans",
    name: "Vortex Paneled Super Baggy Jeans",
    price: 1499,
    category: "classic",
    type: "super-baggy",
    description: "Heavyweight dark charcoal paneled jeans with contrasting grey denim patchwork inserts and raw edges.",
    images: [
      "assets/bagy1.png"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Charcoal Patchwork", hex: "#222222" }
    ],
    rating: 4.8,
    reviewsCount: 93,
    features: ["Contrast Denim Patchwork Blocks", "Raw Exposed Fringed Seams", "Maximum Skate Silhouette"]
  }
];

// Export to window if running in browser
if (typeof window !== 'undefined') {
  window.PRODUCTS = PRODUCTS;
}
