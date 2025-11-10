import React, { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Fretboard from "./components/Fretboard";
import ModeSelector from "./components/ModeSelector";

export default function App(){
  const [showSplash, setShowSplash] = useState(true);
  const [modes, setModes] = useState([]);
  const [selectedNote, setSelectedNote] = useState("C - DO");
  const [selectedMode, setSelectedMode] = useState(null);
  const [scaleNotes, setScaleNotes] = useState([]);

  useEffect(()=>{ const t=setTimeout(()=>setShowSplash(false),1800); return ()=>clearTimeout(t); },[]);
  useEffect(()=>{ fetch("/api/modes").then(r=>r.json()).then(setModes).catch(()=>{}); },[]);
  useEffect(()=>{
    if(!selectedMode) return;
    const cols=["Tonique","2nde","Tierce","Quarte","Quinte","6eme","7eme"];
    const arr=cols.map(c=>selectedMode[c]?.split(" - ")[0]).filter(Boolean);
    setScaleNotes(arr);
  },[selectedMode]);

  return (
    <div className="p-4">
      <SplashScreen show={showSplash} />
      <div className={`${showSplash?"opacity-0 pointer-events-none":"opacity-100"} transition-opacity duration-700`}>
        <h1 className="text-3xl font-bold mb-4">Gammes & Modes</h1>
        <ModeSelector
          modes={modes}
          selectedNote={selectedNote}
          onNote={setSelectedNote}
          selectedMode={selectedMode}
          onMode={setSelectedMode}
        />
        {selectedMode && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">{selectedMode.Mode} — {selectedMode.Note}</h2>
            <Fretboard scaleNotes={scaleNotes} highlightRoot={scaleNotes[0]} />
          </div>
        )}
      </div>
    </div>
  );
}
