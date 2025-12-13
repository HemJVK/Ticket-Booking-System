import pool from '../config/db';

const updateDb = async () => {
  const client = await pool.connect();
  try {
    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Update Shows Table (Add description, image_url)
    // We check if column exists first to avoid error on rerun, or just use ALTER TABLE IF NOT EXISTS (pg 9.6+)
    // Or just simple catch blocks.
    try {
        await client.query(`ALTER TABLE shows ADD COLUMN description TEXT;`);
        await client.query(`ALTER TABLE shows ADD COLUMN image_url TEXT;`);
        await client.query(`ALTER TABLE shows ADD COLUMN price INTEGER DEFAULT 10;`); // Price per seat
    } catch (e) {
        // Ignore if exists
    }

    // Update Bookings Table (Add payment_status, ticket_code)
    try {
        await client.query(`ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(50) DEFAULT 'PENDING';`);
        await client.query(`ALTER TABLE bookings ADD COLUMN ticket_code VARCHAR(100);`); // For QR
    } catch (e) {
        // Ignore
    }

    console.log("Database schema updated successfully");
  } catch (error) {
    console.error("Error updating schema:", error);
  } finally {
    client.release();
  }
};

export default updateDb;
