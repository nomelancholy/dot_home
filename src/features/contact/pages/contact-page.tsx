import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/common/components/ui/carousel";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import { useEffect, useRef, useState } from "react";
import { Dock, DockIcon } from "@/common/components/ui/dock";
import { Instagram, MapPin, BookText, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";
import type { Route } from "./+types/contact-page";
import { supabaseAdmin } from "@/supa-client";
import { Skeleton } from "@/common/components/ui/skeleton";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const meta: Route.MetaFunction = () => {
  return [{ title: "DOT | Contact" }];
};

export const loader = async ({}: Route.LoaderArgs) => {
  const { data: images } = await supabaseAdmin.storage
    .from("assets")
    .list("contact");

  const contactImages: Record<string, string[]> = {
    chungmuro: [],
    euljiro: [],
  };

  images?.forEach((image) => {
    const { data: urlData } = supabaseAdmin.storage
      .from("assets")
      .getPublicUrl(`contact/${image.name}`);

    if (image.name.includes("chung")) {
      contactImages.chungmuro.push(urlData.publicUrl);
    } else if (image.name.includes("eul")) {
      contactImages.euljiro.push(urlData.publicUrl);
    }
  });

  return contactImages;
};

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-lg bg-background" />
      )}
      <img
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

declare global {
  interface Window {
    naver: any;
  }
}

export default function ContactPage({ loaderData }: Route.ComponentProps) {
  const { t, i18n } = useTranslation();
  const descriptions = {
    euljiro: Array.from({ length: 10 }, (_, i) =>
      t(`contact_directions_euljiro_${i}`)
    ),
    chungmuro: Array.from({ length: 10 }, (_, i) =>
      t(`contact_directions_chungmuro_${i}`)
    ),
  };

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function initializeMap() {
      if (window.naver && window.naver.maps && mapRef.current) {
        const position = new window.naver.maps.LatLng(
          37.562823554,
          126.99361333732
        );

        const center = new window.naver.maps.LatLng(
          37.563823554,
          126.99361333732
        );

        const map = new window.naver.maps.Map(mapRef.current, {
          center: center,
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
                        <p>${t("contact_naver_map_info")}</p>
                        <a style="color: #000; text-decoration: underline;" href="https://naver.me/xVBDxK0Q" target="_blank">
                            ${t("contact_naver_map_link")}
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
  }, [t]);

  return (
    <div className="flex flex-col items-center mb-8 flex-1 gap-4">
      <div className="flex justify-center mt-8 mb-8">
        <TooltipProvider>
          <Dock
            iconSize={40}
            iconMagnification={64}
            iconDistance={120}
            direction="middle"
          >
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://www.instagram.com/dot_sej/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="rounded-full"
                  >
                    <Instagram className="size-6" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>{t("contact_instagram")}</TooltipContent>
              </Tooltip>
            </DockIcon>
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://naver.me/5PVMsmRt"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Naver Map"
                    className="rounded-full"
                  >
                    <MapPin className="size-6" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>{t("contact_naver_map")}</TooltipContent>
              </Tooltip>
            </DockIcon>
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://blog.naver.com/eundi2c"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Blog"
                    className="rounded-full"
                  >
                    <BookText className="size-6" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>{t("contact_blog")}</TooltipContent>
              </Tooltip>
            </DockIcon>
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Copy Email"
                    className="rounded-full focus:outline-none cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText("eundi2c@naver.com");
                      toast(t("contact_email_copied"));
                    }}
                  >
                    <Mail className="size-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t("contact_copy_email")}</TooltipContent>
              </Tooltip>
            </DockIcon>
          </Dock>
        </TooltipProvider>
      </div>

      <div ref={mapRef} className="w-2/3 h-[400px]" />
      <div className="w-full flex flex-col items-center relative">
        <Tabs defaultValue="chungmuro" className="w-full max-w-xl">
          <TabsList className="w-full">
            <TabsTrigger value="chungmuro" className="cursor-pointer">
              {t("contact_directions_chungmuro_title")}
            </TabsTrigger>
            <TabsTrigger value="euljiro" className="cursor-pointer">
              {t("contact_directions_euljiro_title")}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="chungmuro"
            className="min-h-auto flex flex-col items-center"
          >
            <Carousel className="relative w-full  max-w-md">
              <CarouselContent className="flex items-center h-full">
                {loaderData?.chungmuro.map((image, index) => (
                  <CarouselItem key={index} className="h-full">
                    <ImageWithSkeleton
                      src={image}
                      alt={t("contact_directions_chungmuro_" + index)}
                    />
                    <p className="text-center pt-4 text-sm sm:text-base">
                      {t("contact_directions_chungmuro_" + index)}
                    </p>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: count }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all ${
                      idx === current
                        ? "bg-primary scale-110"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </Carousel>
          </TabsContent>
          <TabsContent value="euljiro">
            <div className="flex flex-col items-center relative">
              <Carousel className="relative w-full  max-w-md" setApi={setApi}>
                <CarouselContent className="flex items-center h-full">
                  {loaderData?.euljiro.map((image, index) => (
                    <CarouselItem key={index} className="h-full">
                      <ImageWithSkeleton
                        src={image}
                        alt={t("contact_directions_euljiro_" + index)}
                      />
                      <p className="text-center pt-4 text-sm sm:text-base">
                        {t("contact_directions_euljiro_" + index)}
                      </p>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: count }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all ${
                        idx === current
                          ? "bg-primary scale-110"
                          : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
