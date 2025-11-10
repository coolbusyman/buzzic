import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import App from "./App";
import ChatPlaton from "./components/ChatPlaton";
import SongsList from "./components/SongsList";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <nav className="p-4 border-b border-slate-800 flex gap-4 items-center">
        <Link to="/" className="font-bold text-xl">🎸 Buzzic</Link>
        <Link to="/" className="hover:underline">Gammes & Modes</Link>
        <Link to="/songs" className="hover:underline">Chansons</Link>
        <Link to="/platon" className="hover:underline">Demande à Platon</Link>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/platon" element={<ChatPlaton />} />
        <Route path="/songs" element={<SongsList />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
