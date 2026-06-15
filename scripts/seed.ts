import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products } from "../shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const SCENTS = ["Jasmine", "Vanilla", "Rain Water", "Fresh Linen", "Star Gazer Lily", "Cherry Blossom", "Honeysuckle", "Zippity Do Dah"];
const COLORS = ["White", "Yellow", "Blue", "Red", "Purple", "Orange", "Pink", "Aquamarine", "Bright Green"];

const productData = [
  { name: "CC Letters", slug: "cc-letters", price: 30.00, dimensions: "12.3 x 16 cm (4.84 x 6.30 in)", weight: "290g (10.23oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/01.png" },
  { name: "LV Letters", slug: "lv-letters", price: 30.00, dimensions: "14.5 x 14.5 cm (5.71 x 5.71 in)", weight: "307g (10.83oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/02.png" },
  { name: "GG Letters", slug: "gg-letters", price: 30.00, dimensions: "16 x 12.5 cm (6.30 x 4.92 in)", weight: "300g (10.58oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/03.png" },
  { name: "CC Bag", slug: "cc-bag", price: 30.00, dimensions: "Dimensions vary", weight: "Varies", imageUrl: "https://pub-candles-by-tj.r2.dev/04.png" },
  { name: "YSL Flap", slug: "ysl-flap", price: 35.00, dimensions: "14 x 8.2 cm (5.67 x 3.23 in)", weight: "365g (12.87oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/05.png" },
  { name: "Dionysus", slug: "dionysus", price: 35.00, dimensions: "16.2 x 10.5 cm (5.83 x 3.74 in)", weight: "385g (13.58oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/06.png" },
  { name: "Marmont", slug: "marmont", price: 40.00, dimensions: "14.5 x 10 cm (5.71 x 3.94 in)", weight: "550g (19.40oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/07.png" },
  { name: "CC Clutch", slug: "cc-clutch", price: 40.00, dimensions: "14.3 x 9 cm (5.63 x 3.54 in)", weight: "420g (14.82oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/08.png" },
  { name: "Dauphine", slug: "dauphine", price: 40.00, dimensions: "13.1 x 5.7 cm (5.16 x 2.24 in)", weight: "461g (16.26oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/09.png" },
  { name: "YSL Envelope", slug: "ysl-envelope", price: 40.00, dimensions: "14.8 x 10.5 x 6 cm (5.83 x 4.13 x 2.36 in)", weight: "586g (20.66oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/10.png" },
  { name: "LV Pillar", slug: "lv-pillar", price: 40.00, dimensions: "12 x 9.5 cm (4.72 x 3.74 in)", weight: "600g (21.16oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/11.png" },
  { name: "LV Bucket", slug: "lv-bucket", price: 45.00, dimensions: "10.8 x 8.3 x 10.5 cm (4.25 x 3.27 x 4.13 in)", weight: "600g (21.16oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/12.png" },
  { name: "Trunk", slug: "trunk", price: 50.00, dimensions: "13.5 x 8.5 x 7.5 cm (5.31 x 3.35 x 2.95 in)", weight: "825g (29.10oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/13.png" },
  { name: "Chapeau", slug: "chapeau", price: 50.00, dimensions: "12.9 x 6.5 x 11.6 cm (5.08 x 2.56 x 4.57 in)", weight: "560g (19.76oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/14.png" },
  { name: "Hermes", slug: "hermes", price: 55.00, dimensions: "17 x 11.8 cm (6.06 x 4.65 in)", weight: "710g (25.04oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/15.png" },
  { name: "Speedy", slug: "speedy", price: 55.00, dimensions: "16 x 13.4 x 11.3 cm (6.30 x 5.28 x 4.45 in)", weight: "890g (31.39oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/16.png" },
  { name: "LV Duffel", slug: "lv-duffel", price: 55.00, dimensions: "Dimensions vary", weight: "Varies", imageUrl: "https://pub-candles-by-tj.r2.dev/17.png" },
  { name: "XL Flap", slug: "xl-flap", price: 55.00, dimensions: "17.5 x 9 cm (6.89 x 3.54 in)", weight: "745g (26.28oz)", imageUrl: "https://pub-candles-by-tj.r2.dev/18.png" },
];

async function seed() {
  console.log("Seeding products...");

  await db.delete(products);

  for (const product of productData) {
    await db.insert(products).values({
      ...product,
      description: `Hand-poured luxury designer candle. Each candle is made with natural wax blend and available in your choice of scent and color.`,
      scents: SCENTS,
      colors: COLORS,
      inStock: true,
    });
    console.log(`✓ ${product.name}`);
  }

  console.log("Done! 18 products seeded.");
  process.exit(0);
}

seed().catch(console.error);
