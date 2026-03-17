const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_ID  = process.env.JSONBIN_BIN_ID;

export async function getDB() {
  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const j = await r.json();
    return j.record || { users: [] };
  } catch { return { users: [] }; }
}

export async function saveDB(data) {
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
    body: JSON.stringify(data)
  });
}
