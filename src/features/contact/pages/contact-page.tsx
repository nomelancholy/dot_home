import { ScratchToReveal } from "@/common/components/ui/scratch-to-reveal";
import { useEffect, useRef } from "react";

// 1. naver 타입 선언 (파일 상단에 추가)
declare global {
  interface Window {
    naver: any;
  }
}

export default function ContactPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function initializeMap() {
      if (window.naver && window.naver.maps && mapRef.current) {
        new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(37.566826, 126.9786567),
          zoom: 15,
        });
      }
    }

    const scriptId = "naver-map-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=db60iht0lc";
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else {
      if (window.naver && window.naver.maps) {
        initializeMap();
      } else {
        document
          .getElementById(scriptId)
          ?.addEventListener("load", initializeMap);
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2>찾아오시는 길</h2>
        <div ref={mapRef} className="w-full h-[400px]" />
      </div>
      <div>
        <div>
          <h3>Instagram</h3>
          <ScratchToReveal
            width={250}
            height={250}
            minScratchPercentage={70}
            className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
            gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
          >
            <a href="https://www.instagram.com/dot_sej" className="text-xl">
              @dot_sej
            </a>
          </ScratchToReveal>
        </div>

        <div>
          <ScratchToReveal
            width={250}
            height={250}
            minScratchPercentage={70}
            className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
            gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
          >
            <p className="text-9xl">😎</p>
          </ScratchToReveal>
        </div>

        <ScratchToReveal
          width={250}
          height={250}
          minScratchPercentage={70}
          className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
          gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
        >
          <p className="text-9xl">😎</p>
        </ScratchToReveal>
        <ScratchToReveal
          width={250}
          height={250}
          minScratchPercentage={70}
          className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
          gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
        >
          <p className="text-9xl">😎</p>
        </ScratchToReveal>
      </div>
    </div>
  );
}
