// src/components/MenuLateral.js
import React from "react";
import { Link } from "react-router-dom";
import "./MenuLateral.css";

const MenuLateral = ({ visivel }) => {
  if (!visivel) return null;

  return (
    <nav className="menu-faturas">
      <ul>
        <li><Link to="/inicio">🏠 Início</Link></li>
        <li><Link to="/faturas-pagas">💰 Faturas Pagas</Link></li>
        <li><Link to="/faturas-atraso">⏳ Faturas em Atraso</Link></li>
        <li><Link to="/faturas-aberto">📄 Faturas em Aberto</Link></li>
        <li><Link to="/notas-fiscais">🧾 Notas Fiscais</Link></li>
        <li><Link to="/configuracoes">⚙️ Configurações</Link></li>
      </ul>
    </nav>
  );
};

export default MenuLateral;
