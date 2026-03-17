// Pure Web Crypto JWT — no npm package needed

const SECRET = process.env.JWT_SECRET || 'authvault-secret-key';

function base64url(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function decodeBase64url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

async function hmacSign(data, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return base64url(String.fromCharCode(...new Uint8Array(sig)));
}

export async function generateToken(payload) {
  const header  = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp     = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24h
  const body    = base64url(JSON.stringify({ ...payload, exp }));
  const sig     = await hmacSign(`${header}.${body}`, SECRET);
  return `${header}.${body}.${sig}`;
}

export async function verifyToken(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return { error: 'No token provided.', status: 403 };

  try {
    const [header, body, sig] = token.split('.');
    const expectedSig = await hmacSign(`${header}.${body}`, SECRET);
    if (sig !== expectedSig) return { error: 'Invalid token.', status: 403 };

    const payload = JSON.parse(decodeBase64url(body));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { error: 'Token expired.', status: 403 };
    }
    return { user: payload };
  } catch {
    return { error: 'Invalid token.', status: 403 };
  }
}
