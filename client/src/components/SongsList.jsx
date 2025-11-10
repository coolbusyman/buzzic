import React, { useEffect, useState } from "react";

export default function SongsList(){
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState("Rolling Stones");
  const [title, setTitle] = useState("Satisfaction");
  const [result, setResult] = useState(null);

  useEffect(()=>{ fetch("/api/songs").then(r=>r.json()).then(setSongs).catch(()=>{}); },[]);

  async function findSongsterr(){
    const r = await fetch(`/api/songsterr/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    const data = await r.json();
    setResult(data);
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chansons & Songsterr</h1>
      <div className="bg-slate-800 p-3 rounded mb-4">
        <div className="grid md:grid-cols-3 gap-2">
          <input className="px-2 py-1 rounded bg-slate-900 border border-slate-700" placeholder="Artiste" value={artist} onChange={e=>setArtist(e.target.value)} />
          <input className="px-2 py-1 rounded bg-slate-900 border border-slate-700" placeholder="Titre" value={title} onChange={e=>setTitle(e.target.value)} />
          <button onClick={findSongsterr} className="px-3 py-2 bg-amber-600 rounded hover:bg-amber-500">Chercher sur Songsterr</button>
        </div>
        {result && (
          <div className="mt-3 text-sm">
            <a className="text-amber-400 underline" href={result.searchUrl} target="_blank" rel="noreferrer">Ouvrir la recherche Songsterr</a>
            <pre className="mt-2 bg-slate-900 p-2 rounded overflow-auto max-h-64">{JSON.stringify(result.results, null, 2)}</pre>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">Exemples (depuis ton fichier)</h2>
      <div className="bg-slate-800 rounded p-3">
        <pre className="text-sm overflow-auto">{JSON.stringify(songs, null, 2)}</pre>
      </div>
    </div>
  );
}
