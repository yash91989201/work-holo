import { useRouter } from "@tanstack/react-router";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const router = useRouter();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll to top on navigation
  useEffect(() => {
    const unsubscribe = router.subscribe("onBeforeLoad", ({ next }) => {
      const currentPath = router.state.location.pathname;
      const nextPath = next.location.pathname;
      const nextHash = next.location.hash;

      // Check if this is a same-page hash navigation
      const isSamePageHashNavigation =
        currentPath === nextPath && nextHash && nextHash !== "";

      if (isSamePageHashNavigation) {
        // For same-page hash navigation, scroll to the element
        // Use setTimeout to ensure DOM has updated
        setTimeout(() => {
          const targetId = nextHash.replace("#", "");
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            if (lenisRef.current) {
              // Use Lenis for smooth scrolling
              lenisRef.current.scrollTo(targetElement, {
                offset: -100, // Account for fixed header
              });
            } else {
              // Fallback to native scroll
              targetElement.scrollIntoView({ behavior: "smooth" });
            }
          }
        }, 100);
      } else {
        // For page navigation, scroll to top
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }
    });

    return unsubscribe;
  }, [router]);

  return <>{children}</>;
}
