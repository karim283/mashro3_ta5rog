const express  = require("express");
const axios    = require("axios");
const cors     = require("cors");
const dotenv   = require("dotenv");
const path     = require("path");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");   // ADD THIS
const db       = require("./db");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 5000;
const chatbotBaseUrl = process.env.CHATBOT_URL || "http://chatbot:8000";

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ─── MIDDLEWARE ───────────────────────────────────────────────
// This is the "wristband checker" — put it in front of any route
// that requires the user to be logged in
function requireLogin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "You must be logged in" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired, please log in again" });
  }
}

// ─── AUTH ─────────────────────────────────────────────────────
app.post("/api/register", async (req, res) => {
  const { name, mobile, email, password } = req.body;
  if (!name || !email || !password || !mobile) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, mobile, email, password) VALUES (?, ?, ?, ?)",
      [name, mobile, email, hashedPassword]
    );
    // Give them a token right after registering
    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      message: "User registered successfully",
      token,                          // ← NEW
      user: { id: result.insertId, name, email, mobile }
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Give them a token on login
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { password: _, ...userData } = user;
    res.json({
      message: "Login successful",
      token,                          // ← NEW
      user: userData
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ─── PROFILE ──────────────────────────────────────────────────
// requireLogin here means only the logged-in user can update their own profile
app.put("/api/users/:id", requireLogin, async (req, res) => {
  const { name, mobile, image } = req.body;
  try {
    await db.query(
      "UPDATE users SET name = ?, mobile = ?, image = ? WHERE id = ?",
      [name, mobile, image, req.params.id]
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// ─── FAVORITES ────────────────────────────────────────────────
app.get("/api/favorites/:userId", requireLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM favorites WHERE user_id = ?",
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/favorites", requireLogin, async (req, res) => {
  const { user_id, place_id, place_name, place_address, type } = req.body;
  try {
    await db.query(
      "INSERT INTO favorites (user_id, place_id, place_name, place_address, type) VALUES (?, ?, ?, ?, ?)",
      [user_id, place_id, place_name, place_address, type]
    );
    res.status(201).json({ message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/favorites/:id", requireLogin, async (req, res) => {
  try {
    await db.query("DELETE FROM favorites WHERE id = ?", [req.params.id]);
    res.json({ message: "Favorite removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── CARS ─────────────────────────────────────────────────────
app.get("/api/cars/:userId", requireLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM cars WHERE user_id = ?",
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/cars", requireLogin, async (req, res) => {
  const { user_id, brand, model, year, plate_number } = req.body;
  try {
    await db.query(
      "INSERT INTO cars (user_id, brand, model, year, plate_number) VALUES (?, ?, ?, ?, ?)",
      [user_id, brand, model, year, plate_number]
    );
    res.status(201).json({ message: "Car added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cars/:id", requireLogin, async (req, res) => {
  try {
    await db.query("DELETE FROM cars WHERE id = ?", [req.params.id]);
    res.json({ message: "Car removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ADDRESSES ────────────────────────────────────────────────
app.get("/api/addresses/:userId", requireLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM addresses WHERE user_id = ?",
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/addresses", requireLogin, async (req, res) => {
  const { user_id, label, address, city, is_default } = req.body;
  try {
    if (is_default) {
      await db.query(
        "UPDATE addresses SET is_default = FALSE WHERE user_id = ?",
        [user_id]
      );
    }
    await db.query(
      "INSERT INTO addresses (user_id, label, address, city, is_default) VALUES (?, ?, ?, ?, ?)",
      [user_id, label, address, city, is_default]
    );
    res.status(201).json({ message: "Address added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SERVICE HISTORY ──────────────────────────────────────────
app.get("/api/service-history/:userId", requireLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT sh.*, c.brand, c.model 
       FROM service_history sh 
       JOIN cars c ON sh.car_id = c.id 
       WHERE sh.user_id = ? 
       ORDER BY sh.service_date DESC`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/service-history", requireLogin, async (req, res) => {
  const { user_id, car_id, service_type, service_date, cost, notes } = req.body;
  try {
    await db.query(
      "INSERT INTO service_history (user_id, car_id, service_type, service_date, cost, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, car_id, service_type, service_date, cost, notes]
    );
    res.status(201).json({ message: "Service record added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PLACES (public — no login needed to browse) ──────────────
app.get("/api/repair-shops", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM repair_shops");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/care-centers", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM care_centers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/ev-stations", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ev_stations");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/car-care-images", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM car_care_images");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GAS STATIONS ─────────────────────────────────────────────
app.get("/api/gas-stations-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM gas_stations");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/gas-stations", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const offset = 0.1;
    const south = lat ? parseFloat(lat) - offset : 31.1;
    const north = lat ? parseFloat(lat) + offset : 31.3;
    const west  = lng ? parseFloat(lng) - offset : 29.8;
    const east  = lng ? parseFloat(lng) + offset : 30.02;
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="fuel"](${south},${west},${north},${east});out;`;
    const response = await axios.get(overpassUrl);
    const results = response.data.elements || [];
    const stations = results.map((place) => ({
      id:      place.id,
      name:    place.tags?.name || "Gas Station",
      lat:     place.lat,
      lng:     place.lon,
      address: place.tags?.["addr:street"] || "No address",
    }));
    if (!stations.length) {
      return res.json([{ id: "demo-1", name: "Fallback Gas Station", lat: 31.2001, lng: 29.9187, address: "No address" }]);
    }
    res.json(stations);
  } catch (err) {
    console.error("Gas stations API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch gas stations" });
  }
});

// ─── REVIEWS ──────────────────────────────────────────────────
app.get("/api/reviews/:placeType/:placeId", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.name as user_name, u.image as user_image
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.place_type = ? AND r.place_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.placeType, req.params.placeId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/reviews", requireLogin, async (req, res) => {
  const { place_id, place_type, rating, comment } = req.body;
  try {
    await db.query(
      "INSERT INTO reviews (user_id, place_id, place_type, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [req.userId, place_id, place_type, rating, comment]
    );
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── NOTIFICATION PREFERENCES ─────────────────────────────────
app.get("/api/notifications/:userId", requireLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM notification_preferences WHERE user_id = ?",
      [req.params.userId]
    );
    // If no preferences saved yet, return the defaults
    if (rows.length === 0) {
      return res.json({ user_id: req.params.userId, sms: false, email: true, whatsapp: true });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/notifications/:userId", requireLogin, async (req, res) => {
  const { sms, email, whatsapp } = req.body;
  try {
    await db.query(
      `INSERT INTO notification_preferences (user_id, sms, email, whatsapp)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE sms = ?, email = ?, whatsapp = ?`,
      [req.params.userId, sms, email, whatsapp, sms, email, whatsapp]
    );
    res.json({ message: "Preferences saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── CAR CATALOG ──────────────────────────────────────────────

// Get all brands (for the brand filter row on the screen)
// Example: GET /api/brands
app.get("/api/brands", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM car_brands");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all cars — can filter by type or brand
// Example: GET /api/car-catalog
// Example: GET /api/car-catalog?type=suv
// Example: GET /api/car-catalog?brand_id=1
// Example: GET /api/car-catalog?type=suv&brand_id=1
app.get("/api/car-catalog", async (req, res) => {
  try {
    const { type, brand_id } = req.query;

    // Start with a base query
    // We JOIN car_brands so we also get the brand name in the result
    let query = `
      SELECT c.*, b.name as brand_name, b.logo as brand_logo
      FROM car_catalog c
      JOIN car_brands b ON c.brand_id = b.id
      WHERE 1=1
    `;
    const params = [];

    // Add filters only if they were sent
    if (type) {
      query += " AND c.type = ?";
      params.push(type);
    }
    if (brand_id) {
      query += " AND c.brand_id = ?";
      params.push(brand_id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one car's full detail including its variants
// Example: GET /api/car-catalog/1
app.get("/api/car-catalog/:id", async (req, res) => {
  try {
    // Get the car details
    const [cars] = await db.query(
      `SELECT c.*, b.name as brand_name, b.logo as brand_logo
       FROM car_catalog c
       JOIN car_brands b ON c.brand_id = b.id
       WHERE c.id = ?`,
      [req.params.id]
    );

    if (cars.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Get its variants
    const [variants] = await db.query(
      "SELECT * FROM car_variants WHERE car_id = ?",
      [req.params.id]
    );

    // Send back the car + its variants together
    res.json({ ...cars[0], variants });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search cars by name
// Example: GET /api/car-catalog/search?q=kia
app.get("/api/cars/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Please provide a search term" });

    const [rows] = await db.query(
      `SELECT c.*, b.name as brand_name, b.logo as brand_logo
       FROM car_catalog c
       JOIN car_brands b ON c.brand_id = b.id
       WHERE c.name LIKE ? OR b.name LIKE ?`,
      [`%${q}%`, `%${q}%`]   // % means "anything before or after the search word"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── NEARBY SEARCH ────────────────────────────────────────────
// This is the core formula that calculates distance in km
// between the user's location and any point in the database.
// You don't need to understand the math — just know it works!
const nearbyQuery = (table, extraColumns = '') => `
  SELECT *,
    ${extraColumns}
    (6371 * ACOS(
      COS(RADIANS(?)) * COS(RADIANS(lat)) *
      COS(RADIANS(lng) - RADIANS(?)) +
      SIN(RADIANS(?)) * SIN(RADIANS(lat))
    )) AS distance_km
  FROM ${table}
  HAVING distance_km < ?
  ORDER BY distance_km ASC
`;

// ── Nearby gas stations ────────────────────────────────────────
// GET /api/nearby/gas-stations?lat=31.2&lng=29.9&radius=10
// radius is in km — default is 10km if not provided
app.get("/api/nearby/gas-stations", async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;

  // Make sure the user actually sent their location
  if (!lat || !lng) {
    return res.status(400).json({ error: "Please provide lat and lng" });
  }

  try {
    const [rows] = await db.query(
      nearbyQuery("gas_stations"),
      [lat, lng, lat, radius]  // lat appears 3 times in the formula
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Nearby repair shops ────────────────────────────────────────
// GET /api/nearby/repair-shops?lat=31.2&lng=29.9&radius=10
app.get("/api/nearby/repair-shops", async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Please provide lat and lng" });
  }

  try {
    const [rows] = await db.query(
      nearbyQuery("repair_shops"),
      [lat, lng, lat, radius]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Nearby care centers ────────────────────────────────────────
// GET /api/nearby/care-centers?lat=31.2&lng=29.9&radius=10
app.get("/api/nearby/care-centers", async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Please provide lat and lng" });
  }

  try {
    const [rows] = await db.query(
      nearbyQuery("care_centers"),
      [lat, lng, lat, radius]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Nearby EV stations ────────────────────────────────────────
// GET /api/nearby/ev-stations?lat=31.2&lng=29.9&radius=10
app.get("/api/nearby/ev-stations", async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Please provide lat and lng" });
  }

  try {
    const [rows] = await db.query(
      nearbyQuery("ev_stations"),
      [lat, lng, lat, radius]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Search everything nearby at once ──────────────────────────
// This is for the main dashboard map that shows ALL place types
// GET /api/nearby/all?lat=31.2&lng=29.9&radius=10
app.get("/api/nearby/all", async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Please provide lat and lng" });
  }

  try {
    // Run all 4 queries at the same time (faster than one by one)
    const [gasStations, repairShops, careCenters, evStations] = await Promise.all([
      db.query(nearbyQuery("gas_stations"),  [lat, lng, lat, radius]),
      db.query(nearbyQuery("repair_shops"),  [lat, lng, lat, radius]),
      db.query(nearbyQuery("care_centers"),  [lat, lng, lat, radius]),
      db.query(nearbyQuery("ev_stations"),   [lat, lng, lat, radius]),
    ]);

    res.json({
      gas_stations:  gasStations[0],
      repair_shops:  repairShops[0],
      care_centers:  careCenters[0],
      ev_stations:   evStations[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Search with filters ───────────────────────────────────────
// This powers the search bar + filter tabs on the app
// GET /api/search?q=mobil&type=gas&lat=31.2&lng=29.9
app.get("/api/search", async (req, res) => {
  const { q = "", type, lat, lng } = req.query;
  const search = `%${q}%`;

  try {
    let results = [];

    // If a type filter is selected, only search that type
    // If no type, search everything
    const searchTable = async (table, placeType) => {
      let query = `SELECT *, '${placeType}' as place_type FROM ${table} WHERE name LIKE ?`;
      const params = [search];

      // If user location is provided, also calculate distance
      if (lat && lng) {
        query = `
          SELECT *, '${placeType}' as place_type,
          (6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(lat)) *
            COS(RADIANS(lng) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(lat))
          )) AS distance_km
          FROM ${table}
          WHERE name LIKE ?
          ORDER BY distance_km ASC
        `;
        return db.query(query, [lat, lng, lat, search]);
      }

      return db.query(query, params);
    };

    if (!type || type === "all") {
      const [gas, repair, care, ev] = await Promise.all([
        searchTable("gas_stations", "gas"),
        searchTable("repair_shops", "repair"),
        searchTable("care_centers", "center"),
        searchTable("ev_stations",  "ev"),
      ]);
      results = [...gas[0], ...repair[0], ...care[0], ...ev[0]];
    } else if (type === "gas")    { const [r] = await searchTable("gas_stations", "gas");    results = r; }
    else if (type === "repair")   { const [r] = await searchTable("repair_shops",  "repair"); results = r; }
    else if (type === "center")   { const [r] = await searchTable("care_centers",  "center"); results = r; }
    else if (type === "ev")       { const [r] = await searchTable("ev_stations",   "ev");     results = r; }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── CHATBOT ──────────────────────────────────────────────────
// POST /api/chat
// Body: { question, session_id }
// Forwards the message to the Python chatbot server
app.post("/api/chat", async (req, res) => {
  const { question, session_id } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Please provide a question" });
  }

  try {
    const response = await axios.post(`${chatbotBaseUrl}/chat`, {
      question,
      session_id: session_id || "guest"
    }, {
      timeout: 60000
    });

    res.json({ answer: response?.data?.answer || "Sorry, I couldn't generate a response." });

  } catch (err) {
    console.error("Chatbot error:", err.message);
    res.status(502).json({
      error: "Chatbot is unavailable right now. Please try again."
    });
  }
});

// ─── CAR SERVICES (real Alexandria shops) ─────────────────────
app.get("/api/car-services", async (req, res) => {
  try {
    const { type, area, q } = req.query;
    let query = "SELECT * FROM car_services WHERE 1=1";
    const params = [];

    if (type) {
      query += " AND services LIKE ?";
      params.push(`%${type}%`);
    }
    if (area) {
      query += " AND Area LIKE ?";
      params.push(`%${area}%`);
    }
    if (q) {
      query += " AND (name LIKE ? OR address LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    query += " LIMIT 20";
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 1. CALLBACK REQUEST ──────────────────────────────────────
// When a user taps "Request Callback" on a repair shop page
// POST /api/callback-request
// Body: { user_id, shop_id, shop_name, phone_number }
app.post("/api/callback-request", requireLogin, async (req, res) => {
  const { shop_id, shop_name, phone_number } = req.body;

  if (!shop_id || !phone_number) {
    return res.status(400).json({ error: "Shop ID and phone number are required" });
  }

  try {
    // We store the callback request so the shop knows someone wants a call
    await db.query(
      `INSERT INTO callback_requests 
       (user_id, shop_id, shop_name, phone_number) 
       VALUES (?, ?, ?, ?)`,
      [req.userId, shop_id, shop_name, phone_number]
    );
    res.status(201).json({ message: "Callback request sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/callback-requests/:userId", requireLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM callback_requests WHERE user_id = ? ORDER BY created_at DESC",
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 2. REFERRAL SYSTEM ───────────────────────────────────────
// Each user gets a unique referral code when they register
// POST /api/referral/generate — generate a code for a user
// POST /api/referral/use — use someone else's code
app.post("/api/referral/generate", requireLogin, async (req, res) => {
  try {
    // Check if user already has a code
    const [existing] = await db.query(
      "SELECT * FROM referrals WHERE user_id = ?",
      [req.userId]
    );

    if (existing.length > 0) {
      return res.json({ code: existing[0].code });
    }

    // Generate a unique code from user ID
    const code = "CCX" + req.userId + Math.random().toString(36).substring(2, 6).toUpperCase();

    await db.query(
      "INSERT INTO referrals (user_id, code) VALUES (?, ?)",
      [req.userId, code]
    );

    res.status(201).json({ code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/referral/use", requireLogin, async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Please provide a referral code" });
  }

  try {
    // Find who owns this code
    const [referrals] = await db.query(
      "SELECT * FROM referrals WHERE code = ?",
      [code]
    );

    if (referrals.length === 0) {
      return res.status(404).json({ error: "Invalid referral code" });
    }

    const referral = referrals[0];

    // Make sure user isn't using their own code
    if (referral.user_id === req.userId) {
      return res.status(400).json({ error: "You cannot use your own referral code" });
    }

    // Record that this code was used
    await db.query(
      "UPDATE referrals SET uses = uses + 1 WHERE code = ?",
      [code]
    );

    res.json({ message: "Referral code applied successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 3. RECENTLY VISITED ──────────────────────────────────────
// Saves whenever a user views a place so we can show "Recent" tab
// POST /api/recent — save a visit
// GET /api/recent/:userId — get user's recent places
app.post("/api/recent", requireLogin, async (req, res) => {
  const { place_id, place_name, place_type, place_address } = req.body;

  try {
    // If already visited before, just update the timestamp
    await db.query(
      `INSERT INTO recent_visits 
       (user_id, place_id, place_name, place_type, place_address)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE visited_at = CURRENT_TIMESTAMP`,
      [req.userId, place_id, place_name, place_type, place_address]
    );
    res.status(201).json({ message: "Visit recorded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/recent/:userId", requireLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM recent_visits 
       WHERE user_id = ? 
       ORDER BY visited_at DESC 
       LIMIT 10`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 4. RECOMMENDED ───────────────────────────────────────────
// Returns highest rated places across all types
// GET /api/recommended?type=repair
app.get("/api/recommended", async (req, res) => {
  const { type } = req.query;

  try {
    let results = [];

    // Helper to get top rated from a table
    const getTopRated = (table, placeType) =>
      db.query(
        `SELECT *, '${placeType}' as place_type 
         FROM ${table} 
         WHERE rating >= 4.0 
         ORDER BY rating DESC 
         LIMIT 5`
      );

    if (!type || type === "all") {
      const [repair, care, gas, ev] = await Promise.all([
        getTopRated("repair_shops", "repair"),
        getTopRated("care_centers",  "center"),
        getTopRated("gas_stations",  "gas"),
        getTopRated("ev_stations",   "ev"),
      ]);
      results = [
        ...repair[0],
        ...care[0],
        ...gas[0],
        ...ev[0],
      ].sort((a, b) => b.rating - a.rating);
    } else if (type === "repair") { results = (await getTopRated("repair_shops", "repair"))[0]; }
    else if (type === "center")   { results = (await getTopRated("care_centers",  "center"))[0]; }
    else if (type === "gas")      { results = (await getTopRated("gas_stations",  "gas"))[0]; }
    else if (type === "ev")       { results = (await getTopRated("ev_stations",   "ev"))[0]; }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── START ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`CarCareX server running on http://localhost:${PORT}`);
});
