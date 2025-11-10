import React from "react";
const TUNING = ["E","B","G","D","A","E"]; // affichage e aigu -> E grave
const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const idx = n => NOTES.indexOf(n);
const at = (open,fret) => NOTES[(idx(open)+fret)%12];

export default function Fretboard({ scaleNotes = [], highlightRoot = null, frets = 12 }){
  const w=600,h=220,left=50,right=550,top=30,bottom=190;
  const fretW=(right-left)/frets, stringH=(bottom-top)/(TUNING.length-1);
  const inScale = n => scaleNotes.includes(n);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {[...Array(frets+1).keys()].map(f => (<line key={f} x1={left+f*fretW} y1={top} x2={left+f*fretW} y2={bottom} stroke="#6b7280" strokeWidth="1" />))}
      {TUNING.map((note,i)=>(<line key={i} x1={left} y1={top+i*stringH} x2={right} y2={top+i*stringH} stroke="#94a3b8" strokeWidth="2" />))}
      {[3,5,7,9,12].map(f=>(<circle key={f} cx={left+(f-0.5)*fretW} cy={(top+bottom)/2} r="4" fill="#475569" />))}
      {TUNING.map((open,si)=>[...Array(frets+1).keys()].map(f=>{
        const n=at(open,f); const y=top+si*stringH; const x=left+f*fretW;
        if(!inScale(n)) return null;
        const isRoot = highlightRoot===n;
        return (<g key={`${si}-${f}`}>
          <circle cx={x} cy={y} r={9} fill={isRoot?"#22c55e":"#B87333"} opacity="0.9" />
          <text x={x} y={y+4} fontSize="8" textAnchor="middle" fill="#0f172a">{n}</text>
        </g>);
      }))}
    </svg>
  );
}
