import * as userRepo from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'; // Use env in prod

export const register = async (email: string, password: string, name: string) => {
    const existing = await userRepo.findUserByEmail(email);
    if (existing) {
        throw new Error('User already exists');
    }
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return await userRepo.createUser(email, hash, name);
};

export const login = async (email: string, password: string) => {
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};
