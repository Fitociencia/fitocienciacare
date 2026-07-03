import { sql } from "drizzle-orm";
import { getDb } from "../api/queries/connection";

async function reset() {
  const db = getDb();
  console.log("Dropping all tables...");
  
  // Disable foreign key checks
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  
  // Get all tables
  const tables = await db.execute(sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = DATABASE()
  `);

  for (const t of (tables[0] as unknown as any[])) {
    const tableName = t.TABLE_NAME || t.table_name;
    if (tableName) {
      await db.execute(sql.raw(`DROP TABLE IF EXISTS \`${tableName}\``));
      console.log(`Dropped: ${tableName}`);
    }
  }
  
  // Re-enable foreign key checks
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);
  console.log("All tables dropped.");
}

reset().catch(console.error);
