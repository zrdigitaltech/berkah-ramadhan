import React, { useState } from 'react';

const ImageMagnify = ({
  src,
  width = '100%',
  height = '100%',
  magnifierHeight = 100,
  magnifieWidth = 100,
  zoomLevel = 1.5,
  className
}) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  const handleMouseEnter = (e) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    setXY([x, y]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        height: height,
        width: width
      }}
    >
      <img
        src={src}
        alt="img"
        style={{
          height: height,
          width: width,
          objectFit: 'cover' // Ensures the image fills the container without distortion
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
      />

      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none', // Prevents the magnifier from interfering with mouse movement
            height: `${magnifierHeight}px`,
            width: `${magnifieWidth}px`,
            top: `${y - magnifierHeight / 2}px`,
            left: `${x - magnifieWidth / 2}px`,
            opacity: 1,
            border: '1px solid lightgray',
            backgroundColor: 'white',
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
            backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnify;
