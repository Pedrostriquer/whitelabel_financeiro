import { useState, useEffect } from 'react';

// Este hook mágico detecta o tamanho da janela do navegador.
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // A função que atualiza nosso estado com o tamanho da tela.
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Adiciona um "ouvinte" que chama a função sempre que a janela muda de tamanho.
    window.addEventListener("resize", handleResize);

    // Chama a função uma vez no início para pegar o tamanho inicial.
    handleResize();

    // A parte mais importante: a limpeza! Remove o "ouvinte" quando o componente não é mais usado.
    return () => window.removeEventListener("resize", handleResize);
  }, []); // O array vazio [] garante que este efeito só rode uma vez (na montagem e desmontagem).

  return windowSize;
}