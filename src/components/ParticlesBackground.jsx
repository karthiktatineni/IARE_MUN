import { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let w, h, particles;
        let animationFrameId;


        // Brighter Gold particle color for better visibility
        const color = 'rgba(212,175,55,';

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            // Increased density for more visible particles
            const density = Math.min(150, Math.max(80, Math.floor(window.innerWidth / 15)));

            particles = Array.from({ length: density }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                r: Math.random() * 2.5 + 0.8, // Increased size: 0.8 to 3.3
                a: Math.random() * 0.6 + 0.1 // Increased opacity: 0.4 to 1.0
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h); // transparent background

            for (let p of particles) {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                // Glow effect
                ctx.beginPath();
                ctx.fillStyle = color + p.a + ')';
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                // Occasional streak
                if (Math.random() < 0.005) {
                    ctx.beginPath();
                    ctx.strokeStyle = color + (p.a * 0.6) + ')';
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + p.vx * 60, p.y + p.vy * 60);
                    ctx.stroke();
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        // Initial setup
        resize();
        draw();

        // Event listeners
        window.addEventListener('resize', resize, { passive: true });

        // Cleanup
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="particles"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
                background: 'transparent'
            }}
        />
    );
};

export default ParticlesBackground;
