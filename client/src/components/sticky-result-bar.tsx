import { useI18n } from "@/lib/i18n";

// Actually useI18n provides formatters.

import { CountUp } from "@/components/count-up";
import { motion, AnimatePresence } from "framer-motion";

interface StickyResultBarProps {
    expectedProfit: number;
    breakEvenRoas: number;
    grossMargin: number;
}

export function StickyResultBar({ expectedProfit, breakEvenRoas, grossMargin }: StickyResultBarProps) {
    const { t, formatCurrency, formatRoas, formatPercent } = useI18n();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/80 backdrop-blur-md border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium">{t("expectedProfit")}</span>
                    <span className="text-xl font-bold text-primary">
                        <CountUp value={expectedProfit} formatter={formatCurrency} />
                    </span>
                </div>

                <div className="h-8 w-px bg-border" />

                <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground font-medium">{t("breakEvenRoas")}</span>
                    <span className="text-lg font-bold text-foreground">
                        <CountUp value={breakEvenRoas} formatter={formatRoas} />
                    </span>
                </div>
            </div>
        </div>
    );
}
