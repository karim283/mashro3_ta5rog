const db = require("./db");

const seedDatabase = async () => {
  try {
    console.log("Seeding Database...");

    // Seeding Repair Shops
    const [existingShops] = await db.query("SELECT COUNT(*) as count FROM repair_shops");
    if (existingShops[0].count === 0) {
      console.log("Seeding Repair Shops...");
      const repairShops = [
        { name: "Fix-It Garage", address: "123 Main St, Alexandria", rating: 4.5, image: "https://via.placeholder.com/150", lat: 31.2, lng: 29.9 },
        { name: "Speedy Repairs", address: "456 Side St, Alexandria", rating: 4.2, image: "https://via.placeholder.com/150", lat: 31.22, lng: 29.95 },
        { name: "Elite Auto Care", address: "789 High St, Alexandria", rating: 4.8, image: "https://via.placeholder.com/150", lat: 31.18, lng: 29.88 },
      ];

      for (const shop of repairShops) {
        await db.query(
          "INSERT INTO repair_shops (name, address, rating, image, lat, lng) VALUES (?, ?, ?, ?, ?, ?)",
          [shop.name, shop.address, shop.rating, shop.image, shop.lat, shop.lng]
        );
      }
    }

    // Seeding Care Centers
    const [existingCenters] = await db.query("SELECT COUNT(*) as count FROM care_centers");
    if (existingCenters[0].count === 0) {
      console.log("Seeding Care Centers...");
      const careCenters = [
        { name: "Alexandria Car Care", address: "Corniche Road, Alexandria", rating: 4.7, image: "https://via.placeholder.com/150", lat: 31.25, lng: 29.98 },
        { name: "Premium Service Center", address: "Downtown Area, Alexandria", rating: 4.3, image: "https://via.placeholder.com/150", lat: 31.21, lng: 30.01 },
        { name: "City Auto Hub", address: "Industrial Zone, Alexandria", rating: 4.0, image: "https://via.placeholder.com/150", lat: 31.15, lng: 29.85 },
      ];

      for (const center of careCenters) {
        await db.query(
          "INSERT INTO care_centers (name, address, rating, image, lat, lng) VALUES (?, ?, ?, ?, ?, ?)",
          [center.name, center.address, center.rating, center.image, center.lat, center.lng]
        );
      }
    }

    // Seeding Gas Stations
    const [existingGas] = await db.query("SELECT COUNT(*) as count FROM gas_stations");
    if (existingGas[0].count === 0) {
      console.log("Seeding Gas Stations...");
      const gasStations = [
        { name: "Shell Gas Station", address: "Sidi Gaber, Alexandria", rating: 4.5, image: "https://via.placeholder.com/150", lat: 31.22, lng: 29.94 },
        { name: "Mobil 1 Station", address: "Smouha, Alexandria", rating: 4.2, image: "https://via.placeholder.com/150", lat: 31.21, lng: 29.96 },
        { name: "Misr Petroleum", address: "Corniche Road, Alexandria", rating: 4.0, image: "https://via.placeholder.com/150", lat: 31.26, lng: 29.99 },
      ];

      for (const gas of gasStations) {
        await db.query(
          "INSERT INTO gas_stations (name, address, rating, image, lat, lng) VALUES (?, ?, ?, ?, ?, ?)",
          [gas.name, gas.address, gas.rating, gas.image, gas.lat, gas.lng]
        );
      }
    }

    // Seeding Categories
    const [existingCats] = await db.query("SELECT COUNT(*) as count FROM categories");
    if (existingCats[0].count === 0) {
      console.log("Seeding Categories...");
      const categories = [
        { name: "Repair shop", icon: "🚗", path: "/explore/repair" },
        { name: "Profile", icon: "🙍‍♂️", path: "/profile" },
        { name: "Gas station", icon: "⛽", path: "/explore/gas" },
        { name: "Care centers", icon: "⚖️", path: "/explore/care" },
      ];

      for (const cat of categories) {
        await db.query(
          "INSERT INTO categories (name, icon, path) VALUES (?, ?, ?)",
          [cat.name, cat.icon, cat.path]
        );
      }
    }

    // Seeding Car Care Images
    const [existingImgs] = await db.query("SELECT COUNT(*) as count FROM car_care_images");
    if (existingImgs[0].count === 0) {
      console.log("Seeding Car Care Images...");
      const images = [
        "/car2.png",
        "/car3.png",
        "/car4.png",
        "/car5.jpg",
      ];

      for (const img of images) {
        await db.query(
          "INSERT INTO car_care_images (image_url) VALUES (?)",
          [img]
        );
      }
    }

    // Seeding Car Brands
const [existingBrands] = await db.query("SELECT COUNT(*) as count FROM car_brands");
if (existingBrands[0].count === 0) {
  console.log("Seeding Car Brands...");
  const brands = [
    { name: "KIA",        logo: "/logos/kia.png" },
    { name: "BMW",        logo: "/logos/bmw.png" },
    { name: "Mercedes",   logo: "/logos/mercedes.png" },
    { name: "Honda",      logo: "/logos/honda.png" },
    { name: "Audi",       logo: "/logos/audi.png" },
    { name: "Mahindra",   logo: "/logos/mahindra.png" },
  ];
  for (const brand of brands) {
    await db.query(
      "INSERT INTO car_brands (name, logo) VALUES (?, ?)",
      [brand.name, brand.logo]
    );
  }
}

// Seeding Car Catalog
const [existingCatalog] = await db.query("SELECT COUNT(*) as count FROM car_catalog");
if (existingCatalog[0].count === 0) {
  console.log("Seeding Car Catalog...");

  // Get brand IDs we just inserted
  const [brands] = await db.query("SELECT id, name FROM car_brands");
  const brandMap = {};
  brands.forEach(b => brandMap[b.name] = b.id);

  const cars = [
    {
      brand: "KIA", name: "KIA EV6", type: "sedan", year: 2018,
      image: "/cars/kia-ev6.png", weight: "4,856lbs",
      electric_range: "318km", top_speed: "220mph",
      acceleration: "0-60mph", power: "402hp"
    },
    {
      brand: "KIA", name: "KIA Seltos", type: "suv", year: 2022,
      image: "/cars/kia-seltos.png", weight: "3,200lbs",
      electric_range: "N/A", top_speed: "180mph",
      acceleration: "0-60mph", power: "146hp"
    },
    {
      brand: "BMW", name: "BMW X5", type: "suv", year: 2023,
      image: "/cars/bmw-x5.png", weight: "4,700lbs",
      electric_range: "N/A", top_speed: "250mph",
      acceleration: "0-60mph", power: "335hp"
    },
    {
      brand: "Honda", name: "Honda Civic", type: "sedan", year: 2023,
      image: "/cars/honda-civic.png", weight: "2,900lbs",
      electric_range: "N/A", top_speed: "180mph",
      acceleration: "0-60mph", power: "158hp"
    },
  ];

  for (const car of cars) {
    await db.query(
      `INSERT INTO car_catalog 
       (brand_id, name, type, year, image, weight, electric_range, top_speed, acceleration, power)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [brandMap[car.brand], car.name, car.type, car.year, car.image,
       car.weight, car.electric_range, car.top_speed, car.acceleration, car.power]
    );
  }
}

// Seeding Car Variants
const [existingVariants] = await db.query("SELECT COUNT(*) as count FROM car_variants");
if (existingVariants[0].count === 0) {
  console.log("Seeding Car Variants...");

  // Get car IDs
  const [cars] = await db.query("SELECT id, name FROM car_catalog");
  const carMap = {};
  cars.forEach(c => carMap[c.name] = c.id);

  const variants = [
    { car: "KIA EV6", name: "EV6 GT Line",     transmission: "Automatic", fuel_type: "Electric", price: 45000 },
    { car: "KIA EV6", name: "EV6 GT Line AWD", transmission: "Automatic", fuel_type: "Electric", price: 52000 },
    { car: "KIA Seltos", name: "Seltos EX",    transmission: "Automatic", fuel_type: "Petrol",   price: 28000 },
    { car: "KIA Seltos", name: "Seltos SX",    transmission: "Manual",    fuel_type: "Petrol",   price: 32000 },
    { car: "BMW X5",     name: "X5 xDrive40i", transmission: "Automatic", fuel_type: "Petrol",   price: 65000 },
    { car: "Honda Civic", name: "Civic LX",    transmission: "Automatic", fuel_type: "Petrol",   price: 24000 },
  ];

  for (const variant of variants) {
    await db.query(
      "INSERT INTO car_variants (car_id, name, transmission, fuel_type, price) VALUES (?, ?, ?, ?, ?)",
      [carMap[variant.car], variant.name, variant.transmission, variant.fuel_type, variant.price]
    );
  }
}

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDatabase();
