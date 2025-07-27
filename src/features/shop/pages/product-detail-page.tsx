import { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import { Minus, Plus, Heart, Share2 } from "lucide-react";
import type { Route } from "./+types/product-detail-page";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const productId = url.searchParams.get("id") || "1";

  // 실제로는 데이터베이스에서 상품 정보를 조회
  // 임시로 더미 데이터 사용 (productId에 따라 다른 상품 정보)
  const products = {
    "1": {
      product_id: 1,
      name: "SAGUA 사과 인센스홀더",
      price: 42000,
      description:
        "전 과정 손으로 빚어 만드는 공정의 특성상 같은 제품이라도 약간의 차이가 있을 수 있습니다.",
      thumbnail_url: "/assets/1.jpg",
      stock: 10,
      category: "인센스홀더",
      is_best: true,
      images: [
        "/assets/1.jpg",
        "/assets/2.jpg",
        "/assets/3.jpg",
        "/assets/4.jpg",
      ],
      details: {
        material: "도자기",
        size: "가로 8cm x 세로 6cm",
        weight: "약 200g",
        origin: "국내제작",
      },
      notice: [
        "본 제품은 환불 불가 상품입니다. (하자 있을 경우 7일 이내 교환 가능)",
        "한 개 한 개 손으로 빚어 만드는 제품 특성상 형태, 채색의 느낌이 사진과 다를 수 있습니다.",
        "수작업으로 만들어진 도자기는 안전하며 잘 관리해 주시는 만큼 오랫동안 사용하실 수 있습니다.",
        "도자기는 급격한 온도변화에 노출되거나 강한 충격을 받을 경우 크랙 및 파손이 될 수 있습니다.",
      ],
    },
    "2": {
      product_id: 2,
      name: "클래식 머그컵",
      price: 28000,
      description: "일상에서 편안하게 사용할 수 있는 클래식한 머그컵입니다.",
      thumbnail_url: "/assets/2.jpg",
      stock: 15,
      category: "컵",
      is_best: false,
      images: [
        "/assets/2.jpg",
        "/assets/3.jpg",
        "/assets/4.jpg",
        "/assets/5.jpg",
      ],
      details: {
        material: "도자기",
        size: "지름 8cm x 높이 10cm",
        weight: "약 300g",
        origin: "국내제작",
      },
      notice: [
        "본 제품은 환불 불가 상품입니다. (하자 있을 경우 7일 이내 교환 가능)",
        "한 개 한 개 손으로 빚어 만드는 제품 특성상 형태, 채색의 느낌이 사진과 다를 수 있습니다.",
        "수작업으로 만들어진 도자기는 안전하며 잘 관리해 주시는 만큼 오랫동안 사용하실 수 있습니다.",
        "도자기는 급격한 온도변화에 노출되거나 강한 충격을 받을 경우 크랙 및 파손이 될 수 있습니다.",
      ],
    },
  };

  const product = products[productId as keyof typeof products] || products["1"];

  return { product };
};

export default function ProductDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const { product } = loaderData;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase" && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상품 이미지 섹션 */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 상품 정보 섹션 */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.is_best && (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800"
                  >
                    BEST
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {product.category}
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}원
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* 수량 선택 */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">수량</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-1 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange("increase")}
                    disabled={quantity >= product.stock}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  재고: {product.stock}개
                </span>
              </div>

              {/* 총 가격 */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">총 상품금액</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(product.price * quantity)}원
                  </span>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex gap-2">
                <Button className="flex-1" size="lg">
                  구매하기
                </Button>
                <Button variant="outline" className="flex-1" size="lg">
                  장바구니
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  찜하기
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  공유하기
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 상품 상세 정보 탭 */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">상세정보</TabsTrigger>
              <TabsTrigger value="notice">구매안내</TabsTrigger>
              <TabsTrigger value="reviews">구매평</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">상품 상세 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">재질:</span>{" "}
                    {product.details.material}
                  </div>
                  <div>
                    <span className="font-medium">크기:</span>{" "}
                    {product.details.size}
                  </div>
                  <div>
                    <span className="font-medium">무게:</span>{" "}
                    {product.details.weight}
                  </div>
                  <div>
                    <span className="font-medium">제조국:</span>{" "}
                    {product.details.origin}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notice" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">구매 전 안내사항</h3>
                <ul className="space-y-2">
                  {product.notice.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">구매평</h3>
                <p className="text-muted-foreground">아직 구매평이 없습니다.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
