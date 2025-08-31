import React, { useState } from "react";
import style from "./CarouselStyle.js";

const Carousel = ({ slides, variant = "dark" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (!slides || slides.length === 0) {
    return <div></div>;
  }

  const goToPrevious = (e) => {
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const currentItem = slides[currentIndex];
  const isLight = variant === "light";

  const renderMedia = (item) => {
    if (item.mediaType === 2) {
      return (
        <video
          src={item.imageUrl}
          style={style.featuredMedia}
          autoPlay
          muted
          loop
          playsInline
        />
      );
    }
    return (
      <div
        style={{
          ...style.featuredMedia,
          backgroundImage: `url(${item.imageUrl})`,
        }}
      ></div>
    );
  };

  const overlayStyle = {
    ...style.featuredOverlay,
    ...(isLight && style.lightOverlay),
    ...(isHovered &&
      (isLight ? style.lightOverlayHover : style.featuredOverlayHover)),
  };
  const tagStyle = { ...style.featuredTag, ...(isLight && style.lightTag) };
  const titleStyle = {
    ...style.featuredTitle,
    ...(isLight && style.lightTitle),
    ...(isHovered && style.featuredTitleHover),
  };
  const descriptionStyle = {
    ...style.featuredDescription,
    ...(isLight && style.lightDescription),
    ...(isHovered && style.featuredDescriptionHover),
  };
  const arrowStyle = { ...style.arrow, ...(isLight && style.lightArrow) };

  return (
    <div
      style={style.featuredContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderMedia(currentItem)}
      <div style={overlayStyle}>
        <span style={tagStyle}>{currentItem.type}</span>
        <h3 style={titleStyle}>{currentItem.title}</h3>
        <p style={descriptionStyle}>{currentItem.description}</p>
      </div>
      <button
        onClick={goToPrevious}
        style={{ ...arrowStyle, ...style.leftArrow }}
      >
        &#10094;
      </button>
      <button onClick={goToNext} style={{ ...arrowStyle, ...style.rightArrow }}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
