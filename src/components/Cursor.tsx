import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let isHovering = false;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mx}px`;
        cursorRef.current.style.top = `${my}px`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHovering = target.matches('button, a, input, select, textarea, .step-card, .check-item, .export-card, .hist-item, .color-tile, .manifest-section-header, .layer, .restrict-check, [role="button"]');
      
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.width = isHovering ? '22px' : '12px';
        cursorRef.current.style.height = isHovering ? '22px' : '12px';
        ringRef.current.style.width = isHovering ? '50px' : '36px';
        ringRef.current.style.height = isHovering ? '50px' : '36px';
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);

    const render = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed bg-accent rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200 mix-blend-difference w-[12px] h-[12px]"
      />
      <div
        ref={ringRef}
        className="fixed border border-accent rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 opacity-50 transition-[width,height] duration-200 w-[36px] h-[36px]"
      />
    </>
  );
}
