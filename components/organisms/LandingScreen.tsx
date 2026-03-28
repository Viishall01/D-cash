"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { Lock, Zap, Globe, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { colors } from "@/lib/colors";
import { Text, GlowBackground, Button } from "@/components/atoms";
import { NavBar, FeatureCard } from "@/components/molecules";

export default function LandingScreen() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      className="min-h-screen text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans"
      style={{ backgroundColor: colors.bg.primary }}
    >
      {/* --- Smooth Progress Bar --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: colors.gradient.progressBar,
        }}
      />

      {/* --- Navigation --- */}
      <NavBar />

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Animated Background Orbs */}
        <GlowBackground
          position="top-left"
          size={500}
          color={colors.brand.indigoGlow}
        />
        <GlowBackground
          position="bottom-right"
          size={400}
          color="rgba(147, 51, 234, 0.10)"
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase rounded-full"
              style={{
                color: colors.text.indigo,
                backgroundColor: colors.brand.indigoMuted,
                border: `1px solid ${colors.brand.indigoBorder}`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              The Next Generation of Assets
            </motion.span>
            <Text variant="h1" className="mb-8">
              MASTER YOUR <br />
              <Text variant="gradient" as="span">
                DIGITAL FORTUNE.
              </Text>
            </Text>
            <Text
              variant="body"
              color="muted"
              className="max-w-2xl mx-auto mb-12"
            >
              A high-performance Solana wallet built for the modern era. Secure,
              lightning-fast, and elegantly designed for your everyday web3
              journey.
            </Text>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/create" className="w-full md:w-auto">
              <Button
                variant="primary"
                size="xl"
                fullWidth
                icon={
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                }
                className="group hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                Create New Wallet
              </Button>
            </Link>

            <Link href="/import-seed" className="w-full md:w-auto">
              <Button
                variant="secondary"
                size="xl"
                fullWidth
                icon={
                  <Download size={20} style={{ color: colors.text.muted }} />
                }
              >
                Import Seed
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* --- THE 3D INTERFACE PREVIEW --- */}
        <div className="mt-24 max-w-5xl mx-auto perspective-1000">
          <TiltCard>
            <div
              className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl"
              style={{
                backgroundColor: colors.bg.secondary,
                border: `1px solid ${colors.border.primary}`,
              }}
            >
              {/* Background Pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(${colors.brand.indigo} 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="relative h-full flex items-center justify-center p-12">
                <div className="grid grid-cols-2 gap-8 w-full items-center">
                  <div className="text-left space-y-4">
                    <div
                      className="h-4 w-24 rounded-full animate-pulse"
                      style={{ backgroundColor: colors.brand.indigoBorder }}
                    />
                    <Text variant="h3" className="text-4xl italic">
                      $42,920.50
                    </Text>
                    <div className="flex gap-2">
                      <div
                        className="h-8 w-20 rounded-lg"
                        style={{
                          backgroundColor: colors.feature.emeraldMuted,
                          border: `1px solid ${colors.feature.emeraldBorder}`,
                        }}
                      />
                      <div
                        className="h-8 w-20 rounded-lg"
                        style={{
                          backgroundColor: colors.bg.input,
                          border: `1px solid ${colors.border.primary}`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <motion.img
                      src="https://img.freepik.com/free-psd/3d-nft-icon-isolated_23-2150531557.jpg"
                      className="w-full rounded-3xl shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-700"
                      alt="Web3 3D Asset"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* --- Features --- */}
      <section
        id="features"
        className="py-32 px-6"
        style={{ background: colors.gradient.bgFade }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Lock style={{ color: colors.text.indigo }} />}
              title="Secure Vault"
              description="Military-grade AES-256 encryption protects your mnemonic locally on your hardware."
            />
            <FeatureCard
              icon={<Zap style={{ color: colors.feature.yellow }} />}
              title="Instant Swaps"
              description="Trade SOL for any SPL token in milliseconds using Jupiter v6 aggregator."
            />
            <FeatureCard
              icon={<Globe style={{ color: colors.feature.emerald }} />}
              title="Cross-Chain ready"
              description="Seamlessly view and manage assets across the entire Solana ecosystem."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Interactive 3D Tilt Component ---
function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full cursor-none group"
    >
      <div
        className="absolute -inset-2 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: colors.gradient.cardGlow }}
      />
      {children}
    </motion.div>
  );
}
