import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const dot = dotRef.current; const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0, id;
    const move = e => { mx = e.clientX; my = e.clientY; dot.style.left = `${mx}px`; dot.style.top = `${my}px`; };
    const loop = () => { rx += (mx-rx)*0.12; ry += (my-ry)*0.12; ring.style.left = `${rx}px`; ring.style.top = `${ry}px`; id = requestAnimationFrame(loop); };

    document.addEventListener('mousemove', move);
    id = requestAnimationFrame(loop);
    return () => { document.removeEventListener('mousemove', move); cancelAnimationFrame(id); };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot  hidden sm:block" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring hidden sm:block" aria-hidden="true" />
    </>
  );
}
