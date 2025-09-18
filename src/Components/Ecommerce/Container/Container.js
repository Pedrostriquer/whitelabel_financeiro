// CÓDIGO CORRIGIDO
import React from "react";
import { Outlet } from "react-router-dom"; // 1. Importe o Outlet
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Container() {
  return (
    <div style={{position: "relative", height: "max-content"}}>
      <Header />
      <main style={{minHeight: "60vh"}}>
        <Outlet /> {/* 2. Substitua {children} por <Outlet /> */}
      </main>
      <Footer />
    </div>
  );
}