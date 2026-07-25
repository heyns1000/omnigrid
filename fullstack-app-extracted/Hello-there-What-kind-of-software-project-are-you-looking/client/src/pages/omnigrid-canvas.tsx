import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type CanvasMode = "particles" | "grid";

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export default function OmniGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const [mode, setMode] = useState<CanvasMode>("particles");
  const [density, setDensity] = useState(180);
  const [label, setLabel] = useState("OMNIGRID");
  const [fps, setFps] = useState(0);

  const palette = useMemo(
    () => ({
      primary: "#00e7ff",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      bg: "#05070f",
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || 560;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dotsRef.current = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
      }));
    };

    let frames = 0;
    let lastFps = performance.now();

    const animate = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ptr = pointerRef.current;

      ctx.fillStyle = mode === "particles" ? "rgba(5,7,15,0.34)" : "rgba(5,7,15,0.22)";
      ctx.fillRect(0, 0, width, height);

      if (mode === "grid") {
        ctx.strokeStyle = `${palette.secondary}50`;
        ctx.lineWidth = 1;
        const spacing = 34;
        for (let x = 0; x <= width; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y <= height; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const p = dots[i];
        if (ptr.active) {
          const dx = ptr.x - p.x;
          const dy = ptr.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 0) {
            const force = (140 - dist) / 140;
            p.vx -= (dx / dist) * force * 0.55;
            p.vy -= (dy / dist) * force * 0.55;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        ctx.fillStyle = i % 5 === 0 ? palette.secondary : palette.primary;
        ctx.beginPath();
        ctx.arc(p.x, p.y, mode === "particles" ? 2.2 : 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = `${palette.accent}35`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${Math.min(width / Math.max(label.length * 0.65, 6), 180)}px Inter, sans-serif`;
      ctx.fillText(label, width / 2, height / 2);

      frames += 1;
      const now = performance.now();
      if (now - lastFps >= 1000) {
        setFps(frames);
        frames = 0;
        lastFps = now;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    resize();
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    frameRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [density, label, mode, palette]);

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-cyan-600/20 p-4">
          <h1 className="text-2xl font-extrabold tracking-wide text-white">OmniGrid™ Canvas</h1>
          <p className="text-sm text-slate-200">Core public pulse styling + interactive matrix engine.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
          <Button size="sm" variant={mode === "particles" ? "default" : "outline"} onClick={() => setMode("particles")}>
            Particle Text
          </Button>
          <Button size="sm" variant={mode === "grid" ? "default" : "outline"} onClick={() => setMode("grid")}>
            Cyber Grid
          </Button>
          <input
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={label}
            maxLength={16}
            onChange={(e) => setLabel(e.target.value.toUpperCase())}
            aria-label="Canvas label"
          />
          <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            Density
            <input
              type="range"
              min={80}
              max={420}
              step={20}
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
            />
            <span className="w-10 text-right font-mono text-foreground">{density}</span>
          </label>
        </div>

        <div className="relative h-[560px] overflow-hidden rounded-xl border border-cyan-500/20 bg-[#05070f]">
          <canvas
            ref={canvasRef}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              pointerRef.current.x = e.clientX - rect.left;
              pointerRef.current.y = e.clientY - rect.top;
              pointerRef.current.active = true;
            }}
            onMouseLeave={() => {
              pointerRef.current.active = false;
            }}
            className="block h-full w-full"
          />
          <div className="pointer-events-none absolute left-3 top-3 rounded bg-black/40 px-2 py-1 text-xs text-cyan-300">
            {fps} FPS
          </div>
        </div>
      </div>
    </section>
  );
}
