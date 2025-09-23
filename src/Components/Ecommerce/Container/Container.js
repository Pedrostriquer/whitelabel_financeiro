import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import FloatingWhatsApp from "../FloatingWhatsApp/FloatingWhatsApp"; // 1. IMPORTE O COMPONENTE AQUI

export default function Container() {
  return (
    // Um pequeno ajuste no estilo para garantir que o footer se comporte bem em páginas curtas
    <div style={{position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column"}}>
      <Header />
      {/* Adicionado flexGrow: 1 para que o main empurre o footer para baixo */}
      <main style={{minHeight: "60vh", flexGrow: 1}}>
        <Outlet />
      </main>
      <Footer />
      
      {/* 2. ADICIONE O BOTÃO FLUTUANTE AQUI */}
      <FloatingWhatsApp />
    </div>
  );
}