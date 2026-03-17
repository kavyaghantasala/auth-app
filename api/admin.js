import { verifyToken } from './_auth.js';
import { getDB } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await verifyToken(req);
  if (auth.error) return res.status(403).json({ error: auth.error });

  if (auth.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.', yourRole: auth.user.role });
  }

  const db    = await getDB();
  const users = (db.users || []).map(u => ({ id: u.id, email: u.email, role: u.role, createdAt: u.createdAt }));

  return res.status(200).json({ message: 'Welcome, Admin!', totalUsers: users.length, users });
}
