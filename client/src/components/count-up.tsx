import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
    value: number;
    direction?: "up" | "down";
    className?: string;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    formatter?: (value: number) => string;
}

export function CountUp({
    value,
    className,
    formatter
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0); // Start from 0 or previous value
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                // If a formatter is provided, use it. Otherwise, simple toFixed.
                ref.current.textContent = formatter ? formatter(latest) : latest.toFixed(0);
            }
        });
    }, [springValue, formatter]);

    return <span ref={ref} className={className} />;
}
