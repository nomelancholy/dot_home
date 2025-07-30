import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Lens } from "@/common/components/ui/lens";
import type { Route } from "./+types/shop-page";
import { Link } from "react-router";
import { makeSSRClient } from "@/supa-client";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  // 제품 정보 가져오기
  const { data: products, error } = await client
    .from("products")
    .select(
      `
      product_id,
      name,
      price,
      product_image_1
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return { products: [] };
  }

  return { products: products || [] };
};

export const meta: Route.MetaFunction = () => {
  return [{ title: "DOT | Shop" }];
};

export default function ShopPage({ loaderData }: Route.ComponentProps) {
  const products = loaderData?.products || [];

  // 가격을 원 단위로 변환하는 함수
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice.toLocaleString("ko-KR") + "원";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
        {products.map((product: any) => (
          <Link
            key={product.product_id}
            to={`/product/detail?id=${product.product_id}`}
            className="block"
          >
            <Card className="w-full bg-background border-none shadow-none hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <Lens>
                  <div className="aspect-square w-full rounded-lg overflow-hidden mb-4">
                    <img
                      src={product.product_image_1}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Lens>
                <div className="mt-2">
                  <CardTitle className="text-sm font-medium line-clamp-2 mb-2">
                    {product.name}
                  </CardTitle>
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
