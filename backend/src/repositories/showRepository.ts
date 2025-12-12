import pool from '../config/db';

export const insertShow = async (name: string, start_time: string, total_seats: number) => {
  const result = await pool.query(
    'INSERT INTO shows (name, start_time, total_seats) VALUES ($1, $2, $3) RETURNING *',
    [name, start_time, total_seats]
  );
  return result.rows[0];
};

export const fetchAllShows = async () => {
  const result = await pool.query('SELECT * FROM shows ORDER BY start_time ASC');
  return result.rows;
};

export const fetchShowById = async (id: number) => {
  const result = await pool.query('SELECT * FROM shows WHERE id = $1', [id]);
  return result.rows[0];
};

// Locking query for concurrency control
export const lockShowRow = async (client: any, showId: number) => {
    return await client.query('SELECT * FROM shows WHERE id = $1 FOR UPDATE', [showId]);
};
