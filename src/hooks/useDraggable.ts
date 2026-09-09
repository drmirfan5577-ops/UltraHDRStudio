import { useState, useEffect, useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useDraggable(initialPos: Position) {
  const [pos, setPos] = useState<Position>(initialPos);
  const dragging = useRef(false);
  const startPos = useRef<Position>({ x: 0, y: 0 });
  const startMouse = useRef<Position>({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startMouse.current = { x: clientX, y: clientY };
    startPos.current = { ...pos };
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - startMouse.current.x;
      const dy = clientY - startMouse.current.y;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 70, startPos.current.x + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 70, startPos.current.y + dy)),
      });
    };

    const onUp = () => { dragging.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return { pos, onMouseDown };
}
