const admin = require("firebase-admin");

function reply(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(body)
  };
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || !a || !b) return false;
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function getAdmin() {
  if (admin.apps.length) return admin;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT is not configured");
  const serviceAccount = JSON.parse(raw);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://milkfish-chanos-chanos-5cf0e-default-rtdb.firebaseio.com"
  });
  return admin;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return reply(405, { error: "POST only" });

  const expected = process.env.DEVICE_API_KEY;
  const supplied = event.headers?.["x-device-key"] || event.headers?.["X-Device-Key"];
  if (!safeEqual(supplied, expected)) return reply(401, { error: "Unauthorized device" });

  let data;
  try { data = JSON.parse(event.body || "{}"); }
  catch { return reply(400, { error: "Invalid JSON" }); }

  const { ph, temperature, ammonia } = data;
  if (![ph, temperature, ammonia].every(v => typeof v === "number" && Number.isFinite(v))) {
    return reply(400, { error: "Readings must be finite numbers" });
  }
  if (ph < 0 || ph > 14 || temperature < -5 || temperature > 60 || ammonia < 0) {
    return reply(400, { error: "Reading outside basic sensor limits" });
  }

  try {
    const fb = getAdmin();
    await fb.database().ref("hatcheries/hatchery1/latest").set({
      ph,
      temperature,
      ammonia,
      valid: true,
      deviceConnected: true,
      timestamp: Date.now()
    });
    return reply(200, { success: true });
  } catch (error) {
    console.error("Firebase write failed:", error.message);
    return reply(500, { error: "Server could not save the reading" });
  }
};
