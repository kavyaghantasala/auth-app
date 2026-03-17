// Pure Web Crypto password hashing — no npm package needed

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password) {
  const salt = Math.random().toString(36).substring(2, 18);
  const hash = await sha256(salt + password);
  return `${salt}:${hash}`;
}

export async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const testHash = await sha256(salt + password);
  return testHash === hash;
}
