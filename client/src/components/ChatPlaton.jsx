import React, { useState } from "react";
export default function ChatPlaton(){
  const [messages, setMessages] = useState([
    { role:"assistant", text:"Salut, je suis Platon 🎓. Pose-moi une question musicale (ex: 'Quelle gamme pour un solo en Am ?')." }
  ]);
  const [input, setInput] = useState("");

  async function ask(){
    const q = input.trim(); if(!q) return;
    setMessages(m=>[...m, { role:"user", text:q }]); setInput("");
    try {
      const res = await fetch(`/api/platon?question=${encodeURIComponent(q)}`);
      const data = await res.json();
      const answer = data.answer || JSON.stringify(data, null, 2);
      setMessages(m=>[...m, { role:"assistant", text:answer }]);
    } catch {
      setMessages(m=>[...m, { role:"assistant", text:"Oups, impossible d'analyser pour le moment." }]);
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Demande à Platon</h1>
      <div className="space-y-2 p-3 bg-slate-800 rounded max-h-[60vh] overflow-auto">
        {messages.map((msg,i)=>(
          <div key={i} className={`p-2 rounded ${msg.role==="user"?"bg-amber-600/20 text-amber-200":"bg-slate-700"}`}>
            <pre className="whitespace-pre-wrap">{msg.text}</pre>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Écris ta question…"
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded" />
        <button onClick={ask} className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500">Envoyer</button>
      </div>
    </div>
  );
}
