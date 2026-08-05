import { useEffect, useState, useRef } from "react";

function CountUp({ end, duration = 1200 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            setValue(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(tick);
            else setValue(end);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{value}</span>;
}

export default CountUp;