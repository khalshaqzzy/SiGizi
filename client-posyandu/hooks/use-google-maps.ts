import { useEffect, useState } from 'react';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Jika sudah terdefinisi sepenuhnya, langsung set loaded
    if (typeof window.google !== 'undefined' && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    // 2. Define callback global
    (window as any).googleMapsCallback = () => {
      console.log("[GMaps] Ready via callback.");
      setIsLoaded(true);
    };

    // 3. Cek jika script sedang dalam proses loading (sudah ada di head)
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      // Tunggu script yang sudah ada selesai
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // 4. Jika belum ada, buat script baru
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.error("GMaps API Key missing");
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&language=id&region=ID&loading=async&callback=googleMapsCallback`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error("[GMaps] Failed to load script.");
      setLoadError(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  }, []);

  return { isLoaded, loadError };
};
