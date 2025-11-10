import React from "react";
export default function ModeSelector({ modes, selectedNote, onNote, selectedMode, onMode }){
  const notes = [...new Set(modes.map(m=>m.Note))].filter(Boolean);
  const modesByNote = modes.filter(m=>m.Note===selectedNote);
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Choisir une tonique</h2>
        <div className="flex flex-wrap gap-2">
          {notes.map(n=>(
            <button key={n}
              className={`px-3 py-1 rounded border ${n===selectedNote?"bg-white text-slate-900":"border-slate-700 hover:bg-slate-800"}`}
              onClick={()=>onNote(n)}>{n}</button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Modes pour {selectedNote}</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {modesByNote.map((m,idx)=>(
            <div key={idx}
              onClick={()=>onMode(m)}
              className={`cursor-pointer p-3 rounded bg-slate-800 hover:bg-slate-700 ${selectedMode?.Mode===m.Mode?"ring-2 ring-amber-500":""}`}>
              <div className="font-semibold">{m.Mode}</div>
              <div className="text-sm text-slate-400">
                {[m.Tonique,m["2nde"],m.Tierce,m.Quarte,m.Quinte,m["6eme"],m["7eme"]].filter(Boolean).join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
