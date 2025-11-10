import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, "data");
const CACHE_DIR = path.join(__dirname, "cache");
const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// ---------- Music helpers ----------
const NOTES_SHARP = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const SOLFEGE = {"C":"DO","C#":"DO#","D":"RE","D#":"RE#","E":"MI","F":"FA","F#":"FA#","G":"SOL","G#":"SOL#","A":"LA","A#":"LA#","B":"SI"};
const RECIPES = {
  "Ionien": [0,2,4,5,7,9,11],
  "Dorien": [0,2,3,5,7,9,10],
  "Phrygien": [0,1,3,5,7,8,10],
  "Lydien": [0,2,4,6,7,9,11],
  "Mixolydien": [0,2,4,5,7,9,10],
  "Éolien": [0,2,3,5,7,8,10],
  "Eolien": [0,2,3,5,7,8,10],
  "Locrien": [0,1,3,5,6,8,10],
  "Mineur harmonique": [0,2,3,5,7,8,11],
  "Mineur mélodique": [0,2,3,5,7,9,11],
  "Mineur melodique": [0,2,3,5,7,9,11]
};
const HARMONIZATION = {
  "Ionien": ["I maj","ii min","iii min","IV maj","V maj","vi min","vii dim"],
  "Éolien": ["i min","ii dim","♭III maj","iv min","v min","♭VI maj","♭VII maj"],
  "Eolien": ["i min","ii dim","♭III maj","iv min","v min","♭VI maj","♭VII maj"],
  "Mineur harmonique": ["i min","ii dim","III aug","iv min","V maj","VI maj","vii dim"],
  "Mineur mélodique": ["i min","ii min","♭III aug","IV maj","V maj","vi dim","vii dim"],
  "Mineur melodique": ["i min","ii min","♭III aug","IV maj","V maj","vi dim","vii dim"]
};

function noteIndex(n) {
  const mapSolfege = Object.fromEntries(Object.entries(SOLFEGE).map(([k,v]) => [v, k]));
  n = String(n).trim().toUpperCase();
  if (n.includes(" - ")) n = n.split(" - ")[0].trim();
  if (mapSolfege[n]) n = mapSolfege[n];
  const flats = {"DB":"C#","EB":"D#","GB":"F#","AB":"G#","BB":"A#"};
  n = n.replace("♭","B");
  if (flats[n]) n = flats[n];
  const idx = NOTES_SHARP.indexOf(n);
  return idx >= 0 ? idx : 0;
}
function buildScale(tonic, recipe) {
  const i = noteIndex(tonic);
  return recipe.map(step => NOTES_SHARP[(i + step) % 12]);
}

// ---------- Data ----------
app.get("/api/:file", (req, res) => {
  const f = req.params.file;
  const full = path.join(DATA_DIR, `${f}.json`);
  if (fs.existsSync(full)) {
    const raw = fs.readFileSync(full, "utf-8");
    res.type("application/json").send(raw);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// ---------- Songsterr (with 7-day cache) ----------
app.get("/api/songsterr/:artist/:title", async (req, res) => {
  const { artist, title } = req.params;
  const key = `${artist}__${title}`.toLowerCase();
  const cacheFile = path.join(CACHE_DIR, "songsterr.json");
  let cache = {};
  try { cache = JSON.parse(fs.readFileSync(cacheFile, "utf-8")); } catch { cache = {}; }

  const now = Date.now();
  const ttl = 7 * 24 * 3600 * 1000;
  if (cache[key] && (now - cache[key].ts < ttl)) {
    return res.json(cache[key].data);
  }

  try {
    const pattern = encodeURIComponent(`${artist} ${title}`);
    const apiUrl = `https://www.songsterr.com/a/ra/songs.json?pattern=${pattern}`;
    const r = await fetch(apiUrl);
    const data = await r.json();
    const searchUrl = `https://www.songsterr.com/?pattern=${pattern}`;
    const payload = { results: data, searchUrl };
    cache[key] = { ts: now, data: payload };
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), "utf-8");
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Songsterr fetch failed", details: e.message });
  }
});

// ---------- Platon enrichi ----------
app.get("/api/platon", (req, res) => {
  const q = String(req.query.question || "").trim();
  if (!q) return res.json({ answer: "Pose-moi une question musicale (ex: 'Quelle gamme pour un solo en Am ?')" });

  const qUp = q.toUpperCase();
  const modeKeys = Object.keys(RECIPES);
  let detectedMode = modeKeys.find(m => qUp.includes(m.toUpperCase()));
  if (!detectedMode) {
    detectedMode = qUp.includes("MÉLOD") || qUp.includes("MELOD") ? "Mineur mélodique"
                  : qUp.includes("HARMON") ? "Mineur harmonique"
                  : (qUp.includes("MAJEUR") || qUp.includes("IONIEN")) ? "Ionien"
                  : (qUp.includes("MINEUR") || qUp.includes("ÉOLIEN") || qUp.includes("EOLIEN")) ? "Éolien"
                  : "Ionien";
  }
  const tokens = qUp.replace("?"," ").split(/[\s,]+/);
  let tonic = "C";
  for (const t of tokens) {
    if (["C","C#","D","D#","E","F","F#","G","G#","A","A#","B","DO","RE","MI","FA","SOL","LA","SI"].includes(t)) { tonic = t; break; }
    if (/^[A-G](#)?M?$/.test(t)) { tonic = t[0] + (t[1]==="#"?"#":""); break; }
    if (/^[A-G](#)?MIN$/.test(t) || /^[A-G](#)?M$/.test(t)) { tonic = t[0] + (t[1]==="#"?"#":""); detectedMode = detectedMode || "Éolien"; break; }
  }

  const recipe = RECIPES[detectedMode] || RECIPES["Ionien"];
  const notes = buildScale(tonic, recipe);
  const solfegeNotes = notes.map(n => `${n} - ${SOLFEGE[n]}`);
  const harmon = (HARMONIZATION[detectedMode] || HARMONIZATION["Ionien"]);
  const chords = harmon.map((h, i) => ({ degree: i+1, roman: h }));

  const answer = [
    `Mode: ${detectedMode}`,
    `Tonique: ${notes[0]} (${SOLFEGE[notes[0]]})`,
    `Notes: ${solfegeNotes.join(", ")}`,
    `Accords (triades typiques): ${harmon.join(", ")}`,
    `Astuce: repère la tonique sur le manche, puis ajoute 3ce & 7e pour colorer le mode.`
  ].join("\n");

  res.json({ mode: detectedMode, tonic: notes[0], notes, notesSolfege: solfegeNotes, chords, answer });
});

// ---------- Serve built frontend ----------
app.use(express.static(CLIENT_DIST));
app.get("*", (req, res) => {
  res.sendFile(path.join(CLIENT_DIST, "index.html"));
});

app.listen(PORT, () => console.log(`Buzzic server running on http://localhost:${PORT}`));
