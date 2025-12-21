import pool from '../config/db';

const initDb = async () => {
  const client = await pool.connect();
  try {
    // Create shows table
    await client.query(`
      CREATE TABLE IF NOT EXISTS shows (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        total_seats INTEGER NOT NULL
      );
    `);

    // Create bookings table
    // seat_number is important.
    // status: PENDING, CONFIRMED, FAILED
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        show_id INTEGER REFERENCES shows(id),
        user_id INTEGER, -- Optional for now
        seat_number INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(show_id, seat_number) -- This constraint helps, but we also need locking for "PENDING" checks
      );
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    client.release();
  }
};

export default initDb;
