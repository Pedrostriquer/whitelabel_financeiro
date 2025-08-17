import React, { useState, useEffect } from "react";

const keyframes = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const skeletonStyle = {
  width: "100%",
  height: "100%",
  background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
  borderRadius: 'inherit'
};

const ImageWithLoader = ({ src, alt, style, fallbackSrc }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let isMounted = true;
    let timeoutId = null;

    const handleLoad = (source) => {
      if (isMounted) {
        clearTimeout(timeoutId);
        setImageSrc(source);
        setIsLoading(false);
      }
    };

    if (src) {
      const image = new Image();
      image.src = src;
      image.onload = () => handleLoad(src);
      image.onerror = () => handleLoad(fallbackSrc);
      timeoutId = setTimeout(() => handleLoad(fallbackSrc), 4000);
    } else {
      handleLoad(fallbackSrc);
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [src, fallbackSrc]);
  
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "inherit", // Herda o borderRadius do pai!
        overflow: "hidden",
        ...style,
      }}
    >
      <style>{keyframes}</style>

      {isLoading ? (
        <div style={skeletonStyle} />
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
};

export default ImageWithLoader;