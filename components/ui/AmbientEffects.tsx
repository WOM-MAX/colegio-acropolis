'use client';

import { useEffect, useRef } from 'react';

/**
 * Cascada Digital (Lluvia de 0 y 1 inspirada en Matrix / Estilo Tech Poptin)
 * Renderizado en Canvas 2D ultraligero a 60fps con limpieza automática
 */
export function DigitalRainCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -30));

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -30));
    };

    window.addEventListener('resize', handleResize);

    const chars = '01';
    let lastTime = 0;
    const fpsInterval = 1000 / 30; // 30 FPS para máxima suavidad y mínimo consumo de CPU

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = time - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = time - (elapsed % fpsInterval);

      // Trazo semitransparente para efecto estela (trailing)
      ctx.fillStyle = 'rgba(10, 15, 29, 0.18)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Cabeza de la gota más brillante
        ctx.fillStyle = Math.random() > 0.85 ? '#ffffff' : '#34d399';
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full z-0 ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
}

/**
 * Confeti Festivo (Celebración, bienvenida, matrícula)
 * Partículas multicolores flotantes con balanceo suave
 */
export function ConfettiCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    const particleCount = Math.min(65, Math.floor(width / 15));

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedY: number;
      speedX: number;
      rotation: number;
      rotSpeed: number;
      sway: number;
      swaySpeed: number;
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * -height,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 2 + 1.2,
      speedX: Math.random() * 1 - 0.5,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 4,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.04 + 0.02,
    }));

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * 1.2 + p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -15;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        // Rectángulos delgados simulando papel picado de confeti
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full z-0 ${className}`}
      style={{ opacity: 0.9 }}
    />
  );
}

/**
 * Componente unificador de efectos ambientales
 */
export function AmbientEffectLayer({
  efectoVisual,
  className = '',
}: {
  efectoVisual?: string | null;
  className?: string;
}) {
  if (!efectoVisual || efectoVisual === 'ninguno') return null;

  if (efectoVisual === 'cascada_digital') {
    return <DigitalRainCanvas className={className} />;
  }

  if (efectoVisual === 'confeti') {
    return <ConfettiCanvas className={className} />;
  }

  if (efectoVisual === 'halo_radiante') {
    return (
      <div
        className={`pointer-events-none absolute inset-0 z-0 flex items-center justify-center ${className}`}
      >
        <div className="h-4/5 w-4/5 rounded-full bg-gradient-to-tr from-azul-acropolis/30 via-indigo-500/20 to-purple-500/30 blur-3xl animate-pulse" />
      </div>
    );
  }

  return null;
}
