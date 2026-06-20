import { NarutoRamenScroll } from "./components/NarutoRamenScroll";

function App() {
  return (
    <div className="w-full bg-[#0d0e12] min-h-screen text-zinc-100 flex flex-col font-sans">
      {/* 1. Introductory Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center px-4 overflow-hidden border-b border-zinc-800 bg-radial from-slate-900 via-zinc-950 to-[#0d0e12]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="text-center z-10 space-y-6 max-w-3xl">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
            Interactive Scroll Experience
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
            The Legend of the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500">
              Ramen Scroll
            </span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Scroll down to watch Uzumaki Naruto slurp down an infinite strand of ramen noodle, changing expression as his stomach fills up!
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-ping" />
              HUD Debug Mode Enabled
            </span>
          </div>
        </div>

        {/* Bouncing scroll indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-zinc-500 pointer-events-none">
          <span className="text-xs uppercase tracking-widest">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full p-1 flex justify-center">
            <div className="w-1.5 h-3 bg-amber-500 rounded-full animate-bounce mt-1" />
          </div>
        </div>
      </section>

      {/* 2. Interactive Naruto Ramen Scroll Section */}
      <section className="w-full">
        <NarutoRamenScroll
          bodyPath="/assets/naruto/naruto_body.png"
          slurpFacePath="/assets/naruto/naruto_face_slurp.png"
          chewFacePath="/assets/naruto/naruto_face_chew.png"
          stuffedFacePath="/assets/naruto/naruto_face_stuffed.png"
          happyFacePath="/assets/naruto/naruto_face_happy.png"
          noodlePath="/assets/naruto/noodles.png"
          sectionHeight="400vh"
          initialDebug={false} // Set this to true to enable the alignment GUI
        />
      </section>

      {/* 3. Concluding Footer Section */}
      <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-t border-zinc-800 bg-gradient-to-b from-[#0d0e12] to-black py-20">
        <div className="absolute w-[200px] h-[200px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl z-10 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Dattebayo! 🍜
          </h2>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            Naruto is stuffed and fully happy! You've successfully completed the scroll. Adjust coordinates in the debug HUD above to align the noodle path perfectly, then copy the result config object to set the defaults.
          </p>
          <div className="pt-6 flex flex-wrap gap-4 items-center justify-center">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-sm px-6 py-3 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all cursor-pointer shadow-lg"
            >
              Scroll Back Up
            </a>
          </div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-6 text-zinc-600 text-xs tracking-wider">
          NARUTO RAMEN COMPONENT • BUILT WITH REACT + GSAP
        </div>
      </section>
    </div>
  );
}

export default App;
