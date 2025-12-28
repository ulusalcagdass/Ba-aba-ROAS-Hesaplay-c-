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
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });
    // Removed negative margin to ensure it triggers easily. 
    // "once: true" is good to keep it from re-animating.
    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        // creating a closure to format handles strict effect
        const updateText = (val: number) => {
            if (ref.current) {
                ref.current.textContent = formatter ? formatter(val) : val.toFixed(0);
            }
        }

        // Initialize immediately
        updateText(springValue.get());

        return springValue.on("change", (latest) => {
            updateText(latest);
        });
    }, [springValue, formatter]);

    return <span ref={ref} className={className} />;
}
