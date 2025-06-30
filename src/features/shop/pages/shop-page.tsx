import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Lens } from "@/common/components/ui/lens";
import { ShimmerButton } from "@/common/components/ui/shimmer-button";
import type { Route } from "./+types/shop-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "DOT | Shop" }];
};

const products = [
  {
    id: 1,
    name: "폼폰 컵 (night blue) / Pompon Cup / Handmade Ceramic Cup",
    price: 38000,
    image: "/assets/pomponcup_night_blue.jpg",
    link: "https://smartstore.naver.com/day_off_today/products/9085901927",
  },
  {
    id: 2,
    name: "폼폰 컵 (green) / Pompon Cup / Handmade Ceramic Cup",
    price: 38000,
    image: "/assets/pomponcup_green.jpg",
    link: "https://smartstore.naver.com/day_off_today/products/9085829381",
  },
  {
    id: 3,
    name: "폼폰 컵 (ocean ivory) / Pompon Cup / Handmade Ceramic Cup",
    price: 38000,
    image: "/assets/pomponcup_ocean_ivory.jpg",
    link: "https://smartstore.naver.com/day_off_today/products/9085741036",
  },
  {
    id: 4,
    name: "폼폰 컵 (browny) / Pompon Cup / Handmade Ceramic Cup",
    price: 38000,
    image: "/assets/pomponcup_browny.jpg",
    link: "https://smartstore.naver.com/day_off_today/products/8878754469",
  },
  {
    id: 5,
    name: "폼폰 컵 (blue) / Pompon Cup / Handmade Ceramic Cup",
    price: 39000,
    image: "/assets/pomponcup_blue.jpg",
    link: "https://smartstore.naver.com/day_off_today/products/8189113884",
  },
  {
    id: 6,
    name: "폼폰 컵 (grass_green) / Pompon Cup / Handmade Ceramic Cup",
    price: 38000,
    image: "/assets/pomponcup_grass_green.jpg",
    link: "https://smartstore.naver.com/day_off_today/products/7779952521",
  },
  {
    id: 7,
    name: "폼폰 컵 (Large) / Pompon Cup / Handmade Ceramic Cup",
    price: 31000,
    image: "/assets/pomponcup_large.jpg",
    link: "https://smartstore.naver.com/day_off_today/products/7779883362",
  },
  {
    id: 8,
    name: "폼폰 컵 / Pompon Cup / Handmade Ceramic Cup",
    price: 35000,
    image: "/assets/pomponcup.jpg",
    link: "https://smartstore.naver.com/day_off_today/products/7779840549",
  },
];

export default function ShopPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
        {products.map((product) => (
          <Card
            key={product.id}
            className="w-full bg-background border-none shadow-none"
          >
            <CardHeader>
              <Lens>
                <div className="aspect-square w-full rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Lens>
              <CardTitle className="text-base text-center">
                {product.name}
              </CardTitle>
              <div className="text-center text-primary font-semibold mt-1 text-sm">
                {product.price.toLocaleString()}원
              </div>
              <div className="flex justify-center mt-3">
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/80 transition"
                >
                  상세보기
                </a>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* <div className="mt-10">
        <ShimmerButton
          shimmerColor="#fff"
          shimmerSize="0.1em"
          borderRadius="16px"
          shimmerDuration="2s"
          background="var(--primary)"
          className="px-6 py-3"
          onClick={() =>
            window.open(
              "https://smartstore.naver.com/day_off_today?nl-ts-pid=jZRnCdqVN8VsslY0dDKssssssio-091737",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          구매하러 가기
        </ShimmerButton>
      </div> */}
    </div>
  );
}
