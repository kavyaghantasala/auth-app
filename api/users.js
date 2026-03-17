import { verifyToken } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await verifyToken(req);
  if (auth.error) return res.status(403).json({ error: auth.error });

  if (!['user', 'admin'].includes(auth.user.role)) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  return res.status(200).json({
    message: `Hello ${auth.user.email}!`,
    yourRole: auth.user.role,
    access: 'This is a user-level protected route.'
  });
}
