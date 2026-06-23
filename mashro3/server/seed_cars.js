// seed_cars.js
// Run this file ONCE to populate your car catalog
// Command: node seed_cars.js

const db = require("./db");

const seedCars = async () => {
  try {
    console.log("Starting car catalog seed...");

    // ─── BRANDS ───────────────────────────────────────────────
    const [existingBrands] = await db.query("SELECT COUNT(*) as count FROM car_brands");
    if (existingBrands[0].count > 0) {
      console.log("Car brands already seeded, skipping...");
    } else {
      console.log("Seeding car brands...");

      const brands = [
        { name: "Toyota",      logo: "/logos/toyota.png" },
        { name: "Hyundai",     logo: "/logos/hyundai.png" },
        { name: "Kia",         logo: "/logos/kia.png" },
        { name: "Nissan",      logo: "/logos/nissan.png" },
        { name: "Chevrolet",   logo: "/logos/chevrolet.png" },
        { name: "Peugeot",     logo: "/logos/peugeot.png" },
        { name: "Renault",     logo: "/logos/renault.png" },
        { name: "Volkswagen",  logo: "/logos/volkswagen.png" },
        { name: "BMW",         logo: "/logos/bmw.png" },
        { name: "Mercedes-Benz", logo: "/logos/mercedes.png" },
        { name: "Audi",        logo: "/logos/audi.png" },
        { name: "Honda",       logo: "/logos/honda.png" },
        { name: "Mitsubishi",  logo: "/logos/mitsubishi.png" },
        { name: "Suzuki",      logo: "/logos/suzuki.png" },
        { name: "Skoda",       logo: "/logos/skoda.png" },
        { name: "Jeep",        logo: "/logos/jeep.png" },
        { name: "Ford",        logo: "/logos/ford.png" },
        { name: "Fiat",        logo: "/logos/fiat.png" },
        { name: "MG",          logo: "/logos/mg.png" },
        { name: "BYD",         logo: "/logos/byd.png" },
        { name: "Geely",       logo: "/logos/geely.png" },
        { name: "Chery",       logo: "/logos/chery.png" },
        { name: "BAIC",        logo: "/logos/baic.png" },
        { name: "JAC",         logo: "/logos/jac.png" },
        { name: "Haval",       logo: "/logos/haval.png" },
        { name: "Opel",        logo: "/logos/opel.png" },
        { name: "Subaru",      logo: "/logos/subaru.png" },
        { name: "Seat",        logo: "/logos/seat.png" },
        { name: "Volvo",       logo: "/logos/volvo.png" },
        { name: "Lada",        logo: "/logos/lada.png" },
      ];

      for (const brand of brands) {
        await db.query(
          "INSERT INTO car_brands (name, logo) VALUES (?, ?)",
          [brand.name, brand.logo]
        );
      }
      console.log(`Inserted ${brands.length} brands.`);
    }

    // ─── CATALOG ──────────────────────────────────────────────
    const [existingCatalog] = await db.query("SELECT COUNT(*) as count FROM car_catalog");
    if (existingCatalog[0].count > 0) {
      console.log("Car catalog already seeded, skipping...");
    } else {
      console.log("Seeding car catalog...");

      // Build a brand name → id map
      const [brandRows] = await db.query("SELECT id, name FROM car_brands");
      const B = {};
      brandRows.forEach(b => (B[b.name] = b.id));

      // Helper to insert one car and return its new id
      const insertCar = async (car) => {
        const [result] = await db.query(
          `INSERT INTO car_catalog
             (brand_id, name, type, year, image,
              weight, electric_range, top_speed, acceleration, power)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            B[car.brand], car.name, car.type, car.year, car.image,
            car.weight, car.electric_range, car.top_speed,
            car.acceleration, car.power,
          ]
        );
        return result.insertId;
      };

      // Helper to insert variants for a car
      const insertVariants = async (carId, variants) => {
        for (const v of variants) {
          await db.query(
            "INSERT INTO car_variants (car_id, name, transmission, fuel_type, price) VALUES (?, ?, ?, ?, ?)",
            [carId, v.name, v.transmission, v.fuel_type, v.price]
          );
        }
      };

      // ── TOYOTA ──────────────────────────────────────────────
      let id;

      id = await insertCar({ brand:"Toyota", name:"Toyota Corolla", type:"sedan", year:2024, image:"/cars/toyota-corolla.png", weight:"2,877lbs", electric_range:"N/A", top_speed:"125mph", acceleration:"9.2s", power:"139hp" });
      await insertVariants(id, [
        { name:"Corolla 1.6 GL",     transmission:"Manual",    fuel_type:"Petrol", price:18000 },
        { name:"Corolla 1.6 GLi",    transmission:"Automatic", fuel_type:"Petrol", price:20000 },
        { name:"Corolla 1.8 SE",     transmission:"Automatic", fuel_type:"Petrol", price:22000 },
        { name:"Corolla 2.0 XSE",    transmission:"Automatic", fuel_type:"Petrol", price:25000 },
      ]);

      id = await insertCar({ brand:"Toyota", name:"Toyota Camry", type:"sedan", year:2024, image:"/cars/toyota-camry.png", weight:"3,351lbs", electric_range:"N/A", top_speed:"135mph", acceleration:"8.4s", power:"203hp" });
      await insertVariants(id, [
        { name:"Camry 2.5 GL",       transmission:"Automatic", fuel_type:"Petrol", price:28000 },
        { name:"Camry 2.5 SE",       transmission:"Automatic", fuel_type:"Petrol", price:32000 },
        { name:"Camry 3.5 XSE V6",   transmission:"Automatic", fuel_type:"Petrol", price:38000 },
      ]);

      id = await insertCar({ brand:"Toyota", name:"Toyota Yaris", type:"hatchback", year:2024, image:"/cars/toyota-yaris.png", weight:"2,425lbs", electric_range:"N/A", top_speed:"106mph", acceleration:"10.9s", power:"106hp" });
      await insertVariants(id, [
        { name:"Yaris 1.3 Base",     transmission:"Manual",    fuel_type:"Petrol", price:13000 },
        { name:"Yaris 1.5 SE",       transmission:"Automatic", fuel_type:"Petrol", price:15500 },
      ]);

      id = await insertCar({ brand:"Toyota", name:"Toyota RAV4", type:"suv", year:2024, image:"/cars/toyota-rav4.png", weight:"3,786lbs", electric_range:"N/A", top_speed:"124mph", acceleration:"8.1s", power:"203hp" });
      await insertVariants(id, [
        { name:"RAV4 2.0 Base",      transmission:"Automatic", fuel_type:"Petrol", price:32000 },
        { name:"RAV4 2.5 XLE",       transmission:"Automatic", fuel_type:"Petrol", price:37000 },
        { name:"RAV4 Hybrid XLE",    transmission:"Automatic", fuel_type:"Hybrid",  price:42000 },
      ]);

      id = await insertCar({ brand:"Toyota", name:"Toyota Land Cruiser", type:"suv", year:2024, image:"/cars/toyota-lc.png", weight:"5,545lbs", electric_range:"N/A", top_speed:"130mph", acceleration:"7.4s", power:"409hp" });
      await insertVariants(id, [
        { name:"Land Cruiser GX",    transmission:"Automatic", fuel_type:"Petrol", price:75000 },
        { name:"Land Cruiser VX",    transmission:"Automatic", fuel_type:"Petrol", price:90000 },
        { name:"Land Cruiser GR",    transmission:"Automatic", fuel_type:"Petrol", price:100000 },
      ]);

      id = await insertCar({ brand:"Toyota", name:"Toyota Rush", type:"suv", year:2023, image:"/cars/toyota-rush.png", weight:"3,086lbs", electric_range:"N/A", top_speed:"106mph", acceleration:"11.5s", power:"104hp" });
      await insertVariants(id, [
        { name:"Rush 1.5 Base",      transmission:"Manual",    fuel_type:"Petrol", price:19000 },
        { name:"Rush 1.5 Sport",     transmission:"Automatic", fuel_type:"Petrol", price:22000 },
      ]);

      id = await insertCar({ brand:"Toyota", name:"Toyota Fortuner", type:"suv", year:2024, image:"/cars/toyota-fortuner.png", weight:"4,564lbs", electric_range:"N/A", top_speed:"106mph", acceleration:"10.4s", power:"166hp" });
      await insertVariants(id, [
        { name:"Fortuner 2.7 Base",  transmission:"Manual",    fuel_type:"Petrol", price:38000 },
        { name:"Fortuner 2.7 GXR",   transmission:"Automatic", fuel_type:"Petrol", price:43000 },
        { name:"Fortuner 2.8 Diesel",transmission:"Automatic", fuel_type:"Diesel",  price:48000 },
      ]);

      // ── HYUNDAI ─────────────────────────────────────────────
      id = await insertCar({ brand:"Hyundai", name:"Hyundai Elantra", type:"sedan", year:2024, image:"/cars/hyundai-elantra.png", weight:"2,967lbs", electric_range:"N/A", top_speed:"130mph", acceleration:"8.5s", power:"147hp" });
      await insertVariants(id, [
        { name:"Elantra 1.6 GL",     transmission:"Manual",    fuel_type:"Petrol", price:17000 },
        { name:"Elantra 1.6 GLi",    transmission:"Automatic", fuel_type:"Petrol", price:19500 },
        { name:"Elantra 2.0 GLS",    transmission:"Automatic", fuel_type:"Petrol", price:22000 },
      ]);

      id = await insertCar({ brand:"Hyundai", name:"Hyundai Tucson", type:"suv", year:2024, image:"/cars/hyundai-tucson.png", weight:"3,538lbs", electric_range:"N/A", top_speed:"125mph", acceleration:"9.0s", power:"187hp" });
      await insertVariants(id, [
        { name:"Tucson 2.0 GL",      transmission:"Automatic", fuel_type:"Petrol", price:28000 },
        { name:"Tucson 2.0 GLS",     transmission:"Automatic", fuel_type:"Petrol", price:33000 },
        { name:"Tucson 1.6T Sport",  transmission:"Automatic", fuel_type:"Petrol", price:38000 },
      ]);

      id = await insertCar({ brand:"Hyundai", name:"Hyundai Sonata", type:"sedan", year:2024, image:"/cars/hyundai-sonata.png", weight:"3,230lbs", electric_range:"N/A", top_speed:"130mph", acceleration:"7.9s", power:"180hp" });
      await insertVariants(id, [
        { name:"Sonata 2.0 GL",      transmission:"Automatic", fuel_type:"Petrol", price:24000 },
        { name:"Sonata 2.5 GLS",     transmission:"Automatic", fuel_type:"Petrol", price:29000 },
      ]);

      id = await insertCar({ brand:"Hyundai", name:"Hyundai Creta", type:"suv", year:2024, image:"/cars/hyundai-creta.png", weight:"2,954lbs", electric_range:"N/A", top_speed:"110mph", acceleration:"10.1s", power:"115hp" });
      await insertVariants(id, [
        { name:"Creta 1.5 Base",     transmission:"Manual",    fuel_type:"Petrol", price:20000 },
        { name:"Creta 1.5 Smart",    transmission:"Automatic", fuel_type:"Petrol", price:23000 },
        { name:"Creta 1.4T Sport",   transmission:"Automatic", fuel_type:"Petrol", price:27000 },
      ]);

      id = await insertCar({ brand:"Hyundai", name:"Hyundai Ioniq 5", type:"sedan", year:2024, image:"/cars/hyundai-ioniq5.png", weight:"4,497lbs", electric_range:"300km", top_speed:"115mph", acceleration:"5.1s", power:"320hp" });
      await insertVariants(id, [
        { name:"Ioniq 5 Standard",   transmission:"Automatic", fuel_type:"Electric", price:45000 },
        { name:"Ioniq 5 Long Range", transmission:"Automatic", fuel_type:"Electric", price:52000 },
        { name:"Ioniq 5 AWD",        transmission:"Automatic", fuel_type:"Electric", price:58000 },
      ]);

      id = await insertCar({ brand:"Hyundai", name:"Hyundai Accent", type:"sedan", year:2024, image:"/cars/hyundai-accent.png", weight:"2,634lbs", electric_range:"N/A", top_speed:"109mph", acceleration:"10.5s", power:"120hp" });
      await insertVariants(id, [
        { name:"Accent 1.4 Base",    transmission:"Manual",    fuel_type:"Petrol", price:14000 },
        { name:"Accent 1.6 GLS",     transmission:"Automatic", fuel_type:"Petrol", price:17000 },
      ]);

      // ── KIA ─────────────────────────────────────────────────
      id = await insertCar({ brand:"Kia", name:"Kia EV6", type:"sedan", year:2024, image:"/cars/kia-ev6.png", weight:"4,321lbs", electric_range:"528km", top_speed:"162mph", acceleration:"3.5s", power:"577hp" });
      await insertVariants(id, [
        { name:"EV6 Standard RWD",   transmission:"Automatic", fuel_type:"Electric", price:42000 },
        { name:"EV6 Long Range RWD", transmission:"Automatic", fuel_type:"Electric", price:48000 },
        { name:"EV6 Long Range AWD", transmission:"Automatic", fuel_type:"Electric", price:55000 },
        { name:"EV6 GT AWD",         transmission:"Automatic", fuel_type:"Electric", price:62000 },
      ]);

      id = await insertCar({ brand:"Kia", name:"Kia Sportage", type:"suv", year:2024, image:"/cars/kia-sportage.png", weight:"3,560lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"8.8s", power:"187hp" });
      await insertVariants(id, [
        { name:"Sportage 2.0 LX",    transmission:"Automatic", fuel_type:"Petrol", price:26000 },
        { name:"Sportage 2.0 EX",    transmission:"Automatic", fuel_type:"Petrol", price:30000 },
        { name:"Sportage 1.6T GT",   transmission:"Automatic", fuel_type:"Petrol", price:35000 },
      ]);

      id = await insertCar({ brand:"Kia", name:"Kia Seltos", type:"suv", year:2024, image:"/cars/kia-seltos.png", weight:"3,230lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"9.4s", power:"146hp" });
      await insertVariants(id, [
        { name:"Seltos 1.5 LX",      transmission:"Manual",    fuel_type:"Petrol", price:20000 },
        { name:"Seltos 1.5 EX",      transmission:"Automatic", fuel_type:"Petrol", price:24000 },
        { name:"Seltos 1.4T GT",     transmission:"Automatic", fuel_type:"Petrol", price:28000 },
      ]);

      id = await insertCar({ brand:"Kia", name:"Kia Cerato", type:"sedan", year:2024, image:"/cars/kia-cerato.png", weight:"2,975lbs", electric_range:"N/A", top_speed:"119mph", acceleration:"9.0s", power:"147hp" });
      await insertVariants(id, [
        { name:"Cerato 1.6 Base",    transmission:"Manual",    fuel_type:"Petrol", price:17000 },
        { name:"Cerato 1.6 EX",      transmission:"Automatic", fuel_type:"Petrol", price:20000 },
        { name:"Cerato 2.0 SX",      transmission:"Automatic", fuel_type:"Petrol", price:24000 },
      ]);

      id = await insertCar({ brand:"Kia", name:"Kia Sorento", type:"suv", year:2024, image:"/cars/kia-sorento.png", weight:"4,100lbs", electric_range:"N/A", top_speed:"125mph", acceleration:"7.7s", power:"281hp" });
      await insertVariants(id, [
        { name:"Sorento 2.5 LX",     transmission:"Automatic", fuel_type:"Petrol", price:34000 },
        { name:"Sorento 2.5 EX",     transmission:"Automatic", fuel_type:"Petrol", price:39000 },
        { name:"Sorento 2.5 SX",     transmission:"Automatic", fuel_type:"Petrol", price:45000 },
      ]);

      // ── NISSAN ──────────────────────────────────────────────
      id = await insertCar({ brand:"Nissan", name:"Nissan Sunny", type:"sedan", year:2024, image:"/cars/nissan-sunny.png", weight:"2,480lbs", electric_range:"N/A", top_speed:"109mph", acceleration:"11.3s", power:"99hp" });
      await insertVariants(id, [
        { name:"Sunny 1.5 Base",     transmission:"Manual",    fuel_type:"Petrol", price:13000 },
        { name:"Sunny 1.5 SV",       transmission:"Automatic", fuel_type:"Petrol", price:15500 },
      ]);

      id = await insertCar({ brand:"Nissan", name:"Nissan Qashqai", type:"suv", year:2024, image:"/cars/nissan-qashqai.png", weight:"3,252lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"9.3s", power:"140hp" });
      await insertVariants(id, [
        { name:"Qashqai 1.3T Base",  transmission:"Manual",    fuel_type:"Petrol", price:25000 },
        { name:"Qashqai 1.3T SV",    transmission:"Automatic", fuel_type:"Petrol", price:29000 },
      ]);

      id = await insertCar({ brand:"Nissan", name:"Nissan X-Trail", type:"suv", year:2024, image:"/cars/nissan-xtrail.png", weight:"3,890lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"9.8s", power:"158hp" });
      await insertVariants(id, [
        { name:"X-Trail 2.0 SV",     transmission:"Automatic", fuel_type:"Petrol", price:30000 },
        { name:"X-Trail 2.5 SL",     transmission:"Automatic", fuel_type:"Petrol", price:36000 },
      ]);

      id = await insertCar({ brand:"Nissan", name:"Nissan Patrol", type:"suv", year:2024, image:"/cars/nissan-patrol.png", weight:"5,900lbs", electric_range:"N/A", top_speed:"124mph", acceleration:"7.0s", power:"400hp" });
      await insertVariants(id, [
        { name:"Patrol SE 4.0 V6",   transmission:"Automatic", fuel_type:"Petrol", price:65000 },
        { name:"Patrol SE 5.6 V8",   transmission:"Automatic", fuel_type:"Petrol", price:80000 },
        { name:"Patrol Platinum V8", transmission:"Automatic", fuel_type:"Petrol", price:95000 },
      ]);

      id = await insertCar({ brand:"Nissan", name:"Nissan Sentra", type:"sedan", year:2024, image:"/cars/nissan-sentra.png", weight:"2,920lbs", electric_range:"N/A", top_speed:"124mph", acceleration:"8.4s", power:"149hp" });
      await insertVariants(id, [
        { name:"Sentra 1.6 Base",    transmission:"Manual",    fuel_type:"Petrol", price:16000 },
        { name:"Sentra 2.0 SV",      transmission:"Automatic", fuel_type:"Petrol", price:19500 },
      ]);

      // ── CHEVROLET ───────────────────────────────────────────
      id = await insertCar({ brand:"Chevrolet", name:"Chevrolet Optra", type:"sedan", year:2023, image:"/cars/chevy-optra.png", weight:"2,866lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"9.7s", power:"115hp" });
      await insertVariants(id, [
        { name:"Optra 1.6 Base",     transmission:"Manual",    fuel_type:"Petrol", price:14000 },
        { name:"Optra 1.8 LS",       transmission:"Automatic", fuel_type:"Petrol", price:17000 },
      ]);

      id = await insertCar({ brand:"Chevrolet", name:"Chevrolet Captiva", type:"suv", year:2024, image:"/cars/chevy-captiva.png", weight:"3,946lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"10.5s", power:"140hp" });
      await insertVariants(id, [
        { name:"Captiva 1.5T Base",  transmission:"Automatic", fuel_type:"Petrol", price:24000 },
        { name:"Captiva 1.5T LT",    transmission:"Automatic", fuel_type:"Petrol", price:28000 },
      ]);

      id = await insertCar({ brand:"Chevrolet", name:"Chevrolet Aveo", type:"hatchback", year:2023, image:"/cars/chevy-aveo.png", weight:"2,315lbs", electric_range:"N/A", top_speed:"106mph", acceleration:"11.0s", power:"98hp" });
      await insertVariants(id, [
        { name:"Aveo 1.4 Base",      transmission:"Manual",    fuel_type:"Petrol", price:11000 },
        { name:"Aveo 1.6 LT",        transmission:"Automatic", fuel_type:"Petrol", price:13500 },
      ]);

      id = await insertCar({ brand:"Chevrolet", name:"Chevrolet Traverse", type:"suv", year:2024, image:"/cars/chevy-traverse.png", weight:"4,498lbs", electric_range:"N/A", top_speed:"117mph", acceleration:"7.5s", power:"310hp" });
      await insertVariants(id, [
        { name:"Traverse LS",        transmission:"Automatic", fuel_type:"Petrol", price:40000 },
        { name:"Traverse LT",        transmission:"Automatic", fuel_type:"Petrol", price:46000 },
        { name:"Traverse Premier",   transmission:"Automatic", fuel_type:"Petrol", price:52000 },
      ]);

      // ── PEUGEOT ─────────────────────────────────────────────
      id = await insertCar({ brand:"Peugeot", name:"Peugeot 208", type:"hatchback", year:2024, image:"/cars/peugeot-208.png", weight:"2,459lbs", electric_range:"N/A", top_speed:"121mph", acceleration:"9.4s", power:"101hp" });
      await insertVariants(id, [
        { name:"208 1.2 Active",     transmission:"Manual",    fuel_type:"Petrol", price:15000 },
        { name:"208 1.2T Allure",    transmission:"Automatic", fuel_type:"Petrol", price:18000 },
        { name:"e-208 Electric",     transmission:"Automatic", fuel_type:"Electric", price:28000 },
      ]);

      id = await insertCar({ brand:"Peugeot", name:"Peugeot 301", type:"sedan", year:2024, image:"/cars/peugeot-301.png", weight:"2,601lbs", electric_range:"N/A", top_speed:"115mph", acceleration:"10.9s", power:"110hp" });
      await insertVariants(id, [
        { name:"301 1.6 Active",     transmission:"Manual",    fuel_type:"Petrol", price:16000 },
        { name:"301 1.6 Allure",     transmission:"Automatic", fuel_type:"Petrol", price:19000 },
      ]);

      id = await insertCar({ brand:"Peugeot", name:"Peugeot 2008", type:"suv", year:2024, image:"/cars/peugeot-2008.png", weight:"3,021lbs", electric_range:"N/A", top_speed:"117mph", acceleration:"9.7s", power:"131hp" });
      await insertVariants(id, [
        { name:"2008 1.2T Active",   transmission:"Manual",    fuel_type:"Petrol", price:22000 },
        { name:"2008 1.2T Allure",   transmission:"Automatic", fuel_type:"Petrol", price:26000 },
        { name:"e-2008 Electric",    transmission:"Automatic", fuel_type:"Electric", price:36000 },
      ]);

      id = await insertCar({ brand:"Peugeot", name:"Peugeot 508", type:"sedan", year:2024, image:"/cars/peugeot-508.png", weight:"3,395lbs", electric_range:"N/A", top_speed:"143mph", acceleration:"8.5s", power:"181hp" });
      await insertVariants(id, [
        { name:"508 1.6T Allure",    transmission:"Automatic", fuel_type:"Petrol", price:32000 },
        { name:"508 1.6T GT",        transmission:"Automatic", fuel_type:"Petrol", price:38000 },
      ]);

      // ── RENAULT ─────────────────────────────────────────────
      id = await insertCar({ brand:"Renault", name:"Renault Megane", type:"sedan", year:2024, image:"/cars/renault-megane.png", weight:"2,900lbs", electric_range:"N/A", top_speed:"121mph", acceleration:"9.5s", power:"115hp" });
      await insertVariants(id, [
        { name:"Megane 1.5D Base",   transmission:"Manual",    fuel_type:"Diesel",  price:17000 },
        { name:"Megane 1.6 Life",    transmission:"Manual",    fuel_type:"Petrol", price:16000 },
        { name:"Megane 1.6 Zen",     transmission:"Automatic", fuel_type:"Petrol", price:20000 },
      ]);

      id = await insertCar({ brand:"Renault", name:"Renault Duster", type:"suv", year:2024, image:"/cars/renault-duster.png", weight:"3,080lbs", electric_range:"N/A", top_speed:"106mph", acceleration:"11.2s", power:"115hp" });
      await insertVariants(id, [
        { name:"Duster 1.6 Base",    transmission:"Manual",    fuel_type:"Petrol", price:18000 },
        { name:"Duster 1.3T Zen",    transmission:"Automatic", fuel_type:"Petrol", price:22000 },
      ]);

      id = await insertCar({ brand:"Renault", name:"Renault Logan", type:"sedan", year:2023, image:"/cars/renault-logan.png", weight:"2,403lbs", electric_range:"N/A", top_speed:"106mph", acceleration:"12.0s", power:"90hp" });
      await insertVariants(id, [
        { name:"Logan 1.4 Base",     transmission:"Manual",    fuel_type:"Petrol", price:12000 },
        { name:"Logan 1.6 Zen",      transmission:"Automatic", fuel_type:"Petrol", price:15000 },
      ]);

      // ── VOLKSWAGEN ──────────────────────────────────────────
      id = await insertCar({ brand:"Volkswagen", name:"Volkswagen Polo", type:"hatchback", year:2024, image:"/cars/vw-polo.png", weight:"2,525lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"9.9s", power:"95hp" });
      await insertVariants(id, [
        { name:"Polo 1.0 Trendline", transmission:"Manual",    fuel_type:"Petrol", price:16000 },
        { name:"Polo 1.0T Comfortline",transmission:"Automatic",fuel_type:"Petrol", price:20000 },
      ]);

      id = await insertCar({ brand:"Volkswagen", name:"Volkswagen Tiguan", type:"suv", year:2024, image:"/cars/vw-tiguan.png", weight:"3,769lbs", electric_range:"N/A", top_speed:"130mph", acceleration:"7.8s", power:"184hp" });
      await insertVariants(id, [
        { name:"Tiguan 1.4T Trendline",transmission:"Automatic",fuel_type:"Petrol", price:32000 },
        { name:"Tiguan 2.0T Highline",transmission:"Automatic", fuel_type:"Petrol", price:40000 },
      ]);

      id = await insertCar({ brand:"Volkswagen", name:"Volkswagen Passat", type:"sedan", year:2024, image:"/cars/vw-passat.png", weight:"3,571lbs", electric_range:"N/A", top_speed:"130mph", acceleration:"8.0s", power:"150hp" });
      await insertVariants(id, [
        { name:"Passat 1.8T Comfortline",transmission:"Automatic",fuel_type:"Petrol", price:30000 },
        { name:"Passat 2.0T Highline",transmission:"Automatic", fuel_type:"Petrol", price:37000 },
      ]);

      // ── BMW ─────────────────────────────────────────────────
      id = await insertCar({ brand:"BMW", name:"BMW 3 Series", type:"sedan", year:2024, image:"/cars/bmw-3.png", weight:"3,582lbs", electric_range:"N/A", top_speed:"155mph", acceleration:"5.8s", power:"255hp" });
      await insertVariants(id, [
        { name:"320i Sport",         transmission:"Automatic", fuel_type:"Petrol", price:45000 },
        { name:"330i M Sport",       transmission:"Automatic", fuel_type:"Petrol", price:55000 },
        { name:"M340i xDrive",       transmission:"Automatic", fuel_type:"Petrol", price:65000 },
      ]);

      id = await insertCar({ brand:"BMW", name:"BMW 5 Series", type:"sedan", year:2024, image:"/cars/bmw-5.png", weight:"4,016lbs", electric_range:"N/A", top_speed:"155mph", acceleration:"5.4s", power:"335hp" });
      await insertVariants(id, [
        { name:"520i Luxury",        transmission:"Automatic", fuel_type:"Petrol", price:58000 },
        { name:"530i M Sport",       transmission:"Automatic", fuel_type:"Petrol", price:68000 },
        { name:"550i xDrive",        transmission:"Automatic", fuel_type:"Petrol", price:82000 },
      ]);

      id = await insertCar({ brand:"BMW", name:"BMW X5", type:"suv", year:2024, image:"/cars/bmw-x5.png", weight:"4,739lbs", electric_range:"N/A", top_speed:"155mph", acceleration:"5.3s", power:"335hp" });
      await insertVariants(id, [
        { name:"X5 xDrive40i",       transmission:"Automatic", fuel_type:"Petrol", price:72000 },
        { name:"X5 xDrive50i",       transmission:"Automatic", fuel_type:"Petrol", price:88000 },
        { name:"X5 M Competition",   transmission:"Automatic", fuel_type:"Petrol", price:110000 },
      ]);

      id = await insertCar({ brand:"BMW", name:"BMW X1", type:"suv", year:2024, image:"/cars/bmw-x1.png", weight:"3,671lbs", electric_range:"N/A", top_speed:"130mph", acceleration:"6.8s", power:"228hp" });
      await insertVariants(id, [
        { name:"X1 sDrive18i",       transmission:"Automatic", fuel_type:"Petrol", price:40000 },
        { name:"X1 xDrive28i",       transmission:"Automatic", fuel_type:"Petrol", price:48000 },
      ]);

      // ── MERCEDES-BENZ ───────────────────────────────────────
      id = await insertCar({ brand:"Mercedes-Benz", name:"Mercedes C-Class", type:"sedan", year:2024, image:"/cars/mercedes-c.png", weight:"3,836lbs", electric_range:"N/A", top_speed:"155mph", acceleration:"6.0s", power:"255hp" });
      await insertVariants(id, [
        { name:"C200 Avantgarde",    transmission:"Automatic", fuel_type:"Petrol", price:52000 },
        { name:"C300 AMG Line",      transmission:"Automatic", fuel_type:"Petrol", price:62000 },
        { name:"C43 AMG",            transmission:"Automatic", fuel_type:"Petrol", price:78000 },
      ]);

      id = await insertCar({ brand:"Mercedes-Benz", name:"Mercedes E-Class", type:"sedan", year:2024, image:"/cars/mercedes-e.png", weight:"4,145lbs", electric_range:"N/A", top_speed:"155mph", acceleration:"5.5s", power:"362hp" });
      await insertVariants(id, [
        { name:"E200 Avantgarde",    transmission:"Automatic", fuel_type:"Petrol", price:65000 },
        { name:"E300 AMG Line",      transmission:"Automatic", fuel_type:"Petrol", price:78000 },
        { name:"E53 AMG 4Matic",     transmission:"Automatic", fuel_type:"Petrol", price:98000 },
      ]);

      id = await insertCar({ brand:"Mercedes-Benz", name:"Mercedes GLE", type:"suv", year:2024, image:"/cars/mercedes-gle.png", weight:"4,938lbs", electric_range:"N/A", top_speed:"155mph", acceleration:"6.0s", power:"362hp" });
      await insertVariants(id, [
        { name:"GLE 300d 4Matic",    transmission:"Automatic", fuel_type:"Diesel",  price:80000 },
        { name:"GLE 450 4Matic",     transmission:"Automatic", fuel_type:"Petrol", price:92000 },
        { name:"AMG GLE 53 4Matic",  transmission:"Automatic", fuel_type:"Petrol", price:110000 },
      ]);

      id = await insertCar({ brand:"Mercedes-Benz", name:"Mercedes A-Class", type:"hatchback", year:2024, image:"/cars/mercedes-a.png", weight:"3,131lbs", electric_range:"N/A", top_speed:"155mph", acceleration:"7.1s", power:"163hp" });
      await insertVariants(id, [
        { name:"A180 Progressive",   transmission:"Automatic", fuel_type:"Petrol", price:38000 },
        { name:"A200 AMG Line",      transmission:"Automatic", fuel_type:"Petrol", price:44000 },
        { name:"A35 AMG",            transmission:"Automatic", fuel_type:"Petrol", price:58000 },
      ]);

      // ── AUDI ────────────────────────────────────────────────
      id = await insertCar({ brand:"Audi", name:"Audi A3", type:"sedan", year:2024, image:"/cars/audi-a3.png", weight:"3,263lbs", electric_range:"N/A", top_speed:"130mph", acceleration:"7.4s", power:"150hp" });
      await insertVariants(id, [
        { name:"A3 1.4T Attraction",  transmission:"Automatic", fuel_type:"Petrol", price:38000 },
        { name:"A3 2.0T Sport",       transmission:"Automatic", fuel_type:"Petrol", price:45000 },
        { name:"S3 2.0T quattro",     transmission:"Automatic", fuel_type:"Petrol", price:55000 },
      ]);

      id = await insertCar({ brand:"Audi", name:"Audi Q5", type:"suv", year:2024, image:"/cars/audi-q5.png", weight:"4,266lbs", electric_range:"N/A", top_speed:"155mph", acceleration:"5.9s", power:"261hp" });
      await insertVariants(id, [
        { name:"Q5 2.0T Sport",       transmission:"Automatic", fuel_type:"Petrol", price:55000 },
        { name:"Q5 2.0T quattro",     transmission:"Automatic", fuel_type:"Petrol", price:65000 },
        { name:"SQ5 3.0T quattro",    transmission:"Automatic", fuel_type:"Petrol", price:78000 },
      ]);

      // ── HONDA ───────────────────────────────────────────────
      id = await insertCar({ brand:"Honda", name:"Honda Civic", type:"sedan", year:2024, image:"/cars/honda-civic.png", weight:"2,944lbs", electric_range:"N/A", top_speed:"137mph", acceleration:"8.1s", power:"158hp" });
      await insertVariants(id, [
        { name:"Civic 1.5T LX",      transmission:"Manual",    fuel_type:"Petrol", price:20000 },
        { name:"Civic 1.5T Sport",   transmission:"Automatic", fuel_type:"Petrol", price:24000 },
        { name:"Civic 1.5T Touring", transmission:"Automatic", fuel_type:"Petrol", price:28000 },
      ]);

      id = await insertCar({ brand:"Honda", name:"Honda CR-V", type:"suv", year:2024, image:"/cars/honda-crv.png", weight:"3,497lbs", electric_range:"N/A", top_speed:"119mph", acceleration:"8.6s", power:"190hp" });
      await insertVariants(id, [
        { name:"CR-V 1.5T LX",       transmission:"Automatic", fuel_type:"Petrol", price:30000 },
        { name:"CR-V 1.5T EX",       transmission:"Automatic", fuel_type:"Petrol", price:35000 },
        { name:"CR-V Hybrid",        transmission:"Automatic", fuel_type:"Hybrid",  price:40000 },
      ]);

      id = await insertCar({ brand:"Honda", name:"Honda City", type:"sedan", year:2024, image:"/cars/honda-city.png", weight:"2,601lbs", electric_range:"N/A", top_speed:"115mph", acceleration:"10.5s", power:"119hp" });
      await insertVariants(id, [
        { name:"City 1.5 LX",        transmission:"Manual",    fuel_type:"Petrol", price:16000 },
        { name:"City 1.5 EX",        transmission:"Automatic", fuel_type:"Petrol", price:19000 },
      ]);

      // ── MITSUBISHI ──────────────────────────────────────────
      id = await insertCar({ brand:"Mitsubishi", name:"Mitsubishi Lancer", type:"sedan", year:2023, image:"/cars/mitsubishi-lancer.png", weight:"2,800lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"9.5s", power:"148hp" });
      await insertVariants(id, [
        { name:"Lancer 1.6 GLX",     transmission:"Manual",    fuel_type:"Petrol", price:14000 },
        { name:"Lancer 2.0 GLS",     transmission:"Automatic", fuel_type:"Petrol", price:17000 },
      ]);

      id = await insertCar({ brand:"Mitsubishi", name:"Mitsubishi Eclipse Cross", type:"suv", year:2024, image:"/cars/mitsubishi-eclipse.png", weight:"3,549lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"8.8s", power:"152hp" });
      await insertVariants(id, [
        { name:"Eclipse Cross 1.5T Base",transmission:"Automatic",fuel_type:"Petrol", price:26000 },
        { name:"Eclipse Cross 2.0 Sport",transmission:"Automatic",fuel_type:"Petrol", price:30000 },
      ]);

      id = await insertCar({ brand:"Mitsubishi", name:"Mitsubishi Outlander", type:"suv", year:2024, image:"/cars/mitsubishi-outlander.png", weight:"4,012lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"9.5s", power:"181hp" });
      await insertVariants(id, [
        { name:"Outlander 2.5 ES",   transmission:"Automatic", fuel_type:"Petrol", price:32000 },
        { name:"Outlander PHEV",     transmission:"Automatic", fuel_type:"Hybrid",  price:42000 },
      ]);

      // ── SUZUKI ──────────────────────────────────────────────
      id = await insertCar({ brand:"Suzuki", name:"Suzuki Swift", type:"hatchback", year:2024, image:"/cars/suzuki-swift.png", weight:"2,094lbs", electric_range:"N/A", top_speed:"109mph", acceleration:"10.7s", power:"90hp" });
      await insertVariants(id, [
        { name:"Swift 1.2 GL",       transmission:"Manual",    fuel_type:"Petrol", price:12000 },
        { name:"Swift 1.2 GLX",      transmission:"Automatic", fuel_type:"Petrol", price:14500 },
      ]);

      id = await insertCar({ brand:"Suzuki", name:"Suzuki Vitara", type:"suv", year:2024, image:"/cars/suzuki-vitara.png", weight:"2,734lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"9.8s", power:"128hp" });
      await insertVariants(id, [
        { name:"Vitara 1.4T GL",     transmission:"Manual",    fuel_type:"Petrol", price:20000 },
        { name:"Vitara 1.4T GLX",    transmission:"Automatic", fuel_type:"Petrol", price:24000 },
      ]);

      id = await insertCar({ brand:"Suzuki", name:"Suzuki Baleno", type:"hatchback", year:2024, image:"/cars/suzuki-baleno.png", weight:"2,082lbs", electric_range:"N/A", top_speed:"106mph", acceleration:"11.5s", power:"88hp" });
      await insertVariants(id, [
        { name:"Baleno 1.2 GL",      transmission:"Manual",    fuel_type:"Petrol", price:11000 },
        { name:"Baleno 1.2 GLX",     transmission:"Automatic", fuel_type:"Petrol", price:13500 },
      ]);

      // ── MG ──────────────────────────────────────────────────
      id = await insertCar({ brand:"MG", name:"MG5", type:"sedan", year:2024, image:"/cars/mg5.png", weight:"2,954lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"9.0s", power:"140hp" });
      await insertVariants(id, [
        { name:"MG5 1.5T Base",      transmission:"Manual",    fuel_type:"Petrol", price:15000 },
        { name:"MG5 1.5T Luxury",    transmission:"Automatic", fuel_type:"Petrol", price:18000 },
      ]);

      id = await insertCar({ brand:"MG", name:"MG ZS", type:"suv", year:2024, image:"/cars/mg-zs.png", weight:"2,954lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"9.5s", power:"106hp" });
      await insertVariants(id, [
        { name:"ZS 1.5 Comfort",     transmission:"Manual",    fuel_type:"Petrol", price:19000 },
        { name:"ZS 1.5 Luxury",      transmission:"Automatic", fuel_type:"Petrol", price:22000 },
        { name:"ZS EV Electric",     transmission:"Automatic", fuel_type:"Electric", price:32000 },
      ]);

      id = await insertCar({ brand:"MG", name:"MG HS", type:"suv", year:2024, image:"/cars/mg-hs.png", weight:"3,527lbs", electric_range:"N/A", top_speed:"124mph", acceleration:"8.2s", power:"162hp" });
      await insertVariants(id, [
        { name:"HS 1.5T Comfort",    transmission:"Automatic", fuel_type:"Petrol", price:25000 },
        { name:"HS 2.0T Luxury",     transmission:"Automatic", fuel_type:"Petrol", price:30000 },
        { name:"HS PHEV",            transmission:"Automatic", fuel_type:"Hybrid",  price:38000 },
      ]);

      // ── BYD ─────────────────────────────────────────────────
      id = await insertCar({ brand:"BYD", name:"BYD Atto 3", type:"suv", year:2024, image:"/cars/byd-atto3.png", weight:"4,189lbs", electric_range:"420km", top_speed:"100mph", acceleration:"7.3s", power:"204hp" });
      await insertVariants(id, [
        { name:"Atto 3 Standard",    transmission:"Automatic", fuel_type:"Electric", price:35000 },
        { name:"Atto 3 Extended",    transmission:"Automatic", fuel_type:"Electric", price:40000 },
      ]);

      id = await insertCar({ brand:"BYD", name:"BYD Seal", type:"sedan", year:2024, image:"/cars/byd-seal.png", weight:"4,299lbs", electric_range:"570km", top_speed:"180mph", acceleration:"3.8s", power:"530hp" });
      await insertVariants(id, [
        { name:"Seal Standard RWD",  transmission:"Automatic", fuel_type:"Electric", price:38000 },
        { name:"Seal Performance AWD",transmission:"Automatic",fuel_type:"Electric", price:48000 },
      ]);

      id = await insertCar({ brand:"BYD", name:"BYD Dolphin", type:"hatchback", year:2024, image:"/cars/byd-dolphin.png", weight:"3,240lbs", electric_range:"340km", top_speed:"93mph", acceleration:"7.0s", power:"177hp" });
      await insertVariants(id, [
        { name:"Dolphin Standard",   transmission:"Automatic", fuel_type:"Electric", price:27000 },
        { name:"Dolphin Extended",   transmission:"Automatic", fuel_type:"Electric", price:31000 },
      ]);

      // ── GEELY ───────────────────────────────────────────────
      id = await insertCar({ brand:"Geely", name:"Geely Emgrand", type:"sedan", year:2024, image:"/cars/geely-emgrand.png", weight:"2,712lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"10.2s", power:"122hp" });
      await insertVariants(id, [
        { name:"Emgrand 1.5 Base",   transmission:"Manual",    fuel_type:"Petrol", price:13000 },
        { name:"Emgrand 1.5 Luxury", transmission:"Automatic", fuel_type:"Petrol", price:16000 },
      ]);

      id = await insertCar({ brand:"Geely", name:"Geely Coolray", type:"suv", year:2024, image:"/cars/geely-coolray.png", weight:"2,954lbs", electric_range:"N/A", top_speed:"124mph", acceleration:"7.9s", power:"177hp" });
      await insertVariants(id, [
        { name:"Coolray 1.5T Comfort",transmission:"Automatic", fuel_type:"Petrol", price:22000 },
        { name:"Coolray 1.5T Sport", transmission:"Automatic", fuel_type:"Petrol", price:26000 },
      ]);

      // ── CHERY ───────────────────────────────────────────────
      id = await insertCar({ brand:"Chery", name:"Chery Tiggo 4", type:"suv", year:2024, image:"/cars/chery-tiggo4.png", weight:"3,086lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"10.0s", power:"145hp" });
      await insertVariants(id, [
        { name:"Tiggo 4 1.5 Base",   transmission:"Manual",    fuel_type:"Petrol", price:18000 },
        { name:"Tiggo 4 1.5T Luxury",transmission:"Automatic", fuel_type:"Petrol", price:22000 },
      ]);

      id = await insertCar({ brand:"Chery", name:"Chery Tiggo 7", type:"suv", year:2024, image:"/cars/chery-tiggo7.png", weight:"3,571lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"8.5s", power:"197hp" });
      await insertVariants(id, [
        { name:"Tiggo 7 2.0T Base",  transmission:"Automatic", fuel_type:"Petrol", price:26000 },
        { name:"Tiggo 7 Pro Luxury", transmission:"Automatic", fuel_type:"Petrol", price:30000 },
      ]);

      id = await insertCar({ brand:"Chery", name:"Chery Arrizo 6", type:"sedan", year:2024, image:"/cars/chery-arrizo6.png", weight:"2,866lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"9.0s", power:"145hp" });
      await insertVariants(id, [
        { name:"Arrizo 6 1.5T Base", transmission:"Manual",    fuel_type:"Petrol", price:16000 },
        { name:"Arrizo 6 1.5T Luxury",transmission:"Automatic",fuel_type:"Petrol", price:19000 },
      ]);

      // ── HAVAL ───────────────────────────────────────────────
      id = await insertCar({ brand:"Haval", name:"Haval H6", type:"suv", year:2024, image:"/cars/haval-h6.png", weight:"3,858lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"8.0s", power:"197hp" });
      await insertVariants(id, [
        { name:"H6 2.0T Base",       transmission:"Automatic", fuel_type:"Petrol", price:28000 },
        { name:"H6 2.0T Luxury",     transmission:"Automatic", fuel_type:"Petrol", price:33000 },
      ]);

      id = await insertCar({ brand:"Haval", name:"Haval Jolion", type:"suv", year:2024, image:"/cars/haval-jolion.png", weight:"3,197lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"9.0s", power:"147hp" });
      await insertVariants(id, [
        { name:"Jolion 1.5T Comfort", transmission:"Automatic", fuel_type:"Petrol", price:22000 },
        { name:"Jolion HEV Hybrid",   transmission:"Automatic", fuel_type:"Hybrid",  price:28000 },
      ]);

      // ── JAC ─────────────────────────────────────────────────
      id = await insertCar({ brand:"JAC", name:"JAC J7", type:"sedan", year:2024, image:"/cars/jac-j7.png", weight:"2,866lbs", electric_range:"N/A", top_speed:"124mph", acceleration:"8.5s", power:"163hp" });
      await insertVariants(id, [
        { name:"J7 1.5T Base",       transmission:"Manual",    fuel_type:"Petrol", price:15000 },
        { name:"J7 1.5T Luxury",     transmission:"Automatic", fuel_type:"Petrol", price:18500 },
      ]);

      id = await insertCar({ brand:"JAC", name:"JAC S3", type:"suv", year:2023, image:"/cars/jac-s3.png", weight:"2,954lbs", electric_range:"N/A", top_speed:"106mph", acceleration:"11.0s", power:"122hp" });
      await insertVariants(id, [
        { name:"S3 1.6 Base",        transmission:"Manual",    fuel_type:"Petrol", price:16000 },
        { name:"S3 1.6 Luxury",      transmission:"Automatic", fuel_type:"Petrol", price:19000 },
      ]);

      // ── SKODA ───────────────────────────────────────────────
      id = await insertCar({ brand:"Skoda", name:"Skoda Octavia", type:"sedan", year:2024, image:"/cars/skoda-octavia.png", weight:"3,197lbs", electric_range:"N/A", top_speed:"136mph", acceleration:"8.0s", power:"150hp" });
      await insertVariants(id, [
        { name:"Octavia 1.0T Active", transmission:"Manual",    fuel_type:"Petrol", price:22000 },
        { name:"Octavia 1.5T Ambition",transmission:"Automatic",fuel_type:"Petrol", price:28000 },
        { name:"Octavia RS 2.0T",     transmission:"Automatic", fuel_type:"Petrol", price:38000 },
      ]);

      id = await insertCar({ brand:"Skoda", name:"Skoda Kamiq", type:"suv", year:2024, image:"/cars/skoda-kamiq.png", weight:"2,954lbs", electric_range:"N/A", top_speed:"115mph", acceleration:"9.5s", power:"109hp" });
      await insertVariants(id, [
        { name:"Kamiq 1.0T Active",  transmission:"Manual",    fuel_type:"Petrol", price:20000 },
        { name:"Kamiq 1.5T Ambition",transmission:"Automatic", fuel_type:"Petrol", price:25000 },
      ]);

      // ── JEEP ────────────────────────────────────────────────
      id = await insertCar({ brand:"Jeep", name:"Jeep Wrangler", type:"suv", year:2024, image:"/cars/jeep-wrangler.png", weight:"4,439lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"8.9s", power:"285hp" });
      await insertVariants(id, [
        { name:"Wrangler Sport 2D",  transmission:"Manual",    fuel_type:"Petrol", price:42000 },
        { name:"Wrangler Sahara 4D", transmission:"Automatic", fuel_type:"Petrol", price:52000 },
        { name:"Wrangler Rubicon",   transmission:"Automatic", fuel_type:"Petrol", price:62000 },
        { name:"Wrangler 4xe PHEV",  transmission:"Automatic", fuel_type:"Hybrid",  price:68000 },
      ]);

      id = await insertCar({ brand:"Jeep", name:"Jeep Grand Cherokee", type:"suv", year:2024, image:"/cars/jeep-gc.png", weight:"4,956lbs", electric_range:"N/A", top_speed:"130mph", acceleration:"6.3s", power:"357hp" });
      await insertVariants(id, [
        { name:"Grand Cherokee Laredo",transmission:"Automatic",fuel_type:"Petrol", price:50000 },
        { name:"Grand Cherokee Limited",transmission:"Automatic",fuel_type:"Petrol", price:60000 },
        { name:"Grand Cherokee Summit",transmission:"Automatic",fuel_type:"Petrol", price:72000 },
      ]);

      // ── FORD ────────────────────────────────────────────────
      id = await insertCar({ brand:"Ford", name:"Ford Focus", type:"hatchback", year:2023, image:"/cars/ford-focus.png", weight:"2,960lbs", electric_range:"N/A", top_speed:"124mph", acceleration:"8.5s", power:"160hp" });
      await insertVariants(id, [
        { name:"Focus 1.5T Trend",   transmission:"Manual",    fuel_type:"Petrol", price:20000 },
        { name:"Focus 1.5T Titanium",transmission:"Automatic", fuel_type:"Petrol", price:25000 },
      ]);

      id = await insertCar({ brand:"Ford", name:"Ford Explorer", type:"suv", year:2024, image:"/cars/ford-explorer.png", weight:"4,496lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"7.0s", power:"300hp" });
      await insertVariants(id, [
        { name:"Explorer XLT 2.3T",  transmission:"Automatic", fuel_type:"Petrol", price:42000 },
        { name:"Explorer Limited",   transmission:"Automatic", fuel_type:"Petrol", price:52000 },
        { name:"Explorer Platinum",  transmission:"Automatic", fuel_type:"Petrol", price:62000 },
      ]);

      // ── OPEL ────────────────────────────────────────────────
      id = await insertCar({ brand:"Opel", name:"Opel Astra", type:"hatchback", year:2024, image:"/cars/opel-astra.png", weight:"2,976lbs", electric_range:"N/A", top_speed:"130mph", acceleration:"8.0s", power:"130hp" });
      await insertVariants(id, [
        { name:"Astra 1.2T Edition",  transmission:"Manual",    fuel_type:"Petrol", price:20000 },
        { name:"Astra 1.4T Elegance", transmission:"Automatic", fuel_type:"Petrol", price:25000 },
        { name:"Astra Electric",      transmission:"Automatic", fuel_type:"Electric", price:35000 },
      ]);

      id = await insertCar({ brand:"Opel", name:"Opel Grandland", type:"suv", year:2024, image:"/cars/opel-grandland.png", weight:"3,638lbs", electric_range:"N/A", top_speed:"124mph", acceleration:"8.5s", power:"130hp" });
      await insertVariants(id, [
        { name:"Grandland 1.2T Base",transmission:"Manual",    fuel_type:"Petrol", price:26000 },
        { name:"Grandland 1.5D GS",  transmission:"Automatic", fuel_type:"Diesel",  price:30000 },
        { name:"Grandland PHEV",     transmission:"Automatic", fuel_type:"Hybrid",  price:38000 },
      ]);

      // ── VOLVO ───────────────────────────────────────────────
      id = await insertCar({ brand:"Volvo", name:"Volvo XC60", type:"suv", year:2024, image:"/cars/volvo-xc60.png", weight:"4,255lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"6.8s", power:"250hp" });
      await insertVariants(id, [
        { name:"XC60 B5 Core",       transmission:"Automatic", fuel_type:"Petrol", price:55000 },
        { name:"XC60 B5 Plus",       transmission:"Automatic", fuel_type:"Petrol", price:65000 },
        { name:"XC60 Recharge PHEV", transmission:"Automatic", fuel_type:"Hybrid",  price:75000 },
      ]);

      id = await insertCar({ brand:"Volvo", name:"Volvo S90", type:"sedan", year:2024, image:"/cars/volvo-s90.png", weight:"4,299lbs", electric_range:"N/A", top_speed:"112mph", acceleration:"5.9s", power:"300hp" });
      await insertVariants(id, [
        { name:"S90 B6 Plus",        transmission:"Automatic", fuel_type:"Petrol", price:65000 },
        { name:"S90 Recharge PHEV",  transmission:"Automatic", fuel_type:"Hybrid",  price:78000 },
      ]);

      // ── SUBARU ──────────────────────────────────────────────
      id = await insertCar({ brand:"Subaru", name:"Subaru Forester", type:"suv", year:2024, image:"/cars/subaru-forester.png", weight:"3,494lbs", electric_range:"N/A", top_speed:"118mph", acceleration:"8.7s", power:"182hp" });
      await insertVariants(id, [
        { name:"Forester 2.5 Base",  transmission:"Automatic", fuel_type:"Petrol", price:30000 },
        { name:"Forester 2.5 Sport", transmission:"Automatic", fuel_type:"Petrol", price:36000 },
        { name:"Forester e-Boxer",   transmission:"Automatic", fuel_type:"Hybrid",  price:42000 },
      ]);

      id = await insertCar({ brand:"Subaru", name:"Subaru Outback", type:"suv", year:2024, image:"/cars/subaru-outback.png", weight:"3,649lbs", electric_range:"N/A", top_speed:"130mph", acceleration:"6.1s", power:"260hp" });
      await insertVariants(id, [
        { name:"Outback 2.5 Base",   transmission:"Automatic", fuel_type:"Petrol", price:34000 },
        { name:"Outback XT Turbo",   transmission:"Automatic", fuel_type:"Petrol", price:42000 },
      ]);

      // ── FIAT ────────────────────────────────────────────────
      id = await insertCar({ brand:"Fiat", name:"Fiat 500", type:"hatchback", year:2024, image:"/cars/fiat-500.png", weight:"2,355lbs", electric_range:"N/A", top_speed:"100mph", acceleration:"12.9s", power:"69hp" });
      await insertVariants(id, [
        { name:"500 1.2 Pop",        transmission:"Manual",    fuel_type:"Petrol", price:12000 },
        { name:"500 1.4 Lounge",     transmission:"Automatic", fuel_type:"Petrol", price:15000 },
        { name:"500e Electric",      transmission:"Automatic", fuel_type:"Electric", price:25000 },
      ]);

      // ── BAIC ────────────────────────────────────────────────
      id = await insertCar({ brand:"BAIC", name:"BAIC X55", type:"suv", year:2024, image:"/cars/baic-x55.png", weight:"3,417lbs", electric_range:"N/A", top_speed:"115mph", acceleration:"9.5s", power:"147hp" });
      await insertVariants(id, [
        { name:"X55 1.5T Base",      transmission:"Manual",    fuel_type:"Petrol", price:18000 },
        { name:"X55 1.5T Luxury",    transmission:"Automatic", fuel_type:"Petrol", price:22000 },
      ]);

      id = await insertCar({ brand:"BAIC", name:"BAIC D50", type:"sedan", year:2023, image:"/cars/baic-d50.png", weight:"2,712lbs", electric_range:"N/A", top_speed:"106mph", acceleration:"11.0s", power:"107hp" });
      await insertVariants(id, [
        { name:"D50 1.5 Base",       transmission:"Manual",    fuel_type:"Petrol", price:12000 },
        { name:"D50 1.5 Luxury",     transmission:"Automatic", fuel_type:"Petrol", price:14500 },
      ]);

      // ── LADA ────────────────────────────────────────────────
      id = await insertCar({ brand:"Lada", name:"Lada Granta", type:"sedan", year:2023, image:"/cars/lada-granta.png", weight:"2,370lbs", electric_range:"N/A", top_speed:"100mph", acceleration:"13.5s", power:"87hp" });
      await insertVariants(id, [
        { name:"Granta 1.6 Standard",transmission:"Manual",    fuel_type:"Petrol", price:9000 },
        { name:"Granta 1.6 Comfort", transmission:"Automatic", fuel_type:"Petrol", price:11000 },
      ]);

      console.log("Car catalog seeded successfully!");
    }

    console.log("All done! Car catalog is ready.");
    process.exit(0);

  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedCars();
