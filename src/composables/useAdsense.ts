// src/composables/useAdsense.ts
let adsenseLoaded = false;

export function useAdsense() {
  const loadAdsense = () => {
    if (adsenseLoaded) return;

    if (document.querySelector('script[src*="adsbygoogle.js"]')) {
      adsenseLoaded = true;
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4160697772127882";
    script.crossOrigin = "anonymous";

    document.head.appendChild(script);
    adsenseLoaded = true;
  };

  const pushAds = () => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense push skipped:", e);
    }
  };

  return { loadAdsense, pushAds };
}
