import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export interface NarutoRamenScrollProps {
  // Asset Paths
  bodyPath?: string;
  slurpFacePath?: string;
  chewFacePath?: string;
  stuffedFacePath?: string;
  happyFacePath?: string;
  noodlePath?: string;

  // Configuration
  sectionHeight?: string; // e.g. "350vh" or "400vh"
  initialDebug?: boolean; // Show debug overlay and controllers
  
  // Noodle positioning & styling defaults
  initialMouthXPercent?: number;
  initialMouthYPercent?: number;
  initialNoodleWidth?: number; // in pixels
  initialMaxNoodleHeight?: string; // e.g. "80vh" or "600px"
}

export const NarutoRamenScroll: React.FC<NarutoRamenScrollProps> = ({
  bodyPath = "/assets/naruto/naruto_body.png",
  slurpFacePath = "/assets/naruto/naruto_face_slurp.png",
  chewFacePath = "/assets/naruto/naruto_face_chew.png",
  stuffedFacePath = "/assets/naruto/naruto_face_stuffed.png",
  happyFacePath = "/assets/naruto/naruto_face_happy.png",
  noodlePath = "/assets/naruto/noodles.png",
  sectionHeight = "400vh",
  initialDebug = false,
  initialMouthXPercent = 49.7, // Naruto's mouth X position in percent of character width
  initialMouthYPercent = 38.9, // Naruto's mouth Y position in percent of character height
  initialNoodleWidth = 80,      // Default noodle width in pixels
  initialMaxNoodleHeight = "800px",
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const noodleContainerRef = useRef<HTMLDivElement>(null);
  const slurpFaceRef = useRef<HTMLImageElement>(null);
  const chewFaceRef = useRef<HTMLImageElement>(null);
  const stuffedFaceRef = useRef<HTMLImageElement>(null);
  const happyFaceRef = useRef<HTMLImageElement>(null);

  // Debug State
  const [debug, setDebug] = useState(initialDebug);
  const [mouthXPercent, setMouthXPercent] = useState(initialMouthXPercent);
  const [mouthYPercent, setMouthYPercent] = useState(initialMouthYPercent);
  const [noodleWidth, setNoodleWidth] = useState(initialNoodleWidth);
  const [maxNoodleHeight, setMaxNoodleHeight] = useState(initialMaxNoodleHeight);
  const [copied, setCopied] = useState(false);

  // GSAP Scroll Animation
  useGSAP(
    () => {
      if (!triggerRef.current || !noodleContainerRef.current) return;

      // Ensure initial opacity states
      gsap.set(slurpFaceRef.current, { opacity: 1 });
      gsap.set(chewFaceRef.current, { opacity: 0 });
      gsap.set(stuffedFaceRef.current, { opacity: 0 });
      gsap.set(happyFaceRef.current, { opacity: 0 });
      gsap.set(noodleContainerRef.current, { opacity: 1, scaleY: 1 });

      // Create scroll-bound timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5, // Subtle smoothing lag for responsiveness
          invalidateOnRefresh: true,
        },
      });

      // 1. Noodle Shrink Animation (scaleY from 1.0 to 0)
      // 0% -> 60%: Noodle shrinks to 15% length
      // 60% -> 78%: Noodle shrinks to 5% length
      // 78% -> 92%: Noodle shrinks to 0% (fully gone)
      // 92% -> 100%: Noodle stays at 0%
      tl.to(noodleContainerRef.current, { scaleY: 0.15, ease: "power1.inOut", duration: 0.60 }, 0)
        .to(noodleContainerRef.current, { scaleY: 0.05, ease: "power1.inOut", duration: 0.18 }, 0.60)
        .to(noodleContainerRef.current, { scaleY: 0, ease: "power1.in", duration: 0.14 }, 0.78)
        .to(noodleContainerRef.current, { opacity: 0, duration: 0.02 }, 0.90) // Fade out completely right before 92%
        .to(noodleContainerRef.current, { scaleY: 0, ease: "none", duration: 0.08 }, 0.92);

      // 2. Face Expression Swapping (with minor cross-fading overlap)
      // Slurp: active 0% to 60%
      // Chew: active 60% to 78%
      // Stuffed: active 78% to 92%
      // Happy: active 92% to 100%
      const crossfadeTime = 0.02; // 2% scroll track overlay for smooth blend

      // Transition to Chew at 60%
      tl.to(slurpFaceRef.current, { opacity: 0, duration: crossfadeTime }, 0.60 - crossfadeTime / 2)
        .to(chewFaceRef.current, { opacity: 1, duration: crossfadeTime }, 0.60 - crossfadeTime / 2)

        // Transition to Stuffed at 78%
        .to(chewFaceRef.current, { opacity: 0, duration: crossfadeTime }, 0.78 - crossfadeTime / 2)
        .to(stuffedFaceRef.current, { opacity: 1, duration: crossfadeTime }, 0.78 - crossfadeTime / 2)

        // Transition to Happy at 92%
        .to(stuffedFaceRef.current, { opacity: 0, duration: crossfadeTime }, 0.92 - crossfadeTime / 2)
        .to(happyFaceRef.current, { opacity: 1, duration: crossfadeTime }, 0.92 - crossfadeTime / 2);

      return () => {
        // Cleanup ScrollTriggers on unmount
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: triggerRef }
  );

  // Copy Config to Clipboard
  const handleCopyConfig = () => {
    const configStr = JSON.stringify(
      {
        mouthXPercent,
        mouthYPercent,
        noodleWidth,
        maxNoodleHeight,
      },
      null,
      2
    );
    navigator.clipboard.writeText(configStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={triggerRef} className="relative w-full" style={{ height: sectionHeight }}>
      {/* Sticky view viewport */}
      <div ref={containerRef} className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-radial from-slate-900 via-zinc-950 to-black select-none">
        
        {/* Decorative background circle */}
        <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Character Frame Wrapper */}
        <div 
          ref={characterRef}
          className="relative max-w-[90vw] max-h-[75vh] flex items-center justify-center aspect-[5/6]"
        >
          {/* Base Body PNG */}
          <img
            src={bodyPath}
            alt="Naruto Body"
            className="w-[280px] sm:w-[360px] md:w-[450px] lg:w-[500px] h-auto object-contain block relative z-10"
          />

          {/* Reusable Ramen Noodle Strand */}
          <div
            ref={noodleContainerRef}
            className="absolute z-40 pointer-events-none"
            style={{
              left: `${mouthXPercent}%`,
              top: `${mouthYPercent}%`,
              width: `${noodleWidth}px`,
              height: maxNoodleHeight,
              transformOrigin: "top center",
              transform: "translateX(-50%)",
            }}
          >
            {/* The actual noodle image, scaled or clipped inside the absolute wrapper */}
            <img
              src={noodlePath}
              alt="Noodle strand"
              className="w-full h-full object-cover object-top drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
            />
          </div>

          {/* Overlay Face Expression PNGs - exact dimensions and bounds as body */}
          <img
            ref={slurpFaceRef}
            src={slurpFacePath}
            alt="Naruto Face Slurp"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30"
          />
          <img
            ref={chewFaceRef}
            src={chewFacePath}
            alt="Naruto Face Chew"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 opacity-0"
          />
          <img
            ref={stuffedFaceRef}
            src={stuffedFacePath}
            alt="Naruto Face Stuffed"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 opacity-0"
          />
          <img
            ref={happyFaceRef}
            src={happyFacePath}
            alt="Naruto Face Happy"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 opacity-0"
          />

          {/* Debug Align Target */}
          {debug && (
            <div
              className="absolute z-50 pointer-events-none flex items-center justify-center"
              style={{
                left: `${mouthXPercent}%`,
                top: `${mouthYPercent}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Outer pulsing ring */}
              <div className="absolute w-8 h-8 rounded-full border-2 border-red-500 bg-red-500/20 animate-ping" />
              {/* Main crosshair circle */}
              <div className="w-5 h-5 rounded-full border-2 border-red-500 bg-transparent relative flex items-center justify-center">
                <div className="absolute w-[20px] h-[2px] bg-red-500" />
                <div className="absolute w-[2px] h-[2px] bg-white rounded-full" />
                <div className="absolute h-[20px] w-[2px] bg-red-500" />
              </div>
              <span className="absolute left-6 whitespace-nowrap bg-red-600 text-white font-mono text-[10px] py-0.5 px-1 rounded shadow-md border border-red-400">
                Mouth: {mouthXPercent}% , {mouthYPercent}%
              </span>
            </div>
          )}
        </div>

        {/* Scroll Indicator Prompt */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 animate-bounce pointer-events-none">
          <span className="text-xs uppercase tracking-[0.25em]">Scroll Down to Slurp</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Interactive Debug HUD Panel */}
        {debug && (
          <div className="absolute top-4 right-4 z-50 w-72 bg-zinc-900/95 border border-zinc-800 text-zinc-200 text-sm p-4 rounded-xl shadow-2xl backdrop-blur-md select-text">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
              <h4 className="font-semibold text-amber-500 flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                Ramen Alignment HUD
              </h4>
              <button
                onClick={() => setDebug(false)}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs cursor-pointer px-1.5 py-0.5 hover:bg-zinc-800 rounded transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {/* Slider Controls */}
            <div className="space-y-4">
              {/* Mouth X slider */}
              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span>mouthXPercent:</span>
                  <span className="text-amber-500 font-bold">{mouthXPercent.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={mouthXPercent}
                  onChange={(e) => setMouthXPercent(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Mouth Y slider */}
              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span>mouthYPercent:</span>
                  <span className="text-amber-500 font-bold">{mouthYPercent.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={mouthYPercent}
                  onChange={(e) => setMouthYPercent(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Noodle Width slider */}
              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span>noodleWidth:</span>
                  <span className="text-amber-500 font-bold">{noodleWidth}px</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={noodleWidth}
                  onChange={(e) => setNoodleWidth(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Max Noodle Height slider */}
              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span>maxNoodleHeight:</span>
                  <span className="text-amber-500 font-bold">{maxNoodleHeight}</span>
                </div>
                <select
                  value={maxNoodleHeight}
                  onChange={(e) => setMaxNoodleHeight(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded text-xs p-1 cursor-pointer outline-none focus:border-amber-500 text-zinc-300"
                >
                  <option value="60vh">60vh</option>
                  <option value="70vh">70vh</option>
                  <option value="80vh">80vh</option>
                  <option value="90vh">90vh</option>
                  <option value="100vh">100vh</option>
                  <option value="400px">400px</option>
                  <option value="600px">600px</option>
                  <option value="800px">800px</option>
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 pt-3 border-t border-zinc-800 flex flex-col gap-2">
              <button
                onClick={handleCopyConfig}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-black font-semibold text-xs py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                {copied ? "✓ Copied to Clipboard!" : "📋 Copy Config Object"}
              </button>
              <div className="text-[10px] text-zinc-500 leading-normal text-center mt-1">
                Use sliders to align the target with Naruto's mouth. Copy and paste as component config props when finished.
              </div>
            </div>
          </div>
        )}

        {/* Toggle Debug HUD trigger (only if initialDebug is provided, double click character to restore) */}
        {!debug && initialDebug && (
          <button
            onClick={() => setDebug(true)}
            className="absolute top-4 right-4 z-40 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs py-1.5 px-3 rounded-lg cursor-pointer transition-all shadow-md"
          >
            ⚙️ Enable Align HUD
          </button>
        )}
      </div>
    </div>
  );
};
