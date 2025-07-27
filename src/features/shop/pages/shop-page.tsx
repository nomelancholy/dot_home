import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Lens } from "@/common/components/ui/lens";
import type { Route } from "./+types/shop-page";
import { Link } from "react-router";

export const meta: Route.MetaFunction = () => {
  return [{ title: "DOT | Shop" }];
};

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
                <CardTitle className="text-lg text-center">
                  {`${index + 1} 번째 컵`}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
