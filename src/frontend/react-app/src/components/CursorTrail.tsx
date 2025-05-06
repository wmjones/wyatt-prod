import React, { useState, useEffect } from 'react';

interface TrailDot {
  id: number;
  x: number;
  y: number;
  size: number;
}

const CursorTrail: React.FC = () => {
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update counter first, then use its value for the new dot ID
      setCounter((prev) => {
        const newCounter = prev + 1;

        // Use the updated counter value in the trail update to ensure unique keys
        setTrail((prevTrail) => {
          // Add new dot with unique ID
          const newTrail = [
            ...prevTrail,
            {
              id: newCounter, // Use the updated counter value for the ID
              x: mousePos.x,
              y: mousePos.y,
              size: Math.random() * 15 + 5, // Random size between 5 and 20
            },
          ];

          // Keep only the 15 most recent dots
          return newTrail.slice(-15);
        });

        return newCounter;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [mousePos]); // Remove counter dependency as we're updating it correctly now

  return (
    <>
      {trail.map((dot) => (
        <div
          key={dot.id}
          className="cursor-trail"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
          }}
        />
      ))}
    </>
  );
};

export default CursorTrail;
