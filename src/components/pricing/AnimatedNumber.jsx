import { useState, useEffect, useRef } from 'react';

/**
 * AnimatedNumber
 * Smooth count-up rolling transition for financial numbers (0.4–0.6s ease-out).
 * Formats accurately with Indian Numbering System (en-IN).
 */
export function AnimatedNumber({ value, format = 'inr', duration = 500, className = '' }) {
  const target = Number(value) || 0;
  const [displayValue, setDisplayValue] = useState(target);
  const prevTargetRef = useRef(target);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const startValue = prevTargetRef.current;
    const endValue = target;
    prevTargetRef.current = target;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * ease;

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayValue(endValue);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [target, duration]);

  const renderFormatted = () => {
    if (value == null) return '—';
    const num = Number(displayValue);

    if (format === 'rate') {
      return num % 1 === 0 ? `₹${Math.round(num)}` : `₹${num.toFixed(2)}`;
    }
    if (format === 'decimal') {
      return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    // format === 'inr' (integer)
    return `₹${Math.round(num).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return <span className={className}>{renderFormatted()}</span>;
}
