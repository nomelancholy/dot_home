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
import { useEffect, useState } from "react";
import { Dock, DockIcon } from "@/common/components/ui/dock";
import { Instagram, MapPin, BookText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";
import type { Route } from "./+types/contact-page";
import { supabaseAdmin } from "@/supa-client";
import { Skeleton } from "@/common/components/ui/skeleton";

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

export default function ContactPage({ loaderData }: Route.ComponentProps) {
  const descriptions = {
    euljiro: [
      "을지로 3가역 8번 출구로 나와서",
      "쭉 진진합니다.",
      "사거리에서도 직진합니다",
      "청기와타운을 지나면 왼쪽에 작은 골목이 있습니다",
      "그 골목으로 들어오면",
      "우측 10시 방향에",
      "DOT 간판이 작게 걸려있습니다",
      "그 골목으로 들어오셔서",
      "계단을 올라오시면",
      "어세오세요 DOT입니다",
    ],
    chungmuro: [
      "충무로역 7번 출구로 나와서",
      "쭉 직진합니다",
      "간판 가게를 끼고 오른쪽을 보면",
      "길로 들어와서",
      "첫번째 골목에서 왼쪽을 보시면",
      "통일집 간판 뒤에 DOT 간판 있습니다",
      "내려옵니다",
      "그 골목으로 들어오셔서",
      "계단을 올라오시면",
      "어세오세요 DOT입니다",
    ],
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

  return (
    <div className="flex flex-col items-center mb-8 flex-1 gap-4">
      <h3 className="text-xl font-bold mt-6 mb-2">오시는 길</h3>
      <div className="w-full flex flex-col items-center relative">
        <Tabs defaultValue="chungmuro" className="w-full max-w-xl">
          <TabsList className="w-full">
            <TabsTrigger value="chungmuro" className="cursor-pointer">
              충무로역 기준
            </TabsTrigger>
            <TabsTrigger value="euljiro" className="cursor-pointer">
              을지로 3가역 기준
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
                      alt={`충무로 역 기준 ${index + 1}번째 이미지`}
                    />
                    <p className="text-center pt-4 text-sm sm:text-base">
                      {descriptions.chungmuro[index]}
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
                        alt={`을지로 3가 역 기준 ${index + 1}번째 이미지`}
                      />
                      <p className="text-center pt-4 text-sm sm:text-base">
                        {descriptions.euljiro[index]}
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
                <TooltipContent>Instagram</TooltipContent>
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
                <TooltipContent>Naver Map</TooltipContent>
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
                <TooltipContent>Blog</TooltipContent>
              </Tooltip>
            </DockIcon>
          </Dock>
        </TooltipProvider>
      </div>
    </div>
  );
}
