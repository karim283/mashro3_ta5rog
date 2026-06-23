const db = require("./db");

// We need this to make HTTP requests
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// How long to wait between requests (1 second)
// OpenStreetMap asks us not to send too many requests too fast
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const geocodeAddress = async (address) => {
  try {
    // Extract just the area name from the address
    // Example: "172 El Horriya Street, Sporting, Alexandria"
    // We just want: "Sporting, Alexandria"
    const parts = address.split(",");
    
    // Try with the last 2 parts first (area + city)
    let searchQuery = parts.length >= 2 
      ? parts.slice(-2).join(",").trim() 
      : address;
    
    searchQuery = searchQuery + ", Egypt";

    const encoded = encodeURIComponent(searchQuery);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=eg`;

   const response = await fetch(url, {
  headers: { "User-Agent": "CarCareX-App/1.0" },
});

// Check if response is actually JSON before parsing
const contentType = response.headers.get("content-type");
if (!contentType || !contentType.includes("application/json")) {
  console.log("Rate limited, waiting 5 seconds...");
  await sleep(5000);
  return null;
}

const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    // If that fails try with just "Alexandria, Egypt"
    const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=Alexandria,Egypt&format=json&limit=1`;
    const fallbackResponse = await fetch(fallbackUrl, {
      headers: { "User-Agent": "CarCareX-App/1.0" },
    });
    const fallbackData = await fallbackResponse.json();

    if (fallbackData && fallbackData.length > 0) {
      // Add small random offset so shops don't all land on exact same point
      return {
        lat: parseFloat(fallbackData[0].lat) + (Math.random() - 0.5) * 0.05,
        lng: parseFloat(fallbackData[0].lon) + (Math.random() - 0.5) * 0.05,
      };
    }

    return null;
  } catch (err) {
    console.error("Geocoding error for:", address, err.message);
    return null;
  }
};

async function geocodeTables() {
    const tables = ["repair_shops", "care_centers", "gas_stations"];

    for (const table of tables) {
        console.log(`\n=============================`);
        console.log(`Processing ${table}...`);
        console.log(`=============================`);

        // Only process rows that don't have coordinates yet
        const [rows] = await db.query(
            `SELECT id, name, address FROM ${table} 
       WHERE lat = 0.0 OR lat IS NULL 
       LIMIT 100`
        );

        console.log(`Found ${rows.length} shops without coordinates`);

        let success = 0;
        let failed = 0;

        for (const row of rows) {
            const coords = await geocodeAddress(row.address);

            if (coords) {
                await db.query(
                    `UPDATE ${table} SET lat = ?, lng = ? WHERE id = ?`,
                    [coords.lat, coords.lng, row.id]
                );
                console.log(`✅ ${row.name} → ${coords.lat}, ${coords.lng}`);
                success++;
            } else {
                console.log(`❌ Could not geocode: ${row.name}`);
                failed++;
            }

            // Wait 1 second between requests to respect OpenStreetMap limits
            await sleep(2000);
        }

        console.log(`\nDone with ${table}:`);
        console.log(`  ✅ Success: ${success}`);
        console.log(`  ❌ Failed: ${failed}`);
    }

    console.log("\n✅ Geocoding complete!");
    process.exit(0);
}

geocodeTables().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});