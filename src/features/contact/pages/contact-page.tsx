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
        const position = new window.naver.maps.LatLng(
          37.562823554,
          126.99361333732
        );

        const map = new window.naver.maps.Map(mapRef.current, {
          center: position,
          zoom: 16,
        });

        // 마커 생성
        const marker = new window.naver.maps.Marker({
          position,
          map,
        });

        // 정보창 생성
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding:8px;font-size:14px;">
                        <p>도자기공방 DOT.</P>
                        <a style="color: #000; text-decoration: underline;" href="https://naver.me/xVBDxK0Q" target="_blank">
                            네이버 지도로 보기
                        </a>
                      </div>`,
        });

        // 마커 클릭 시 정보창 열기
        window.naver.maps.Event.addListener(marker, "click", function () {
          infoWindow.open(map, marker);
        });

        // 페이지 로드시 바로 정보창 열기
        infoWindow.open(map, marker);
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
