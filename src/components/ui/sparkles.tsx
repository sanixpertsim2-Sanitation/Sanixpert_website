"use client";
import { useId } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

const initParticles = async (engine: any) => {
  await loadSlim(engine);
};

const SparklesInner = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  const controls = useAnimation();
  const generatedId = useId();

  const particlesLoaded = async () => {
    controls.start({ opacity: 1, transition: { duration: 1 } });
  };

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      <Particles
        id={id || generatedId}
        className={cn("h-full w-full")}
        particlesLoaded={particlesLoaded}
        options={{
          background: {
            color: { value: background || "transparent" },
          },
          fullScreen: { enable: false, zIndex: 1 },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: false, mode: "repulse" },
              resize: true as any,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 200, duration: 0.4 },
            },
          },
          particles: {
            color: { value: particleColor || "#2E8FD4" },
            move: {
              enable: true,
              direction: "none",
              outModes: { default: "out" },
              speed: { min: 0.1, max: 1 },
            },
            number: {
              density: { enable: true, width: 400, height: 400 },
              value: particleDensity || 120,
            },
            opacity: {
              value: { min: 0.1, max: 0.8 },
              animation: {
                enable: true,
                speed: speed || 2,
                sync: false,
              },
            },
            shape: { type: "circle" },
            size: {
              value: { min: minSize || 0.4, max: maxSize || 1.5 },
            },
          },
          detectRetina: true,
        }}
      />
    </motion.div>
  );
};

export const SparklesCore = (props: ParticlesProps) => {
  return (
    <ParticlesProvider init={initParticles}>
      <SparklesInner {...props} />
    </ParticlesProvider>
  );
};
