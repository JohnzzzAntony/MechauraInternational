/**
 * Mechaura International — Central content store
 *
 * Static seed data used to initialise the Zustand store on first load.
 * All public-facing sections read from the store, and the admin panel
 * mutates the store. Edits persist to localStorage so changes survive
 * page reloads during the session.
 *
 * Images live under /public/images/ and are referenced by relative URL.
 */

export interface CompanyInfo {
  name: string;
  shortName: string;
  legalEntity: string;
  tagline: string;
  description: string;
  foundedYear: number;
  headquarters: string;
  phone: string;
  phoneRaw: string;
  email: string;
  hours: string;
  social: {
    linkedin: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}

export interface ValueItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  summary: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  applications: string[];
  materials: string[];
  brands: string[];
  icon: string;
  image: string;
}

export interface Industry {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  company: string;
  initials: string;
}

export interface InsightPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  productCategory: string;
  message: string;
  receivedAt: string;
  status: "new" | "read" | "archived";
  reference: string;
}

export const seedCompany: CompanyInfo = {
  name: "Mechaura International FZE LLC",
  shortName: "Mechaura International",
  legalEntity: "Mechaura International FZE LLC",
  tagline: "Your Industrial Partner for Quality, Speed & Support",
  description:
    "UAE-based industrial supplier delivering high-quality industrial equipment, tools, and specialized brushes across the GCC. Reliable supply, competitive pricing, on-time delivery.",
  foundedYear: 2019,
  headquarters: "Ajman Free Zone, Ajman, UAE",
  phone: "+971 56 620 2517",
  phoneRaw: "+971566202517",
  email: "info@mechaurainternational.com",
  hours: "Sun – Thu, 8:00 AM – 6:00 PM (GST)",
  social: {
    linkedin: "#",
    instagram: "#",
    facebook: "#",
    whatsapp: "https://wa.me/971566202517",
  },
};

export const seedStats: StatItem[] = [
  { id: "s1", value: 6, suffix: "+", label: "Years of Industrial Supply" },
  { id: "s2", value: 500, suffix: "+", label: "Active B2B Clients" },
  { id: "s3", value: 1200, suffix: "+", label: "SKUs Supplied" },
  { id: "s4", value: 98, suffix: "%", label: "On-Time Delivery Rate" },
];

export const seedValues: ValueItem[] = [
  {
    id: "v1",
    title: "Quality Products",
    description:
      "Premium industrial products sourced from vetted global manufacturers and tested to exceed performance expectations on every shipment.",
    icon: "shield-check",
  },
  {
    id: "v2",
    title: "Trusted Supply Network",
    description:
      "Dependable supply chains anchored in long-standing manufacturer relationships that keep your operations moving without interruption.",
    icon: "network",
  },
  {
    id: "v3",
    title: "Timely Delivery",
    description:
      "Logistics engineered around your production schedule — fast, predictable, on-time deliveries so you never miss a critical deadline.",
    icon: "truck",
  },
  {
    id: "v4",
    title: "Customer-Focused Service",
    description:
      "Personalized technical guidance and after-sales support tailored to the unique requirements of each account and application.",
    icon: "headset",
  },
];

export const seedServices: ServiceItem[] = [
  {
    id: "svc1",
    number: "01",
    title: "Industrial Tools",
    summary:
      "A comprehensive range of industrial tools engineered to enhance productivity and efficiency across manufacturing, fabrication, and maintenance operations.",
    description:
      "From precision hand tools to power tools and workshop equipment, we supply vetted products that perform in demanding continuous-duty environments. Our team helps you select the right tooling for the job, balancing upfront cost with total cost of ownership and lifecycle performance.",
    features: [
      "Precision hand tools & power tools",
      "Workshop & maintenance equipment",
      "Cutting, drilling & fastening solutions",
      "Tooling selection consultation",
    ],
    icon: "wrench",
    image: "/images/services/industrial-tools.png",
  },
  {
    id: "svc2",
    number: "02",
    title: "Specialized Brushes",
    summary:
      "An extensive selection of industrial brushes — wire, abrasive, and custom-designed — engineered for surface preparation, deburring, and cleaning applications.",
    description:
      "As a specialized distributor, we maintain deep expertise in brush geometry, filament material, and abrasive grit selection. Our custom-design capability means we can engineer brushes for unusual profiles, including linear guides, elevator rails, CNC turrets, and heavy-duty deburring lines.",
    features: [
      "Wire, abrasive & non-woven brushes",
      "Custom brush design & manufacturing",
      "Surface preparation & deburring",
      "Application-specific recommendations",
    ],
    icon: "brush",
    image: "/images/services/specialized-brushes.png",
  },
  {
    id: "svc3",
    number: "03",
    title: "Industrial Equipment",
    summary:
      "Sourced and supplied from leading global manufacturers, our industrial equipment portfolio meets the diverse needs of modern industrial operations.",
    description:
      "We work with manufacturers across Europe, North America, and Asia to bring reliable equipment into the GCC market — from hydraulic and pneumatic assemblies to elevator components and cutting machinery. Every shipment is quality-checked and supported by technical documentation.",
    features: [
      "Hydraulic & pneumatic assemblies",
      "Bearings & power transmission",
      "Elevator & lifting accessories",
      "Equipment sourcing & logistics",
    ],
    icon: "settings",
    image: "/images/services/industrial-equipment.png",
  },
];

export const seedProducts: ProductCategory[] = [
  {
    id: "p1",
    slug: "abrasive-removal-brushes",
    name: "Abrasive Removal Brushes",
    shortDescription:
      "Engineered nylon and wire brushes for surface preparation, deburring, and cleaning.",
    description:
      "Our abrasive removal brushes are manufactured from premium nylon filaments impregnated with silicon carbide or aluminium oxide grit. They are designed for controlled surface finishing on metal, composite, and wood substrates — delivering consistent results without the geometrical damage associated with traditional wire brushes. Available in cup, wheel, end, and twisted-knot configurations.",
    applications: [
      "Deburring of machined components",
      "Weld seam cleaning",
      "Rust and scale removal",
      "Surface preparation prior to coating",
    ],
    materials: ["Silicon Carbide Nylon", "Aluminium Oxide Nylon", "Steel Wire", "Stainless Wire"],
    brands: ["Mechaura Industrial", "Abrasil Pro", "Vikan Technical"],
    icon: "brush",
    image: "/images/products/abrasive-brushes.png",
  },
  {
    id: "p2",
    slug: "bearings",
    name: "Bearings",
    shortDescription:
      "Precision rolling-element bearings for industrial machinery, automotive, and heavy equipment.",
    description:
      "A complete range of ball, roller, and thrust bearings engineered to ISO tolerance grades. We supply deep groove ball bearings, tapered roller bearings, spherical roller bearings, and pillow block units for applications ranging from electric motors and conveyors to heavy mining and marine equipment. Each bearing is sourced from audited manufacturers and shipped with full traceability.",
    applications: [
      "Electric motors & fans",
      "Conveyor systems",
      "Automotive wheel hubs",
      "Heavy machinery & mining equipment",
    ],
    materials: ["Chrome Steel (SUJ2)", "Stainless Steel (AISI 440C)", "Ceramic Hybrid"],
    brands: ["Mechaura Industrial", "SKF-Compatible", "NSK-Compatible", "FAG-Compatible"],
    icon: "circle-dot",
    image: "/images/products/bearings.png",
  },
  {
    id: "p3",
    slug: "hydraulic-hose",
    name: "Hydraulic Hose",
    shortDescription:
      "High-pressure hydraulic hoses and assemblies rated for demanding fluid power applications.",
    description:
      "Our hydraulic hose portfolio covers SAE 100R1 through 100R12 standards, with working pressures up to 280 bar (4,000 PSI). Hoses are constructed with synthetic rubber inner tubes, multiple steel wire reinforcement layers, and abrasion-resistant covers. We supply pre-assembled hoses with crimped fittings to customer specification, alongside a full range of compatible fittings and adapters.",
    applications: [
      "Construction equipment hydraulics",
      "Industrial presses & lifts",
      "Agricultural machinery",
      "Oil & gas fluid transfer",
    ],
    materials: ["Synthetic Rubber (NBR/EPDM)", "Steel Wire Braid", "Steel Wire Spiral", "PTFE"],
    brands: ["Mechaura Industrial", "Parker-Compatible", "Manuli-Compatible"],
    icon: "git-branch",
    image: "/images/products/hydraulic-hose.png",
  },
  {
    id: "p4",
    slug: "cutting-tools",
    name: "Cutting Tools",
    shortDescription:
      "Carbide and HSS cutting tools for precision machining, drilling, and milling operations.",
    description:
      "A comprehensive selection of indexable carbide inserts, solid carbide end mills, drills, taps, and reamers. Our cutting tools are engineered for high material removal rates, extended tool life, and superior surface finish across steel, stainless, aluminium, and exotic alloy machining. Tooling geometries are matched to workpiece material and machine capability for optimal performance.",
    applications: [
      "CNC milling & turning",
      "Drilling & tapping",
      "Reaming & boring",
      "Thread milling & grooving",
    ],
    materials: ["Tungsten Carbide", "HSS-Co (Cobalt)", "PCD", "CBN"],
    brands: ["Mechaura Industrial", "Sandvik-Compatible", "Kennametal-Compatible"],
    icon: "scissors",
    image: "/images/products/cutting-tools.png",
  },
  {
    id: "p5",
    slug: "elevator-accessories",
    name: "Elevator Accessories",
    shortDescription:
      "Components and consumables for elevator installation, maintenance, and modernization.",
    description:
      "A curated range of elevator components including guide rails, door operators, buffers, ropes, and control accessories. We serve elevator OEMs, installers, and maintenance contractors across the GCC with parts that comply with EN 81 and local civil defence requirements. Custom kits are available for modernization projects and retrofits.",
    applications: [
      "Passenger & freight elevators",
      "Escalators & moving walks",
      "Modernization & retrofit projects",
      "Preventive maintenance programs",
    ],
    materials: ["Galvanized Steel", "Stainless Steel 304/316", "Cast Iron", "Engineering Polymer"],
    brands: ["Mechaura Industrial", "ElevTech Components"],
    icon: "move-vertical",
    image: "/images/products/elevator-accessories.png",
  },
  {
    id: "p6",
    slug: "bandsaw-blades",
    name: "Bandsaw Blades",
    shortDescription:
      "Bi-metal and carbide-tipped bandsaw blades for metal cutting and structural fabrication.",
    description:
      "High-performance bandsaw blades engineered for cutting structural steel, solid bars, tubes, and exotic alloys. Our bi-metal blades feature M42 high-speed steel teeth electron-beam welded to a flexible alloy steel backer, delivering long life and resistance to tooth strippage. Carbide-tipped options are available for high-production cutting of difficult materials.",
    applications: [
      "Structural steel cutting",
      "Solid bar & tube cutting",
      "Billet & ingot sawing",
      "Exotic alloy machining",
    ],
    materials: ["Bi-Metal M42", "Carbide Tipped", "Spring Steel Backer"],
    brands: ["Mechaura Industrial", "Bahco-Compatible", "Lenox-Compatible"],
    icon: "zap",
    image: "/images/products/bandsaw-blades.png",
  },
];

export const seedIndustries: Industry[] = [
  {
    id: "ind1",
    slug: "manufacturing",
    name: "Manufacturing",
    description:
      "Supplying reliable industrial products to support efficient and consistent production processes across discrete and continuous manufacturing operations.",
    icon: "factory",
  },
  {
    id: "ind2",
    slug: "automotive",
    name: "Automotive",
    description:
      "Providing quality components and materials for automotive manufacturing, assembly, and aftermarket maintenance needs across passenger and commercial vehicles.",
    icon: "car",
  },
  {
    id: "ind3",
    slug: "construction",
    name: "Construction",
    description:
      "Delivering durable industrial products for safe and efficient construction operations — from earthmoving equipment hydraulics to site fabrication tooling.",
    icon: "hard-hat",
  },
  {
    id: "ind4",
    slug: "oil-and-gas",
    name: "Oil & Gas",
    description:
      "Supporting upstream, midstream, and downstream operations with dependable products engineered for the demanding environments of the energy sector.",
    icon: "flame",
  },
  {
    id: "ind5",
    slug: "engineering-and-fabrication",
    name: "Engineering & Fabrication",
    description:
      "Supplying precision products that meet the exacting requirements of engineering workshops, structural fabricators, and bespoke project teams.",
    icon: "ruler",
  },
  {
    id: "ind6",
    slug: "facility-management",
    name: "Facility Management",
    description:
      "Providing essential industrial supplies and consumables that keep buildings, infrastructure, and equipment operating smoothly with minimal downtime.",
    icon: "building-2",
  },
];

export const seedWhyChooseUs: WhyChooseUsItem[] = [
  {
    id: "w1",
    title: "Fast & Reliable Delivery",
    description:
      "Strategically located in Ajman Free Zone with strong logistics partnerships, we deliver across the UAE within 24–48 hours and ship regionally to GCC nations on predictable schedules.",
    icon: "truck",
  },
  {
    id: "w2",
    title: "Competitive Pricing",
    description:
      "Direct relationships with manufacturers and efficient free-zone operations allow us to offer highly competitive pricing without compromising on product quality or service standards.",
    icon: "trending-down",
  },
  {
    id: "w3",
    title: "Consistent Quality Standards",
    description:
      "Every product is sourced from audited manufacturers and inspected against documented quality criteria. We maintain batch traceability and provide material certificates on request.",
    icon: "badge-check",
  },
  {
    id: "w4",
    title: "Technical Support & Guidance",
    description:
      "Our team brings hands-on industrial experience to every inquiry — from product selection and specification to troubleshooting and lifecycle optimization.",
    icon: "headset",
  },
];

export const seedProcessSteps: ProcessStep[] = [
  {
    id: "ps1",
    number: "01",
    title: "Requirement Discovery",
    description:
      "We start with a structured conversation to understand your application, operating conditions, volumes, and delivery expectations. Our team documents specifications and confirms compatibility before any quotation is issued.",
  },
  {
    id: "ps2",
    number: "02",
    title: "Sourcing & Quotation",
    description:
      "Based on your requirements, we identify the right product — from stock or through our manufacturer network — and provide a transparent quotation with full technical data, lead times, and pricing breakdown.",
  },
  {
    id: "ps3",
    number: "03",
    title: "Quality Check & Dispatch",
    description:
      "Before dispatch, every order is inspected against your specification. We verify quantities, packaging, certificates, and documentation, then coordinate logistics to your delivery point.",
  },
  {
    id: "ps4",
    number: "04",
    title: "After-Sales Support",
    description:
      "Our relationship begins at delivery. We provide installation guidance, troubleshooting support, performance follow-up, and re-order management to ensure long-term operational success.",
  },
];

export const seedTestimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Mechaura has been our preferred supplier for industrial brushes and bearings for over three years. Their technical team understands our production environment and consistently delivers on schedule.",
    name: "Operations Manager",
    company: "Steel Fabrication Plant, Sharjah",
    initials: "OM",
  },
  {
    id: "t2",
    quote:
      "The responsiveness of the Mechaura team is exceptional. We needed a custom brush solution for an unusual profile — they engineered a sample within a week and delivered production volumes on time.",
    name: "Maintenance Lead",
    company: "Elevator Service Company, Dubai",
    initials: "ML",
  },
  {
    id: "t3",
    quote:
      "Switching to Mechaura for our cutting tools and bandsaw blades reduced our per-part tooling cost noticeably. Quality is consistent and the team is genuinely invested in our efficiency.",
    name: "Procurement Head",
    company: "Heavy Engineering Workshop, Abu Dhabi",
    initials: "PH",
  },
];

export const seedInsights: InsightPost[] = [
  {
    id: "i1",
    title: "Selecting the Right Abrasive Brush for Surface Preparation",
    excerpt:
      "Silicon carbide vs aluminium oxide, filament gauge, brush geometry — a practical guide to specifying brushes that deliver consistent surface finishes without damaging substrates.",
    category: "Surface Preparation",
    readTime: "8 min read",
    date: "2026-07-18",
    image: "/images/insights/article-1.png",
  },
  {
    id: "i2",
    title: "Bearing Lubrication: Grease vs Oil for Continuous-Duty Applications",
    excerpt:
      "Lubricant selection drives bearing life more than any other variable. We break down the trade-offs between grease and oil lubrication across speed, load, and temperature regimes.",
    category: "Maintenance",
    readTime: "11 min read",
    date: "2026-07-04",
    image: "/images/insights/article-2.png",
  },
  {
    id: "i3",
    title: "Hydraulic Hose Failure Modes and How to Prevent Them",
    excerpt:
      "From abrasion to fluid incompatibility, hose failures are predictable. Learn the inspection cadence and routing practices that extend hose life and prevent unplanned downtime.",
    category: "Hydraulics",
    readTime: "9 min read",
    date: "2026-06-22",
    image: "/images/insights/article-3.png",
  },
];

export const seedPartnerBrands: string[] = [
  "SKF",
  "NSK",
  "FAG",
  "Parker",
  "Sandvik",
  "Kennametal",
  "Bahco",
  "Lenox",
  "Manuli",
  "Bosch",
  "Makita",
  "Stanley",
];

export const heroImages = {
  background: "/images/hero/hero-bg.png",
};

export const aboutImages = {
  warehouse: "/images/about/warehouse.png",
};

export const ctaImages = {
  background: "/images/cta/cta-bg.png",
};

export const ogImage = "/images/og/og-image.png";
