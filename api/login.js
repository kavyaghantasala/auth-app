import { getDB } from './_db.js';
import { verifyPassword } from './_hash.js';
import { generateToken } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const db    = await getDB();
  const users = db.users || [];
  const user  = users.find(u => u.email === email.toLowerCase());

  if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

  const passwordMatch = await verifyPassword(password, user.password);
  if (!passwordMatch) return res.status(401).json({ error: 'Invalid email or password.' });

  // Generate JWT with user_id and expiry
  const token = await generateToken({
    user_id: user.id,
    email:   user.email,
    role:    user.role
  });

  return res.status(200).json({
    message: 'Login successful.',
    token,
    user: { id: user.id, email: user.email, role: user.role }
  });
}
