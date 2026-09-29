import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Leaf,
  Package,
  TrendingUp,
  User,
  ChevronRight,
  Bell,
  ArrowLeft,
  Settings,
  Calendar,
  CheckCircle2,
  Sprout,
  DollarSign,
  QrCode,
  Shield,
  Warehouse,
  Truck,
  Mic,
  Camera,
  MapPin,
  Star,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { languages } from "./components/CountryLanguageData";
import { OTPVerificationScreen } from "./components/OTPVerificationScreen";
import { ComprehensiveKYCSystem } from "./components/kyc/ComprehensiveKYCSystem";
import ProducerMasterFlowNavigator from "./components/producer-dashboard/ProducerMasterFlowNavigator";
import { ProducerAIDashboardComplete } from "./components/ProducerAIDashboardComplete";
import { ActivityLoggerEnhanced } from "./components/producer-dashboard/ActivityLoggerEnhanced";
import { InputCostTrackerEnhanced } from "./components/producer-dashboard/InputCostTrackerEnhanced";
import { CropHealthMonitor } from "./components/producer-dashboard/CropHealthMonitor";
import CropSelectionWithAI from "./components/producer-dashboard/CropSelectionWithAI";
import HarvestCommodityListing from "./components/producer-dashboard/HarvestCommodityListing";
import { EnhancedQualityCheckWithAI } from "./components/producer-dashboard/EnhancedQualityCheckWithAI";
import LotCreationTokenizationWorkflow from "./components/producer-dashboard/LotCreationTokenizationWorkflow";
import QRCodeManager from "./components/QRCodeManager";
import ProvenanceTracker from "./components/producer-dashboard/ProvenanceTracker";
import { StorageAndSellDashboard } from "./components/producer-dashboard/StorageAndSellDashboard";
import { StorageSellDecisionScreen } from "./components/producer-dashboard/StorageSellDecisionScreen";
import { MarketplaceAgentBrowsingScreen } from "./components/producer-dashboard/MarketplaceAgentBrowsingScreen";
import { BuyerVerificationView } from "./components/producer-dashboard/BuyerVerificationView";
import { ProducerProfile } from "./components/producer-dashboard/ProducerProfile";
import { ChatGPTIntegrationDemo } from "./components/ChatGPTIntegrationDemo";
import { Toaster } from "./components/ui/sonner";
import tradieLogo from "figma:asset/f956260347dc5e875bfaa9ef290c3ac5a8e7e3d9.png";
import { designTokens } from "./design-system";

const { colors, typography } = designTokens;

// ── Types ──────────────────────────────────────────────────────────────────

type AppState =
  | "splash"
  | "otp"
  | "app"
  | "full-journey"
  | "dashboard-ai"
  | "activities"
  | "input-cost"
  | "crop-health"
  | "crop-selection"
  | "harvest"
  | "quality"
  | "lot-creation"
  | "qr-manager"
  | "provenance"
  | "store-sell-dashboard"
  | "store-sell-decision"
  | "marketplace"
  | "buyer-verification"
  | "profile-full"
  | "kyc"
  | "ai-assistant";

type BottomTab = "home" | "farm" | "lots" | "sell" | "profile";

// ── Mock producer context ──────────────────────────────────────────────────

const PRODUCER = {
  name: "Ravi Kumar",
  village: "Anantapur, Andhra Pradesh",
  crops: [
    { name: "Wheat", acres: 12, harvestIn: 15, health: 88 },
  ],
  pendingActions: [
    {
      id: "1",
      label: "Log today's irrigation",
      urgency: "high",
      icon: Leaf,
    },
    {
      id: "2",
      label: "Review quality report for Lot #W-002",
      urgency: "medium",
      icon: CheckCircle2,
    },
    {
      id: "3",
      label: "Confirm storage booking",
      urgency: "low",
      icon: Warehouse,
    },
  ],
  lots: [
    {
      id: "W-001",
      crop: "Wheat",
      qty: "42 qtl",
      status: "In Storage",
      grade: "A+",
    },
    {
      id: "W-002",
      crop: "Wheat",
      qty: "38 qtl",
      status: "Quality Check",
      grade: "Pending",
    },
  ],
  todaySummary: {
    activities: 2,
    costs: "₹1,240",
    weather: "Clear, 28°C",
  },
  journeyStage: 3, // 0-6 index for current stage
};

// ── Journey Progress ───────────────────────────────────────────────────────

const JOURNEY_STAGES = [
  { label: "Farm", emoji: "🌱", color: "#10B981" },
  { label: "Grow", emoji: "🌿", color: "#059669" },
  { label: "Harvest", emoji: "🌾", color: "#F59E0B" },
  { label: "Quality", emoji: "🔬", color: "#8B5CF6" },
  { label: "Lot", emoji: "📦", color: "#0E7490" },
  { label: "Sell", emoji: "💰", color: "#EF4444" },
  { label: "Done", emoji: "✅", color: "#22C55E" },
];

function JourneyProgressBar({
  currentStage,
  onOpen,
}: {
  currentStage: number;
  onOpen: () => void;
}) {
  return (
    <div className="px-4 pt-3 pb-1">
      <div
        className="rounded-2xl p-3"
        style={{
          backgroundColor: "white",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-xs font-bold"
            style={{ color: colors.blue.primary }}
          >
            Producer Journey
          </p>
          <button
            onClick={onOpen}
            className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${colors.blue.primary}12`,
              color: colors.blue.primary,
            }}
          >
            Open full flow <ChevronRight size={12} />
          </button>
        </div>
        {/* Horizontal stage chips — scroll if needed */}
        <div
          className="flex gap-1.5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {JOURNEY_STAGES.map((stage, i) => {
            const isDone = i < currentStage;
            const isActive = i === currentStage;
            return (
              <div
                key={stage.label}
                className="flex-shrink-0 flex flex-col items-center gap-0.5"
                style={{ minWidth: 44 }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
                  style={{
                    backgroundColor: isDone
                      ? stage.color
                      : isActive
                        ? `${stage.color}20`
                        : "#F3F4F6",
                    border: isActive
                      ? `2px solid ${stage.color}`
                      : isDone
                        ? "none"
                        : "1px solid #E5E7EB",
                    boxShadow: isActive
                      ? `0 0 0 3px ${stage.color}22`
                      : "none",
                  }}
                >
                  {isDone ? "✓" : stage.emoji}
                </div>
                <p
                  className="text-center leading-tight"
                  style={{
                    fontSize: 9,
                    color: isActive
                      ? stage.color
                      : isDone
                        ? "#6B7280"
                        : "#9CA3AF",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {stage.label}
                </p>
              </div>
            );
          })}
        </div>
        {/* Progress bar */}
        <div
          className="mt-2 h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "#F3F4F6" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(currentStage / (JOURNEY_STAGES.length - 1)) * 100}%`,
              background:
                "linear-gradient(90deg, #10B981, #FFD700, #EF4444)",
            }}
          />
        </div>
        <p
          className="text-xs mt-1"
          style={{ color: colors.text.muted }}
        >
          Stage {currentStage + 1} of {JOURNEY_STAGES.length} ·{" "}
          {JOURNEY_STAGES[currentStage]?.label}
        </p>
      </div>
    </div>
  );
}

// ── Reusable pieces ────────────────────────────────────────────────────────

const ActionCard: React.FC<{
  icon: React.ElementType;
  label: string;
  sub?: string;
  color?: string;
  onClick: () => void;
  badge?: string;
}> = ({
  icon: Icon,
  label,
  sub,
  color = colors.blue.primary,
  onClick,
  badge,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all active:scale-[0.98]"
    style={{
      backgroundColor: "white",
      border: `1px solid ${color}22`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}
  >
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${color}18` }}
    >
      <Icon size={20} style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <p
        className="font-semibold text-sm truncate"
        style={{ color: colors.text.primary }}
      >
        {label}
      </p>
      {sub && (
        <p
          className="text-xs truncate"
          style={{ color: colors.text.muted }}
        >
          {sub}
        </p>
      )}
    </div>
    {badge && (
      <span
        className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {badge}
      </span>
    )}
    <ChevronRight
      size={16}
      style={{ color: colors.text.muted, flexShrink: 0 }}
    />
  </button>
);

const SectionHeader: React.FC<{
  title: string;
  sub?: string;
}> = ({ title, sub }) => (
  <div className="px-4 pt-5 pb-2">
    <h2
      className="text-base font-bold"
      style={{
        fontFamily: typography.fonts.heading,
        color: colors.blue.primary,
      }}
    >
      {title}
    </h2>
    {sub && (
      <p
        className="text-xs mt-0.5"
        style={{ color: colors.text.muted }}
      >
        {sub}
      </p>
    )}
  </div>
);

const PendingBadge: React.FC<{ urgency: string }> = ({
  urgency,
}) => {
  const map: Record<string, { label: string; color: string }> =
    {
      high: { label: "Urgent", color: "#EF4444" },
      medium: { label: "Today", color: "#F59E0B" },
      low: { label: "Soon", color: "#6B7280" },
    };
  const { label, color } = map[urgency] || map.low;
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {label}
    </span>
  );
};

// ── Tab: Home ──────────────────────────────────────────────────────────────

function HomeTab({
  onNavigate,
}: {
  onNavigate: (s: AppState) => void;
}) {
  return (
    <div
      className="overflow-y-auto overflow-x-hidden"
      style={{
        paddingBottom:
          "calc(72px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Hero greeting */}
      <div className="px-4 pt-4">
        <div
          className="rounded-2xl p-4"
          style={{
            background: `linear-gradient(135deg, ${colors.blue.primary} 0%, #0072C6 100%)`,
          }}
        >
          <p
            className="text-xs font-medium mb-0.5"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Good morning, 👨‍🌾
          </p>
          <h1
            className="text-xl font-bold mb-0.5"
            style={{
              fontFamily: typography.fonts.heading,
              color: "#FFD700",
            }}
          >
            {PRODUCER.name}
          </h1>
          <p
            className="text-xs mb-3"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            📍 {PRODUCER.village}
          </p>
          {/* Today chips */}
          <div className="flex gap-2 flex-wrap">
            {[
              `🌾 Wheat · 12 ac`,
              `🌡 ${PRODUCER.todaySummary.weather}`,
              `⏰ Harvest in ${PRODUCER.crops[0].harvestIn}d`,
            ].map((chip) => (
              <div
                key={chip}
                className="px-2.5 py-1 rounded-lg"
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              >
                <p className="text-xs font-semibold text-white">
                  {chip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journey Progress */}
      <JourneyProgressBar
        currentStage={PRODUCER.journeyStage}
        onOpen={() => onNavigate("full-journey")}
      />

      {/* What to do now */}
      {PRODUCER.pendingActions.length > 0 && (
        <>
          <SectionHeader
            title="What to do now"
            sub="Pending actions for your farm"
          />
          <div className="px-4 space-y-2">
            {PRODUCER.pendingActions.map((action) => (
              <div
                key={action.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                }}
              >
                <action.icon
                  size={18}
                  style={{
                    color: colors.blue.primary,
                    flexShrink: 0,
                  }}
                />
                <p
                  className="flex-1 min-w-0 text-sm font-medium leading-tight"
                  style={{ color: colors.text.primary }}
                >
                  {action.label}
                </p>
                <PendingBadge urgency={action.urgency} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Primary CTA */}
      <div className="px-4 pt-4">
        <button
          onClick={() => onNavigate("full-journey")}
          className="w-full p-4 rounded-2xl text-center font-bold text-base transition-all active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)",
            color: colors.blue.primary,
            boxShadow: "0 4px 16px rgba(255,215,0,0.4)",
          }}
        >
          🌾 Open Complete Producer Journey
          <p className="text-xs font-normal mt-0.5 opacity-80">
            26-stage flow · All steps in one place
          </p>
        </button>
      </div>

      {/* My Lots */}
      <SectionHeader
        title="My Lots"
        sub="Recent harvest lots"
      />
      <div className="px-4 space-y-2">
        {PRODUCER.lots.map((lot) => (
          <div
            key={lot.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border"
            style={{ borderColor: "#E5E7EB" }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#0E749018" }}
            >
              <Package size={18} style={{ color: "#0E7490" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: colors.text.primary }}
              >
                Lot #{lot.id} · {lot.crop}
              </p>
              <p
                className="text-xs"
                style={{ color: colors.text.muted }}
              >
                {lot.qty} · Grade: {lot.grade}
              </p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
              style={{
                backgroundColor:
                  lot.status === "In Storage"
                    ? "#10B98118"
                    : "#F59E0B18",
                color:
                  lot.status === "In Storage"
                    ? "#10B981"
                    : "#F59E0B",
              }}
            >
              {lot.status}
            </span>
          </div>
        ))}
        <ActionCard
          icon={TrendingUp}
          label="Sell or Store my lots"
          sub="Make the sell / store decision"
          color="#EF4444"
          onClick={() => onNavigate("store-sell-decision")}
        />
      </div>

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" />
      <div className="px-4 grid grid-cols-2 gap-2 pb-4">
        {[
          {
            icon: Leaf,
            label: "Log Activity",
            color: "#10B981",
            action: "activities" as AppState,
          },
          {
            icon: DollarSign,
            label: "Add Costs",
            color: "#F59E0B",
            action: "input-cost" as AppState,
          },
          {
            icon: Camera,
            label: "Crop Health",
            color: "#8B5CF6",
            action: "crop-health" as AppState,
          },
          {
            icon: Mic,
            label: "AI Assistant",
            color: "#0EA5E9",
            action: "ai-assistant" as AppState,
          },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.action)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border transition-all active:scale-95"
            style={{ borderColor: `${item.color}22` }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <item.icon
                size={22}
                style={{ color: item.color }}
              />
            </div>
            <span
              className="text-xs font-semibold text-center"
              style={{ color: colors.text.primary }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Farm ──────────────────────────────────────────────────────────────

function FarmTab({
  onNavigate,
}: {
  onNavigate: (s: AppState) => void;
}) {
  return (
    <div
      className="overflow-y-auto overflow-x-hidden"
      style={{
        paddingBottom:
          "calc(72px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Active crop hero */}
      <div className="px-4 pt-4">
        <div
          className="rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, #065F46, #10B981)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sprout size={22} color="white" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-base">
                Wheat · 12 Acres
              </p>
              <p className="text-white/70 text-xs">
                Sown 75 days ago · Harvest in 15 days
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: "83%",
                  backgroundColor: "#FFD700",
                }}
              />
            </div>
            <span className="text-white text-xs font-semibold flex-shrink-0">
              83% grown
            </span>
          </div>
          <p className="text-white/60 text-xs mt-2">
            🌡 Crop health: 88% · Soil moisture: Good
          </p>
        </div>
      </div>

      {/* Farm stats */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Activities", value: "2", icon: "📋" },
            {
              label: "Cost Today",
              value: "₹1,240",
              icon: "💰",
            },
            { label: "Health", value: "88%", icon: "🌱" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3 text-center bg-white border"
              style={{ borderColor: "#E5E7EB" }}
            >
              <p className="text-lg mb-0.5">{stat.icon}</p>
              <p
                className="text-sm font-bold"
                style={{ color: colors.blue.primary }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs leading-tight"
                style={{ color: colors.text.muted }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <SectionHeader
        title="Farm Management"
        sub="Manage your farm, crops and activities"
      />
      <div className="px-4 space-y-2">
        <ActionCard
          icon={Sprout}
          label="Crop Selection & AI Advice"
          sub="Choose crop with AI recommendation"
          color="#10B981"
          onClick={() => onNavigate("crop-selection")}
        />
        <ActionCard
          icon={Leaf}
          label="Log Activity"
          sub="Irrigation, fertiliser, pesticide, ploughing"
          color="#065F46"
          onClick={() => onNavigate("activities")}
        />
        <ActionCard
          icon={DollarSign}
          label="Input Cost Tracker"
          sub="Track seeds, labour, equipment costs"
          color="#F59E0B"
          onClick={() => onNavigate("input-cost")}
          badge="₹ Costs"
        />
        <ActionCard
          icon={Camera}
          label="Crop Health Monitor"
          sub="AI photo analysis · Pest & disease alerts"
          color="#8B5CF6"
          onClick={() => onNavigate("crop-health")}
        />
        <ActionCard
          icon={Calendar}
          label="Crop Journal"
          sub="Daily log · Growth photos · Notes"
          color="#0EA5E9"
          onClick={() => onNavigate("full-journey")}
        />
      </div>
      <div className="h-4" />
    </div>
  );
}

// ── Tab: Lots ──────────────────────────────────────────────────────────────

function LotsTab({
  onNavigate,
}: {
  onNavigate: (s: AppState) => void;
}) {
  return (
    <div
      className="overflow-y-auto overflow-x-hidden"
      style={{
        paddingBottom:
          "calc(72px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <SectionHeader
        title="Harvest & Lots"
        sub="Record harvest, quality check, create digital lot ID"
      />
      <div className="px-4 space-y-2">
        <ActionCard
          icon={Package}
          label="Record Harvest"
          sub="Commodity · Quantity · Harvest media"
          color="#F59E0B"
          onClick={() => onNavigate("harvest")}
        />
        <ActionCard
          icon={CheckCircle2}
          label="Quality Check"
          sub="Sampling · AI grading · Lab results"
          color="#7C3AED"
          onClick={() => onNavigate("quality")}
          badge="AI"
        />
        <ActionCard
          icon={Shield}
          label="Create Lot & Digital ID"
          sub="Tokenize your lot · Secure record"
          color="#0E7490"
          onClick={() => onNavigate("lot-creation")}
        />
        <ActionCard
          icon={QrCode}
          label="QR Code Manager"
          sub="Scan · Share · Print lot QR codes"
          color="#0F766E"
          onClick={() => onNavigate("qr-manager")}
        />
        <ActionCard
          icon={MapPin}
          label="Provenance Tracker"
          sub="Full crop-to-buyer traceability chain"
          color="#065F46"
          onClick={() => onNavigate("provenance")}
        />
      </div>

      <SectionHeader title="My Lots" />
      <div className="px-4 space-y-2 pb-2">
        {PRODUCER.lots.map((lot) => (
          <div
            key={lot.id}
            className="p-4 rounded-xl bg-white border"
            style={{ borderColor: "#E5E7EB" }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <p
                  className="text-sm font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Lot #{lot.id}
                </p>
                <p
                  className="text-xs"
                  style={{ color: colors.text.muted }}
                >
                  {lot.crop} · {lot.qty}
                </p>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                style={{
                  backgroundColor:
                    lot.status === "In Storage"
                      ? "#10B98118"
                      : "#F59E0B18",
                  color:
                    lot.status === "In Storage"
                      ? "#10B981"
                      : "#F59E0B",
                }}
              >
                {lot.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate("qr-manager")}
                className="flex-1 py-2 rounded-lg text-xs font-medium border"
                style={{
                  borderColor: "#0F766E",
                  color: "#0F766E",
                }}
              >
                View QR
              </button>
              <button
                onClick={() =>
                  onNavigate("store-sell-decision")
                }
                className="flex-1 py-2 rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: "#EF4444" }}
              >
                Sell Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Sell ──────────────────────────────────────────────────────────────

function SellTab({
  onNavigate,
}: {
  onNavigate: (s: AppState) => void;
}) {
  return (
    <div
      className="overflow-y-auto overflow-x-hidden"
      style={{
        paddingBottom:
          "calc(72px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="px-4 pt-4">
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-3"
          style={{ color: colors.text.muted }}
        >
          What would you like to do with your lot?
        </p>
        {/* Stacked decision buttons — prevents overflow on narrow screens */}
        <div className="flex flex-col gap-3 mb-5">
          <button
            onClick={() => onNavigate("store-sell-decision")}
            className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-base active:scale-[0.98] transition-all"
            style={{
              background:
                "linear-gradient(135deg, #EF4444, #DC2626)",
              color: "white",
              boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
            }}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={26} />
            </div>
            <div className="text-left">
              <p className="font-bold">SELL NOW</p>
              <p className="text-xs font-normal opacity-80 mt-0.5">
                Direct sale · Auction · Marketplace
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("store-sell-dashboard")}
            className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-base active:scale-[0.98] transition-all"
            style={{
              background:
                "linear-gradient(135deg, #0E7490, #0EA5E9)",
              color: "white",
              boxShadow: "0 4px 16px rgba(14,116,144,0.3)",
            }}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Warehouse size={26} />
            </div>
            <div className="text-left">
              <p className="font-bold">
                STORE &amp; SELL LATER
              </p>
              <p className="text-xs font-normal opacity-80 mt-0.5">
                Find storage · Get best price later
              </p>
            </div>
          </button>
        </div>
      </div>

      <SectionHeader
        title="Selling Journey"
        sub="Marketplace · Buyers · Transport · Settlement"
      />
      <div className="px-4 space-y-2">
        <ActionCard
          icon={TrendingUp}
          label="Marketplace"
          sub="Browse buyers · Post requirement · AI match"
          color="#8B5CF6"
          onClick={() => onNavigate("marketplace")}
        />
        <ActionCard
          icon={Shield}
          label="Buyer Verification"
          sub="KYC-verified buyers · Safe transactions"
          color="#0E7490"
          onClick={() => onNavigate("buyer-verification")}
        />
        <ActionCard
          icon={Truck}
          label="Transport & Delivery"
          sub="Book transport · Track delivery"
          color="#F97316"
          onClick={() => onNavigate("full-journey")}
        />
        <ActionCard
          icon={DollarSign}
          label="Settlement & Payment"
          sub="Final weighing · Payment record"
          color="#10B981"
          onClick={() => onNavigate("full-journey")}
        />
        <ActionCard
          icon={Warehouse}
          label="Storage Dashboard"
          sub="Compare warehouses · Book storage"
          color="#0E7490"
          onClick={() => onNavigate("store-sell-dashboard")}
        />
      </div>

      <div className="px-4 pt-4 pb-4">
        <button
          onClick={() => onNavigate("full-journey")}
          className="w-full py-3 rounded-xl text-sm font-semibold border-2 transition-all active:scale-[0.98]"
          style={{
            borderColor: colors.blue.primary,
            color: colors.blue.primary,
          }}
        >
          View Full Selling Journey (11-Step Flow)
        </button>
      </div>
    </div>
  );
}

// ── Tab: Profile ───────────────────────────────────────────────────────────

function ProfileTab({
  language,
  onLanguageChange,
  onNavigate,
}: {
  language: string;
  onLanguageChange: (l: string) => void;
  onNavigate: (s: AppState) => void;
}) {
  return (
    <div
      className="overflow-y-auto overflow-x-hidden"
      style={{
        paddingBottom:
          "calc(72px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Producer card */}
      <div className="px-4 pt-4">
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{
            backgroundColor: "white",
            border: `2px solid ${colors.accent.gold}40`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${colors.blue.primary}, #0072C6)`,
            }}
          >
            👨‍🌾
          </div>
          <div className="min-w-0">
            <p
              className="font-bold text-base truncate"
              style={{
                fontFamily: typography.fonts.heading,
                color: colors.blue.primary,
              }}
            >
              {PRODUCER.name}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: colors.text.muted }}
            >
              {PRODUCER.village}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} fill="#FFD700" color="#FFD700" />
              <span
                className="text-xs font-medium"
                style={{ color: "#F59E0B" }}
              >
                KYC Verified Producer
              </span>
            </div>
          </div>
        </div>
      </div>

      <SectionHeader title="Identity & KYC" />
      <div className="px-4 space-y-2">
        <ActionCard
          icon={User}
          label="My Profile"
          sub="Name · Farm · Contact · Bank details"
          color={colors.blue.primary}
          onClick={() => onNavigate("profile-full")}
        />
        <ActionCard
          icon={Shield}
          label="KYC & Documents"
          sub="Aadhaar · Land records · Bank · Verification"
          color="#0E7490"
          onClick={() => onNavigate("kyc")}
          badge="Verified"
        />
      </div>

      <SectionHeader title="Preferences" />
      <div className="px-4 space-y-3">
        <div
          className="p-4 rounded-xl bg-white border"
          style={{ borderColor: "#E5E7EB" }}
        >
          <p
            className="text-sm font-semibold mb-2"
            style={{ color: colors.text.primary }}
          >
            🗣 Language / भाषा
          </p>
          <Select
            value={language}
            onValueChange={onLanguageChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.slice(0, 10).map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <SectionHeader title="Help & Support" />
      <div className="px-4 space-y-2 pb-4">
        <ActionCard
          icon={Mic}
          label="AI Assistant (Grok)"
          sub="Ask anything about your farm or trade"
          color="#0EA5E9"
          onClick={() => onNavigate("ai-assistant")}
        />
        <ActionCard
          icon={Clock}
          label="Transaction History"
          sub="Past trades · Payments · Lot records"
          color="#6B7280"
          onClick={() => onNavigate("full-journey")}
        />
        <ActionCard
          icon={Settings}
          label="Settings"
          sub="Notifications · Privacy · About"
          color="#6B7280"
          onClick={() => onNavigate("profile-full")}
        />
      </div>
    </div>
  );
}

// ── Bottom Navigation ──────────────────────────────────────────────────────

const TABS: {
  id: BottomTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "farm", label: "Farm", icon: Leaf },
  { id: "lots", label: "Lots", icon: Package, badge: 2 },
  { id: "sell", label: "Sell", icon: TrendingUp },
  { id: "profile", label: "Profile", icon: User },
];

function BottomNav({
  active,
  onSelect,
}: {
  active: BottomTab;
  onSelect: (t: BottomTab) => void;
}) {
  return (
    // Outer: fixed to viewport full-width so it anchors to bottom
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Inner: centered and capped at mobile width */}
      <nav
        className="w-full max-w-[430px] mx-auto flex border-t"
        style={{
          backgroundColor: "white",
          borderColor: "#E5E7EB",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
        }}
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className="flex-1 flex flex-col items-center py-2 gap-0.5 relative"
              style={{ minHeight: 56 }}
            >
              <div className="relative">
                <tab.icon
                  size={22}
                  style={{
                    color: isActive
                      ? colors.blue.primary
                      : "#9CA3AF",
                  }}
                />
                {tab.badge && !isActive && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                    style={{
                      backgroundColor: "#EF4444",
                      fontSize: 9,
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className="text-xs font-medium"
                style={{
                  color: isActive
                    ? colors.blue.primary
                    : "#9CA3AF",
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                  style={{
                    backgroundColor: colors.blue.primary,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ── Screen header for fullscreen overlays ──────────────────────────────────

function ScreenHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div
      className="sticky top-0 z-40 flex items-center gap-3 px-4 border-b"
      style={{
        backgroundColor: "white",
        borderColor: "#E5E7EB",
        paddingTop:
          "calc(12px + env(safe-area-inset-top, 0px))",
        paddingBottom: 12,
      }}
    >
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#F3F4F6" }}
      >
        <ArrowLeft size={18} />
      </button>
      <span
        className="font-bold text-base truncate"
        style={{
          fontFamily: typography.fonts.heading,
          color: colors.blue.primary,
        }}
      >
        {title}
      </span>
    </div>
  );
}

// ── Full-screen overlay wrapper ────────────────────────────────────────────
// Centers content and prevents horizontal overflow in every overlay screen.

function OverlayScreen({
  children,
  title,
  onBack,
}: {
  children: React.ReactNode;
  title: string;
  onBack: () => void;
}) {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: "#F7FAFC" }}
    >
      <ScreenHeader title={title} onBack={onBack} />
      <div className="overflow-x-hidden">{children}</div>
      <Toaster />
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────

export default function App() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [activeTab, setActiveTab] = useState<BottomTab>("home");
  const [language, setLanguage] = useState("en");
  const [returnTab, setReturnTab] = useState<BottomTab>("home");

  const navigate = (state: AppState, fromTab?: BottomTab) => {
    if (fromTab) setReturnTab(fromTab);
    setAppState(state);
    window.scrollTo({ top: 0 });
  };

  const goBack = () => {
    setAppState("app");
    setActiveTab(returnTab);
  };

  const makeTabNavigator =
    (tab: BottomTab) => (state: AppState) =>
      navigate(state, tab);

  // ── Splash ─────────────────────────────────────────────────────────────

  if (appState === "splash") {
    return (
      <div
        className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-between px-5 py-10"
        style={{
          background:
            "linear-gradient(160deg, #F7FAFC 0%, #D9F2FF 50%, #B3E0FF 100%)",
          paddingTop:
            "calc(40px + env(safe-area-inset-top, 0px))",
          paddingBottom:
            "calc(40px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center w-full max-w-sm"
        >
          <img
            src={tradieLogo}
            alt="TRADIE"
            className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-xl"
          />
          <h1
            className="text-4xl font-black mb-2"
            style={{
              fontFamily: typography.fonts.heading,
              color: colors.blue.primary,
            }}
          >
            TRADIE
          </h1>
          <p
            className="text-base font-medium mb-1"
            style={{ color: colors.blue.primary }}
          >
            Producer Platform
          </p>
          <p
            className="text-sm"
            style={{ color: `${colors.blue.primary}80` }}
          >
            Farm · Harvest · Sell · Prosper
          </p>
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            {["🌾 Farmers", "🤝 Traders", "📦 Buyers"].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${colors.blue.primary}12`,
                    color: colors.blue.primary,
                  }}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-sm space-y-3"
        >
          <button
            onClick={() => setAppState("otp")}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, #003E6D, #0072C6)",
              color: "white",
              boxShadow: "0 6px 24px rgba(0,62,109,0.35)",
            }}
          >
            Get Started →
          </button>
          <button
            onClick={() => setAppState("app")}
            className="w-full py-3 rounded-2xl font-semibold text-sm border-2 transition-all"
            style={{
              borderColor: `${colors.blue.primary}40`,
              color: colors.blue.primary,
            }}
          >
            I already have an account
          </button>
          <p
            className="text-center text-xs"
            style={{ color: colors.text.muted }}
          >
            Multi-language · AI-Powered · Secure
          </p>
        </motion.div>
        <Toaster />
      </div>
    );
  }

  // ── OTP / Onboarding ────────────────────────────────────────────────────

  if (appState === "otp") {
    return (
      <>
        <OTPVerificationScreen
          onVerifySuccess={() => setAppState("app")}
          onBackToSignUp={() => setAppState("splash")}
          mobile="98765 43210"
          countryCode="+91"
        />
        <Toaster />
      </>
    );
  }

  // ── Full-screen overlays ─────────────────────────────────────────────────

  if (appState === "full-journey") {
    return (
      <div
        className="min-h-screen w-full overflow-x-hidden"
        style={{ backgroundColor: "#F7FAFC" }}
      >
        <ProducerMasterFlowNavigator onBack={goBack} />
        <Toaster />
      </div>
    );
  }

  if (appState === "dashboard-ai") {
    return (
      <OverlayScreen
        title="AI Insights Dashboard"
        onBack={goBack}
      >
        <ProducerAIDashboardComplete onBack={goBack} />
      </OverlayScreen>
    );
  }

  if (appState === "activities") {
    return (
      <OverlayScreen title="Log Activity" onBack={goBack}>
        <ActivityLoggerEnhanced />
      </OverlayScreen>
    );
  }

  if (appState === "input-cost") {
    return (
      <OverlayScreen title="Input Cost Tracker" onBack={goBack}>
        <InputCostTrackerEnhanced />
      </OverlayScreen>
    );
  }

  if (appState === "crop-health") {
    return (
      <OverlayScreen
        title="Crop Health Monitor"
        onBack={goBack}
      >
        <CropHealthMonitor />
      </OverlayScreen>
    );
  }

  if (appState === "crop-selection") {
    return (
      <OverlayScreen title="Crop Selection" onBack={goBack}>
        <CropSelectionWithAI
          producerId="PROD-2025-001"
          onComplete={goBack}
          onBack={goBack}
        />
      </OverlayScreen>
    );
  }

  if (appState === "harvest") {
    return (
      <OverlayScreen title="Record Harvest" onBack={goBack}>
        <HarvestCommodityListing
          producerId="PROD-2025-001"
          onComplete={goBack}
          onBack={goBack}
        />
      </OverlayScreen>
    );
  }

  if (appState === "quality") {
    return (
      <OverlayScreen title="Quality Check" onBack={goBack}>
        <EnhancedQualityCheckWithAI />
      </OverlayScreen>
    );
  }

  if (appState === "lot-creation") {
    return (
      <OverlayScreen
        title="Create Lot & Digital ID"
        onBack={goBack}
      >
        <LotCreationTokenizationWorkflow />
      </OverlayScreen>
    );
  }

  if (appState === "qr-manager") {
    return (
      <OverlayScreen title="QR Code Manager" onBack={goBack}>
        <QRCodeManager onBack={goBack} />
      </OverlayScreen>
    );
  }

  if (appState === "provenance") {
    return (
      <OverlayScreen title="Provenance Tracker" onBack={goBack}>
        <ProvenanceTracker />
      </OverlayScreen>
    );
  }

  if (appState === "store-sell-dashboard") {
    return (
      <OverlayScreen
        title="Storage & Sell Dashboard"
        onBack={goBack}
      >
        <StorageAndSellDashboard />
      </OverlayScreen>
    );
  }

  if (appState === "store-sell-decision") {
    return (
      <OverlayScreen title="Store or Sell?" onBack={goBack}>
        <StorageSellDecisionScreen
          onSell={() => setAppState("marketplace")}
          onStore={() => setAppState("store-sell-dashboard")}
          onBack={goBack}
        />
      </OverlayScreen>
    );
  }

  if (appState === "marketplace") {
    return (
      <OverlayScreen title="Marketplace" onBack={goBack}>
        <MarketplaceAgentBrowsingScreen
          onBack={goBack}
          onContactMarketplace={() =>
            setAppState("buyer-verification")
          }
          onEngageAgent={() =>
            setAppState("buyer-verification")
          }
        />
      </OverlayScreen>
    );
  }

  if (appState === "buyer-verification") {
    return (
      <OverlayScreen title="Buyer Verification" onBack={goBack}>
        <BuyerVerificationView tokenId="W-002" />
      </OverlayScreen>
    );
  }

  if (appState === "profile-full") {
    return (
      <OverlayScreen title="My Profile" onBack={goBack}>
        <ProducerProfile />
      </OverlayScreen>
    );
  }

  if (appState === "kyc") {
    return (
      <OverlayScreen title="KYC & Documents" onBack={goBack}>
        <ComprehensiveKYCSystem
          userRole="producer"
          onComplete={goBack}
        />
      </OverlayScreen>
    );
  }

  if (appState === "ai-assistant") {
    return (
      <OverlayScreen title="AI Assistant" onBack={goBack}>
        <ChatGPTIntegrationDemo onBack={goBack} />
      </OverlayScreen>
    );
  }

  // ── Main App Shell ───────────────────────────────────────────────────────

  return (
    <div
      className="w-full overflow-x-hidden"
      style={{ backgroundColor: "#F7FAFC" }}
    >
      {/* Constrained mobile container */}
      <div
        className="min-h-screen max-w-[430px] mx-auto relative"
        style={{ backgroundColor: "#F7FAFC" }}
      >
        {/* Sticky top bar */}
        <div
          className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b bg-white"
          style={{
            borderColor: "#E5E7EB",
            paddingTop:
              "calc(12px + env(safe-area-inset-top, 0px))",
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src={tradieLogo}
              alt="TRADIE"
              className="w-7 h-7 rounded-lg flex-shrink-0"
            />
            <span
              className="font-black text-base"
              style={{
                fontFamily: typography.fonts.heading,
                color: colors.blue.primary,
              }}
            >
              TRADIE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center relative"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <Bell
                size={18}
                style={{ color: colors.text.primary }}
              />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "home" && (
              <HomeTab onNavigate={makeTabNavigator("home")} />
            )}
            {activeTab === "farm" && (
              <FarmTab onNavigate={makeTabNavigator("farm")} />
            )}
            {activeTab === "lots" && (
              <LotsTab onNavigate={makeTabNavigator("lots")} />
            )}
            {activeTab === "sell" && (
              <SellTab onNavigate={makeTabNavigator("sell")} />
            )}
            {activeTab === "profile" && (
              <ProfileTab
                language={language}
                onLanguageChange={setLanguage}
                onNavigate={makeTabNavigator("profile")}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <BottomNav active={activeTab} onSelect={setActiveTab} />
        <Toaster />
      </div>
    </div>
  );
}