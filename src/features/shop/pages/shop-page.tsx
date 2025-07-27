import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Lens } from "@/common/components/ui/lens";
import type { Route } from "./+types/shop-page";
import { Link } from "react-router";

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
        {Array.from({ length: 12 }).map((_, index) => (
          <Link
            key={index}
            to={`/product/detail?id=${index + 1}`}
            className="block"
          >
            <Card className="w-full bg-background border-none shadow-none hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <Lens>
                  <div className="aspect-square w-full rounded-lg overflow-hidden mb-4">
                    <img
                      src={`/assets/${index + 1}.jpg`}
                      alt="상품"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Lens>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

    </div>
  );
}
