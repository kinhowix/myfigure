import { useEffect, useRef } from 'react';

export default function Fireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles = [];
    let rockets = [];

    class Rocket {
      constructor(x, y, tx, ty, color) {
        this.x = x;
        this.y = y;
        this.tx = tx;
        this.ty = ty;
        this.color = color;
        this.speed = 3.5;
        this.angle = Math.atan2(ty - y, tx - x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        const dist = Math.hypot(this.tx - this.x, this.ty - this.y);
        return dist < 6;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 4.5 + 1;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.012;
        this.gravity = 0.04;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
        return this.alpha <= 0;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const colors = ['#ff2a5f', '#ff7a00', '#ffd600', '#00ff66', '#00e5ff', '#a200ff', '#ff00d6'];

    const spawnRocket = () => {
      const x = Math.random() * canvas.width;
      const y = canvas.height;
      const tx = Math.random() * canvas.width;
      const ty = Math.random() * (canvas.height * 0.5) + (canvas.height * 0.1);
      const color = colors[Math.floor(Math.random() * colors.length)];
      rockets.push(new Rocket(x, y, tx, ty, color));
    };

    const explode = (x, y, color) => {
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    let spawnTimer = 0;

    const loop = () => {
      // Semi-transparent background clear creates a trailing effect
      ctx.fillStyle = 'rgba(10, 10, 12, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      spawnTimer++;
      if (spawnTimer % 22 === 0) {
        spawnRocket();
      }

      rockets = rockets.filter(rocket => {
        rocket.draw();
        const exploded = rocket.update();
        if (exploded) {
          explode(rocket.x, rocket.y, rocket.color);
        }
        return !exploded;
      });

      particles = particles.filter(particle => {
        particle.draw();
        return !particle.update();
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9990,
      }}
    />
  );
}
