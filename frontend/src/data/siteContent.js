export const STORAGE_KEY = 'quality-rental-site-content-v1';

const uploadImage = (fileName) => `/upload/${encodeURIComponent(fileName)}`;

const uploadedImages = [
  'WhatsApp Image 2026-08-18 at 21.18.12.jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.13 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.13.jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.14 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.14.jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.15 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.15 (2).jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.15.jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.16 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.16 (2).jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.16 (3).jpeg',
  'WhatsApp Image 2026-08-18 at 21.18.16.jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.18.jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.19 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.19.jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.20 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.20.jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.21 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.21.jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.22 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.22.jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.23 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.23 (2).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.23.jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.24 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.24 (2).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.24.jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.25 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.25 (2).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.25.jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.26 (1).jpeg',
  'WhatsApp Image 2026-08-18 at 21.39.26.jpeg',
];

const galleryItems = [
  { id: 1, title: 'Wedding Setup', tag: 'Wedding' },
  { id: 2, title: 'Outdoor Celebration', tag: 'Corporate' },
  { id: 3, title: 'Decor & Styling', tag: 'Decoration' },
  { id: 4, title: 'Birthday Setup', tag: 'Birthday' },
  { id: 5, title: 'Tent Layout', tag: 'Rentals' },
  { id: 6, title: 'Event Production', tag: 'Production' },
  { id: 7, title: 'Guest Seating', tag: 'Chairs' },
  { id: 8, title: 'Stage Ambience', tag: 'Stage' },
  { id: 9, title: 'Ceremony Design', tag: 'Design' },
  { id: 10, title: 'Event Details', tag: 'Setup' },
  { id: 11, title: 'Reception View', tag: 'Reception' },
  { id: 12, title: 'Rental Display', tag: 'Inventory' },
];

export const DEFAULT_SITE_CONTENT = {
  business: {
    companyName: 'QUALITY RENTAL BUSINESS SERVICES',
    tagline: 'Business Services',
    phone: '+231 7767 48152',
    email: 'paye.susanna@yahoo.com',
    location: 'Paynesville City, Montserrado County - Liberia',
    logo: '/images/QualityRentalServices-logo.jpeg',
  },
  communications: {
    whatsappNumber: '231776748152',
    whatsappGreeting: 'Hello! How can we help with your event rental needs?',
    widgetTitle: 'Quality Rental Support',
    availabilityText: 'Online - Typically replies in 5 minutes',
  },
  hero: {
    badge: 'EVERY EVENT. PERFECTLY EQUIPPED.',
    title: 'We Supply. You Celebrate.',
    description:
      'Premium event rentals for weddings, corporate gatherings, birthdays, and special occasions. From elegant tents to professional sound systems, we have everything you need to create unforgettable memories.',
    whatsappLink: 'https://wa.me/1234567890?text=Hi, I%27m%20interested%20in%20your%20event%20rental%20services.',
    backgroundImage: uploadImage(uploadedImages[0]),
    slides: uploadedImages.slice(0, 4).map((fileName, index) => ({
      id: index + 1,
      image: uploadImage(fileName),
      badge: [
        'EVERY EVENT. PERFECTLY EQUIPPED.',
        'WEDDINGS. CELEBRATED BEAUTIFULLY.',
        'CORPORATE EVENTS. DONE RIGHT.',
        'VIP PARTIES. MEMORIES LAST.',
      ][index],
      title: [
        'We Supply. You Celebrate.',
        'Elegant setups for unforgettable moments.',
        'Professional rentals that impress every guest.',
        'Beautiful event styling for every occasion.',
      ][index],
      description: [
        'Premium event rentals for weddings, corporate gatherings, birthdays, and special occasions. From elegant tents to professional sound systems, we have everything you need to create unforgettable memories.',
        'Create a flawless experience with premium canopies, seating, lighting, and decor tailored to your special day.',
        'Make your conference, launch, or event feel polished, comfortable, and fully prepared from start to finish.',
        'Turn your next celebration into a standout experience with our premium rental inventory and styling support.',
      ][index],
    })),
  },
  about: {
    heading: 'Quality Rental Business Services',
    description:
      'Your trusted partner for premium event rentals in Liberia. We transform ordinary events into extraordinary experiences with our top-quality equipment and exceptional service.',
    mission:
      'To provide exceptional event rental services with premium quality equipment, reliable support, and unwavering commitment to customer satisfaction.',
    vision:
      'To be Liberia\'s leading event rental company, known for excellence, innovation, and customer-centric service.',
    stats: [
      { label: 'Events Served', value: '500+' },
      { label: 'Happy Clients', value: '1000+' },
      { label: 'Quality Equipment', value: '100%' },
      { label: 'Support Available', value: '24/7' },
    ],
  },
  events: [
    { id: 1, name: 'Weddings', description: 'Elegant rentals for your special day' },
    { id: 2, name: 'Birthday Parties', description: 'Celebrate in style' },
    { id: 3, name: 'Corporate Events', description: 'Professional equipment for business' },
    { id: 4, name: 'Church Events', description: 'Religious gathering supplies' },
    { id: 5, name: 'Family Reunions', description: 'Bring families together' },
    { id: 6, name: 'And More', description: 'Any event, any size' },
  ],
  gallery: galleryItems.map((item, index) => ({
    ...item,
    image_url: uploadImage(uploadedImages[index % uploadedImages.length]),
  })),
  payments: [
    {
      id: 1,
      client: 'City Hall Gala',
      amount: 2500,
      method: 'Bank Transfer',
      status: 'Paid',
      date: '2026-08-01',
      notes: 'Initial deposit received',
    },
    {
      id: 2,
      client: 'Love & Light Wedding',
      amount: 1850,
      method: 'Cash',
      status: 'Pending',
      date: '2026-08-08',
      notes: 'Balance due on event day',
    },
    {
      id: 3,
      client: 'Karny Corporate Retreat',
      amount: 3200,
      method: 'Mobile Money',
      status: 'Paid',
      date: '2026-08-12',
      notes: 'Full package payment',
    },
  ],
  footer: {
    description:
      'Premium event rentals for weddings, corporate gatherings, and special occasions. We provide everything you need to create unforgettable memories.',
    socials: {
      facebook: 'https://www.facebook.com/share/18Csa3EUtQ/?mibextid=wwXIfr',
      instagram: '#',
      twitter: '#',
    },
  },
  catalog: {
    badge: 'What We Rent',
    title: 'Everything You Need for a Successful Event',
    categories: [
      { id: 1, name: 'Canopy / Tents', icon_name: 'TentIcon' },
      { id: 2, name: 'Tables & Chairs', icon_name: 'ArmchairIcon' },
      { id: 3, name: 'Water Tanks', icon_name: 'ContainerIcon' },
      { id: 4, name: 'Event Equipment', icon_name: 'LayersIcon' },
    ],
    products: [
      {
        id: 1,
        category_id: 1,
        name: 'Premium Tent Setup',
        description: 'Spacious tent with elegant event-ready layout.',
        price: 'From $250',
        image_url: uploadImage(uploadedImages[0]),
      },
      {
        id: 2,
        category_id: 2,
        name: 'Banquet Table',
        description: 'Durable banquet tables for large gatherings.',
        price: 'From $35',
        image_url: uploadImage(uploadedImages[3]),
      },
      {
        id: 3,
        category_id: 2,
        name: 'Gold Phoenix Chair',
        description: 'Classic chair style for elegant spaces.',
        price: 'From $18',
        image_url: uploadImage(uploadedImages[5]),
      },
      {
        id: 4,
        category_id: 3,
        name: 'Water Tank',
        description: 'Large-capacity water tank for events and backups.',
        price: 'From $120',
        image_url: uploadImage(uploadedImages[7]),
      },
      {
        id: 5,
        category_id: 4,
        name: 'Event Generator',
        description: 'Dependable power backup for outdoor venues.',
        price: 'From $180',
        image_url: uploadImage(uploadedImages[8]),
      },
      {
        id: 6,
        category_id: 1,
        name: 'Heavy Duty Canopy',
        description: 'Strong canopy for weather-ready events.',
        price: 'From $220',
        image_url: uploadImage(uploadedImages[9]),
      },
    ],
  },
};

export const loadSiteContent = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_SITE_CONTENT;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return DEFAULT_SITE_CONTENT;
    }

    return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(saved) };
  } catch (error) {
    console.error('Error loading site content:', error);
    return DEFAULT_SITE_CONTENT;
  }
};

export const saveSiteContent = (content) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
};

export const resetSiteContent = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_SITE_CONTENT;
  }

  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_SITE_CONTENT;
};

export const resetWebsiteContentOnly = (currentContent) => {
  if (typeof window === 'undefined') {
    return DEFAULT_SITE_CONTENT;
  }

  // Preserve catalog (products and categories) - they come from API/database
  const preservedCatalog = currentContent?.catalog || DEFAULT_SITE_CONTENT.catalog;

  // Reset only website content sections
  const resetContent = {
    ...DEFAULT_SITE_CONTENT,
    catalog: preservedCatalog, // Keep existing catalog
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(resetContent));
  return resetContent;
};
