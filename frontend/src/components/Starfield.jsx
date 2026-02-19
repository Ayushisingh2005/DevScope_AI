import React, { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configuration
    const STAR_COUNT = 400;
    const SPEED = 0.05; // Speed of movement
    const stars = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize stars
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * SPEED + 0.02,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Move stars horizontally (Galaxy drift effect)
        star.x -= star.speed;

        // Reset stars when they go off-screen
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height;
        }

        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * 0.05;
        if (star.opacity < 0.1) star.opacity = 0.1;
        if (star.opacity > 1) star.opacity = 1;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      {/* Moving Stars */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      
      {/* Nebula / Galaxy Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[120px]" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[100px]" />
    </div>
  );
};

export default Starfield;