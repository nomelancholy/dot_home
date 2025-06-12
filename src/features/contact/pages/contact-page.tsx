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
import { BentoGrid, BentoCard } from "@/common/components/ui/bento-grid";
import { CopyIcon } from "@radix-ui/react-icons";
import { MapIcon } from "lucide-react";

const features = [
  {
    Icon: CopyIcon,
    name: "Instagram",
    description: "@dot_sej",
    href: "https://www.instagram.com/dot_sej/",
    cta: "Go to Instagram",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: MapIcon,
    name: "Naver Map",
    description: "naver 지도 보기",
    href: "https://naver.me/5PVMsmRt",
    cta: "Go to Naver Map",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: MapIcon,
    name: "Blog",
    description: "dot blog",
    href: "https://blog.naver.com/eundi2c",
    cta: "Go to Blog",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-2 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
];

export default function ContactPage() {
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
    <div className="grid grid-cols-2 gap-4 items-start min-h-[800px]">
      <div className="flex flex-col gap-4 w-full h-full">
        <h2 className="text-center font-bold text-xl mb-2">Contact</h2>
        <BentoGrid className="lg:grid-rows-2 lg:grid-cols-2 h-full">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center">
        <h3 className="text-xl font-bold">오시는 길</h3>
        <Tabs defaultValue="chungmuro">
          <TabsList className="w-full cursor-pointer">
            <TabsTrigger value="chungmuro">충무로역 기준</TabsTrigger>
            <TabsTrigger value="euljiro">을지로 3가역 기준</TabsTrigger>
          </TabsList>
          <TabsContent value="chungmuro">
            <div className="flex flex-col items-center">
              <Carousel className="w-full h-[400px] max-w-md" setApi={setApi}>
                <CarouselContent className="flex items-center">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <img
                        className="w-full h-full object-cover"
                        src={`/assets/contact/chung_${(index + 1)
                          .toString()
                          .padStart(2, "0")}.jpg`}
                        alt={`충무로 역 기준 ${index + 1}번째 이미지`}
                        width={400}
                        height={400}
                      />
                      <p className="text-center pt-4 text-secondary-foreground">
                        {descriptions.chungmuro[index]}
                      </p>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: count }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`inline-block h-3 w-3 rounded-full transition-all ${
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
          <TabsContent value="euljiro">
            <div className="flex flex-col items-center">
              <Carousel className="w-full h-[400px] max-w-md" setApi={setApi}>
                <CarouselContent className="flex items-center">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <img
                        className="w-full h-full object-cover"
                        src={`/assets/contact/eul_${(index + 1)
                          .toString()
                          .padStart(2, "0")}.jpg`}
                        alt={`을지로 3가 역 기준 ${index + 1}번째 이미지`}
                        width={400}
                        height={400}
                      />
                      <p className="text-center pt-4 text-secondary-foreground">
                        {descriptions.euljiro[index]}
                      </p>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: count }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`inline-block h-3 w-3 rounded-full transition-all ${
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
