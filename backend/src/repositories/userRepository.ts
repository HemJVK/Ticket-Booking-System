import pool from '../config/db';

export const findUserByEmail = async (email: string) => {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
};

export const createUser = async (email: string, passwordHash: string, name: string) => {
    // Default role is USER, admins must be set manually in DB for now
    const res = await pool.query(
        'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
        [email, passwordHash, name, 'USER']
    );
    return res.rows[0];
};
