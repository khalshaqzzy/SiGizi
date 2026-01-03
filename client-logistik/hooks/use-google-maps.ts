import { useEffect, useState } from 'react';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Jika sudah ada, langsung set loaded
    if (typeof window.google !== 'undefined' && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    // Cek jika script sudah ada di head untuk mencegah duplikasi
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&language=id&region=ID`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("[GMaps] Script loaded via manual injection.");
      setIsLoaded(true);
    };

    script.onerror = () => {
      console.error("[GMaps] Failed to load script.");
      setLoadError(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  }, []);

  return { isLoaded, loadError };
};