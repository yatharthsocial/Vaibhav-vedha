"use client";

import { useEffect, useRef, useState } from "react";

// How long the crossfade from the video's final frame to the still
// image takes. Both frames are visually identical (the still is
// extracted from the video's own last frame), so this just guarantees
// there's never a hard cut or flash while the video element unmounts.
const FREEZE_TRANSITION_MS = 700;

// Below this width, the <source> below serves the portrait clip shot
// for mobile instead of the widescreen desktop one — a 16:9 video
// cropped hard by object-cover loses most of its composition on a
// phone screen. Kept in sync with the media query on the <source> tag.
const MOBILE_BREAKPOINT = 768;

const LAST_FRAME = {
  mobile: "/video/hero-mobile-last-frame.jpg",
  desktop: "/video/hero-last-frame.jpg",
};

// A one-time, static speed bump — not a live/eased rate change, and
// not re-applied on every frame. Some browsers reset playbackRate
// when the source resolves, so it's set both immediately and again on
// loadedmetadata below, but always to this same fixed value. This is
// deliberately distinct from the dynamic playbackRate/seek/restart
// tricks noted below, which are what actually caused the earlier
// glitches.
const PLAYBACK_RATE = 1.2;

export default function HeroVideo({
  className = "",
  onEnded,
}: {
  className?: string;
  /** Fires once, the moment the clip finishes and starts freezing. */
  onEnded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);
  // Which freeze-frame still to crossfade to. This is cosmetic only —
  // it never gates whether the <video> itself renders (that would
  // reintroduce the blank-on-load bug), it just keeps the final still
  // image matched to whichever clip actually played.
  const [lastFrame, setLastFrame] = useState(LAST_FRAME.desktop);

  // Keep the latest onEnded in a ref so the effect below doesn't need
  // it as a dependency, even if the parent passes a new inline
  // function on every render.
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // The only script involvement in playback, period: listen for the
    // browser's own "ended" event and note it. Nothing here seeks
    // currentTime or calls play()/pause(), and playbackRate is only
    // ever set to one fixed value, never eased or repeatedly touched —
    // a dynamic/eased rate was tried here and made the tail end of the
    // clip visibly glitchy (browsers don't interpolate frequent
    // playbackRate writes smoothly), so the "smooth stop" instead
    // comes entirely from the crossfade below: the video plays at a
    // constant rate right up to its last frame, then fades into the
    // identical still image over FREEZE_TRANSITION_MS.
    const handleEnded = () => {
      setEnded(true);
      onEndedRef.current?.();
    };
    video.addEventListener("ended", handleEnded);
    video.playbackRate = PLAYBACK_RATE;

    // The <video>'s two <source> tags below are resolved natively by
    // the browser the moment it parses them — instantly, with zero
    // dependency on JS/hydration. This just reads back which one it
    // picked (via currentSrc) so the freeze-frame still matches, and
    // re-applies the fixed playback rate since some browsers reset it
    // once the source actually resolves.
    const updateLastFrame = () => {
      setLastFrame(
        video.currentSrc.includes("hero-mobile") ? LAST_FRAME.mobile : LAST_FRAME.desktop,
      );
      video.playbackRate = PLAYBACK_RATE;
    };
    updateLastFrame();
    video.addEventListener("loadedmetadata", updateLastFrame);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", updateLastFrame);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        // A plain CSS animation, not a React-driven opacity class: it
        // starts the instant this element paints, with zero dependency
        // on JS having hydrated yet. The previous JS-driven version
        // left the video sitting at opacity 0 (showing the black
        // background straight through) for however long hydration
        // took — seconds, on a real phone running a dev build — which
        // is what was actually causing the "blank/black on mobile"
        // reports, not the video itself failing to load.
        style={{ animation: "hero-fade-in 1.6s ease-out forwards" }}
        // The sync script right after this element sets `poster`
        // itself, before hydration — intentionally, so React doesn't
        // know about it and would otherwise log a (harmless but noisy)
        // hydration-mismatch warning for this one attribute.
        suppressHydrationWarning
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label="Sustainable office building surrounded by greenery, wind turbines and solar panels"
      >
        <source media={`(max-width: ${MOBILE_BREAKPOINT - 1}px)`} src="/video/hero-mobile.mp4" />
        <source src="/video/hero.mp4" />
      </video>
      {/* Sets the correctly-oriented poster the instant the browser
          parses this point in the document — before hydration, before
          any React effect. Without a poster, a real phone on a real
          (slower/variable) network shows solid black for however long
          the video takes to actually start decoding, and stays black
          forever if autoplay is blocked for any device-specific
          reason. This is a plain synchronous script specifically so it
          isn't gated behind JS bootstrapping either. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var v=document.currentScript.previousElementSibling;if(v)v.poster=window.matchMedia("(max-width: ${
            MOBILE_BREAKPOINT - 1
          }px)").matches?"/video/hero-mobile-first-frame.jpg":"/video/hero-first-frame.jpg";})();`,
        }}
      />
      {/* Crossfades on top once the clip ends, then stays put forever
          — the video never loops or restarts. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lastFrame}
        alt="Sustainable office building surrounded by greenery, wind turbines and solar panels"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-out ${
          ended ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: `${FREEZE_TRANSITION_MS}ms` }}
      />
    </div>
  );
}
