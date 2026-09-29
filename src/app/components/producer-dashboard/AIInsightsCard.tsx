import { useState } from "react";
import { motion } from "motion/react";
import { Bot, Mic, TrendingUp, Calendar, Sparkles, Shield } from "lucide-react";
import { DSButton, DSCard, DSBadge, designTokens } from "../../design-system";
import { grokAI } from "./GrokAIService";

const { colors, typography } = designTokens;

const demandSupplyData = [
  { month: "Oct", demand: 85, supply: 75 },
  { month: "Nov", demand: 92, supply: 78 },
  { month: "Dec", demand: 88, supply: 82 },
  { month: "Jan", demand: 95, supply: 80 },
  { month: "Feb", demand: 100, supply: 85 },
  { month: "Mar", demand: 105, supply: 88 },
];

const SUGGESTED_QUERIES = [
  "Any fraud detected?",
  "Check for anomalies",
  "Best time to sell?",
  "Review my transactions",
  "Scan for unusual patterns",
];

// Pure SVG sparkline — no recharts, no duplicate key warnings
function DemandSupplyChart({ data }: { data: typeof demandSupplyData }) {
  const W = 300, H = 100;
  const PAD = { top: 8, right: 8, bottom: 22, left: 28 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const allVals = data.flatMap(d => [d.demand, d.supply]);
  const min = Math.min(...allVals) * 0.94;
  const max = Math.max(...allVals) * 1.06;

  const cx = (i: number) => PAD.left + (i / (data.length - 1)) * plotW;
  const cy = (v: number) => PAD.top + plotH - ((v - min) / (max - min)) * plotH;

  const linePath = (key: "demand" | "supply") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${cx(i).toFixed(1)} ${cy(d[key]).toFixed(1)}`).join(" ");

  const areaPath = (key: "demand" | "supply") => {
    const pts = data.map((d, i) => `${cx(i).toFixed(1)},${cy(d[key]).toFixed(1)}`);
    const baseY = (PAD.top + plotH).toFixed(1);
    return `M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(" ")} L ${cx(data.length - 1).toFixed(1)},${baseY} L ${cx(0).toFixed(1)},${baseY} Z`;
  };

  const demandColor = colors.status.success;
  const supplyColor = colors.status.info;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
        {/* Grid lines */}
        {[0.33, 0.66].map(t => {
          const ly = PAD.top + plotH * (1 - t);
          return (
            <line key={t} x1={PAD.left} y1={ly} x2={W - PAD.right} y2={ly}
              stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" />
          );
        })}
        {/* Area fills */}
        <path d={areaPath("demand")} fill={demandColor} fillOpacity={0.12} />
        <path d={areaPath("supply")} fill={supplyColor} fillOpacity={0.12} />
        {/* Lines */}
        <path d={linePath("demand")} fill="none" stroke={demandColor} strokeWidth="2" />
        <path d={linePath("supply")} fill="none" stroke={supplyColor} strokeWidth="2" />
        {/* Dots */}
        {data.map((d, i) => (
          <g key={d.month}>
            <circle cx={cx(i)} cy={cy(d.demand)} r="3" fill={demandColor} />
            <circle cx={cx(i)} cy={cy(d.supply)} r="3" fill={supplyColor} />
            <text x={cx(i)} y={H - 5} textAnchor="middle" fontSize="9" fill="#8B9AA8">{d.month}</text>
          </g>
        ))}
        {/* Y labels */}
        <text x={PAD.left - 3} y={PAD.top + 4} textAnchor="end" fontSize="8" fill="#8B9AA8" dominantBaseline="hanging">{Math.round(max)}</text>
        <text x={PAD.left - 3} y={PAD.top + plotH} textAnchor="end" fontSize="8" fill="#8B9AA8">{Math.round(min)}</text>
      </svg>
    </div>
  );
}

export function AIInsightsCard() {
  const [isListening, setIsListening] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const processGrokQuery = async (query: string) => {
    setIsProcessing(true);
    setTimeout(async () => {
      const response = await grokAI.processVoiceQuery(query);
      setAiResponse(response);
      setIsProcessing(false);
    }, 1000);
  };

  const handleVoiceQuery = () => {
    setIsListening(prev => {
      if (!prev) {
        setTimeout(() => {
          const queries = [
            "Any fraud detected in my last trade?",
            "What's the best time to sell wheat?",
            "Check for anomalies in my transactions",
            "Review my recent activities for issues",
          ];
          const randomQuery = queries[Math.floor(Math.random() * queries.length)];
          setAiQuery(randomQuery);
          setIsListening(false);
          processGrokQuery(randomQuery);
        }, 2000);
      }
      return !prev;
    });
  };

  const handleAskGrok = () => {
    if (aiQuery.trim()) processGrokQuery(aiQuery);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <DSCard variant="gold" padding="lg" className="border-2" style={{ borderColor: colors.accent.gold }}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${colors.accent.gold}, ${colors.accent.goldDark})` }}>
            <Sparkles size={24} style={{ color: "white" }} />
          </div>
          <div>
            <h3 style={{ fontFamily: typography.fonts.subheading, fontSize: typography.sizes.lg,
              fontWeight: typography.weights.bold, color: colors.blue.primary }}>
              Grok AI Insights &amp; Fraud Detection
            </h3>
            <p style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
              Powered by xAI Grok - Real-time Analysis &amp; Anomaly Detection
            </p>
          </div>
        </div>

        {/* Demand/Supply Chart — pure SVG, no recharts */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 style={{ fontSize: typography.sizes.base, fontWeight: typography.weights.semibold, color: colors.text.primary }}>
              📊 Demand &amp; Supply Forecast
            </h4>
            <DSBadge variant="success" size="sm">Next 6 Months</DSBadge>
          </div>

          <DemandSupplyChart data={demandSupplyData} />

          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.status.success }} />
              <span style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>Market Demand</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.status.info }} />
              <span style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>Your Supply</span>
            </div>
          </div>
        </div>

        {/* Best Time to Sell */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${colors.status.success}15` }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.status.success }}>
              <TrendingUp size={20} style={{ color: "white" }} />
            </div>
            <div className="flex-1">
              <h4 className="mb-2" style={{ fontSize: typography.sizes.base, fontWeight: typography.weights.semibold, color: colors.text.primary }}>
                🎯 Best Time to Sell
              </h4>
              <p className="mb-3" style={{ fontSize: typography.sizes.sm, color: colors.text.secondary, lineHeight: 1.6 }}>
                Based on AI analysis of market trends, weather patterns, and historical data:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: colors.status.success }} />
                  <span style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium }}>
                    <strong>Wheat:</strong> 10-14 days (Expected +8-10% price increase)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: colors.status.warning }} />
                  <span style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium }}>
                    <strong>Mustard:</strong> Wait 3-4 weeks (Demand building up)
                  </span>
                </div>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <DSBadge variant="success" size="sm">High Confidence</DSBadge>
                <DSBadge variant="blue" size="sm">95% Accuracy</DSBadge>
              </div>
            </div>
          </div>
        </div>

        {/* Grok Voice Assistant */}
        <div className="p-4 rounded-lg border-2 border-dashed"
          style={{ borderColor: colors.accent.gold, backgroundColor: `${colors.accent.gold}05` }}>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield size={24} style={{ color: colors.accent.gold }} />
              <Bot size={24} style={{ color: colors.accent.gold }} />
            </div>
            <h4 style={{ fontSize: typography.sizes.base, fontWeight: typography.weights.semibold, color: colors.text.primary }}>
              Ask Grok AI Assistant
            </h4>
            <DSBadge variant="gold" size="sm">Fraud Detection</DSBadge>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAskGrok()}
              placeholder="Ask about market trends, fraud detection..."
              className="flex-1 min-w-0 px-3 py-2 rounded-lg border outline-none text-sm"
              style={{ borderColor: colors.border?.default || "#D1D5DB", fontSize: typography.sizes.sm }}
            />
            <DSButton variant={isListening ? "primary" : "outline"} size="md" onClick={handleVoiceQuery}
              className={isListening ? "animate-pulse" : ""} disabled={isProcessing}>
              <Mic size={18} />
            </DSButton>
            <DSButton variant="primary" size="md" onClick={handleAskGrok} disabled={isProcessing}>
              {isProcessing ? "…" : "Ask"}
            </DSButton>
          </div>

          {aiResponse && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-lg mb-3"
              style={{ backgroundColor: colors.surface?.secondary || "#F3F4F6", border: `1px solid ${colors.border?.light || "#E5E7EB"}` }}>
              <div className="flex items-start gap-2">
                <Bot size={18} style={{ color: colors.accent.gold, marginTop: "2px" }} />
                <p style={{ fontSize: typography.sizes.sm, color: colors.text.primary, lineHeight: 1.6 }}>
                  {aiResponse}
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex flex-wrap gap-2">
            <span style={{ fontSize: typography.sizes.xs, color: colors.text.muted }}>Suggested:</span>
            {SUGGESTED_QUERIES.map(query => (
              <button key={query}
                onClick={() => { setAiQuery(query); processGrokQuery(query); }}
                className="px-3 py-1 rounded-full text-xs transition-colors"
                style={{ backgroundColor: colors.surface?.secondary || "#F3F4F6", color: colors.text.secondary,
                  border: `1px solid ${colors.border?.light || "#E5E7EB"}` }}
                disabled={isProcessing}>
                {query}
              </button>
            ))}
          </div>
        </div>

      </DSCard>
    </motion.div>
  );
}
