import { verifyToken } from './_auth.js';
import { getDB } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await verifyToken(req);
  if (auth.error) return res.status(403).json({ error: auth.error });

  const db   = await getDB();
  const user = (db.users || []).find(u => u.id === auth.user.user_id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  return res.status(200).json({
    message: 'Access granted.',
    user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt }
  });
}
