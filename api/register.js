import { getDB, saveDB } from './_db.js';
import { hashPassword } from './_hash.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const { email, password, role } = req.body || {};

  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(422).json({ error: 'Invalid email format.' });
  if (password.length < 6) return res.status(422).json({ error: 'Password must be at least 6 characters.' });

  const db = await getDB();
  if (!db.users) db.users = [];

  // Constraint 2 — Reject duplicate emails
  const exists = db.users.find(u => u.email === email.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Email already registered.' });

  // Constraint 1 — Hash password
  const hashedPassword = await hashPassword(password);

  const newUser = {
    id:        `user_${Date.now()}`,
    email:     email.toLowerCase(),
    password:  hashedPassword,
    role:      role === 'admin' ? 'admin' : 'user',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  await saveDB(db);

  return res.status(201).json({
    message:   'User registered successfully.',
    userId:    newUser.id,
    email:     newUser.email,
    role:      newUser.role,
    createdAt: newUser.createdAt
  });
}
