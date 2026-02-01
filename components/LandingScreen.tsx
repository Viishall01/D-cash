"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { Shield, Zap, Globe, ArrowRight, Download, Lock } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      {/* --- Smooth Progress Bar --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield size={24} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter italic uppercase">
              Vault
            </span>
          </motion.div>

          {/* <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {["Features", "Security", "Ecosystem"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
              </a>
            ))}
            <button className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full hover:bg-indigo-500 hover:text-white transition-all duration-300">
              Connect
            </button>
          </div> */}
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              The Next Generation of Assets
            </motion.span>
            <h1 className="text-6xl md:text-[100px] font-black tracking-tight mb-8 leading-[0.85] text-white">
              MASTER YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                DIGITAL FORTUNE.
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              A high-performance Solana wallet built for the modern era. Secure,
              lightning-fast, and elegantly designed for your everyday web3
              journey.
            </p>
          </motion.div>

          {/* Action Buttons with Interactive Hovers */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/create"
              className="group relative w-full md:w-auto px-10 py-5 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Create New Wallet{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Link>

            <Link
              href="/import-seed"
              className="w-full md:w-auto px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              Import Seed <Download size={20} className="text-slate-400" />
            </Link>
          </motion.div>
        </div>

        {/* --- THE 3D INTERFACE PREVIEW (Tilt Component) --- */}
        <div className="mt-24 max-w-5xl mx-auto perspective-1000">
          <TiltCard>
            <div className="relative w-full aspect-video rounded-[2.5rem] bg-[#0a0a0c] border border-white/10 overflow-hidden shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]" />

              <div className="relative h-full flex items-center justify-center p-12">
                <div className="grid grid-cols-2 gap-8 w-full items-center">
                  <div className="text-left space-y-4">
                    <div className="h-4 w-24 bg-indigo-500/20 rounded-full animate-pulse" />
                    <h3 className="text-4xl font-bold italic">$42,920.50</h3>
                    <div className="flex gap-2">
                      <div className="h-8 w-20 bg-emerald-500/20 border border-emerald-500/30 rounded-lg" />
                      <div className="h-8 w-20 bg-white/5 border border-white/10 rounded-lg" />
                    </div>
                  </div>
                  <div className="relative">
                    {/* This mimics a 3D Web3 Illustration */}
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
        className="py-32 px-6 bg-gradient-to-b from-transparent to-indigo-900/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Lock className="text-indigo-400" />}
              title="Secure Vault"
              desc="Military-grade AES-256 encryption protects your mnemonic locally on your hardware."
            />
            <FeatureCard
              icon={<Zap className="text-yellow-400" />}
              title="Instant Swaps"
              desc="Trade SOL for any SPL token in milliseconds using Jupiter v6 aggregator."
            />
            <FeatureCard
              icon={<Globe className="text-emerald-400" />}
              title="Cross-Chain ready"
              desc="Seamlessly view and manage assets across the entire Solana ecosystem."
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
      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      {children}
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -12, backgroundColor: "rgba(255,255,255,0.05)" }}
      className="p-10 rounded-4xl bg-white/[0.02] border border-white/5 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-indigo-500/20">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}
