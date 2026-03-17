import { getDB } from './_db.js';
import { hashPassword, verifyPassword } from './_hash.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Test hashing
  const hash = await hashPassword('123456');
  const verify = await verifyPassword('123456', hash);

  // Test DB
  const db = await getDB();

  return res.status(200).json({
    hashWorks: verify,
    sampleHash: hash,
    dbUsers: (db.users || []).map(u => ({ email: u.email, passwordStored: u.password }))
  });
}
