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
import { makeSSRClient } from "@/supa-client";
import { useNavigate } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const productId = url.searchParams.get("id") || "1";
  const { client } = makeSSRClient(request);

  try {
    // 실제 데이터베이스에서 상품 정보 조회
    const { data: product, error } = await client
      .from("products")
      .select(
        `
        *,
        categories(name)
      `
      )
      .eq("product_id", parseInt(productId))
      .single();

    if (error || !product) {
      // 상품이 없으면 기본 데이터 반환
      return {
        product: {
          product_id: 1,
          name: "SAGUA 사과 인센스홀더",
          price: 42000,
          description:
            "전 과정 손으로 빚어 만드는 공정의 특성상 같은 제품이라도 약간의 차이가 있을 수 있습니다.",
          stock: 10,
          category: "인센스홀더",
          is_best: true,
          purchase_link: null,
          detail: null,
          exchange_refund_policy: null,
          shipping_policy: null,
          caution: null,
          // 스키마에 맞춰 이미지 필드들 추가
          product_image_1: "/assets/1.jpg",
          product_image_2: "/assets/2.jpg",
          product_image_3: "/assets/3.jpg",
          product_image_4: "/assets/4.jpg",
          product_image_5: "/assets/5.jpg",
          detail_page_image_1: "/assets/1.jpg",
          detail_page_image_2: "/assets/2.jpg",
          detail_page_image_3: "/assets/3.jpg",
          detail_page_image_4: "/assets/4.jpg",
          detail_page_image_5: "/assets/5.jpg",
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
      };
    }

    // 실제 데이터를 스키마에 맞게 변환
    const productImages = [
      (product as any).product_image_1,
      (product as any).product_image_2,
      (product as any).product_image_3,
      (product as any).product_image_4,
      (product as any).product_image_5,
    ].filter(Boolean);

    const detailImages = [
      (product as any).detail_page_image_1,
      (product as any).detail_page_image_2,
      (product as any).detail_page_image_3,
      (product as any).detail_page_image_4,
      (product as any).detail_page_image_5,
    ].filter(Boolean);

    return {
      product: {
        ...product,
        category: product.categories?.name || "기타",
        is_best: false, // 실제로는 별도 필드로 관리
        purchase_link: (product as any).purchase_link || null,
        detail: (product as any).detail || null,
        exchange_refund_policy: (product as any).exchange_refund_policy || null,
        shipping_policy: (product as any).shipping_policy || null,
        caution: (product as any).caution || null,
        images: productImages,
        detail_images: detailImages,
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
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    // 에러 시 기본 데이터 반환
    return {
      product: {
        product_id: 1,
        name: "SAGUA 사과 인센스홀더",
        price: 42000,
        description:
          "전 과정 손으로 빚어 만드는 공정의 특성상 같은 제품이라도 약간의 차이가 있을 수 있습니다.",
        stock: 10,
        category: "인센스홀더",
        is_best: true,
        purchase_link: null,
        detail: null,
        exchange_refund_policy: null,
        shipping_policy: null,
        caution: null,
        images: [
          "/assets/1.jpg",
          "/assets/2.jpg",
          "/assets/3.jpg",
          "/assets/4.jpg",
        ],
        detail_images: [
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
    };
  }
};

export default function ProductDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const { product } = loaderData;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("product");
  const navigate = useNavigate();

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

  const handlePurchaseClick = () => {
    if (product.purchase_link) {
      window.open(product.purchase_link, "_blank");
    } else {
      navigate(`/payment/${product.product_id}`);
    }
  };

  // 제품 이미지와 상세페이지 이미지 중 선택된 탭에 따라 표시할 이미지 결정
  const displayImages =
    activeTab === "product"
      ? product.images || []
      : product.detail_images || [];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상품 이미지 섹션 */}
          <div className="space-y-4">
            {/* 이미지 탭 */}
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("product")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "product"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                제품 이미지
              </button>
              <button
                onClick={() => setActiveTab("detail")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "detail"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                상세 이미지
              </button>
            </div>

            <div className="aspect-square w-full rounded-lg overflow-hidden">
              <img
                src={displayImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {displayImages.map((image, index) => (
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
                {/* <span className="text-sm text-muted-foreground">
                  재고: {product.stock}개
                </span> */}
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
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handlePurchaseClick}
                >
                  구매하기
                </Button>
                <Button variant="outline" className="flex-1" size="lg">
                  장바구니
                </Button>
              </div>

              {/* <div className="flex gap-2">
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  공유하기
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        {/* 상품 상세 정보 탭 */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="details">상세정보</TabsTrigger>
              <TabsTrigger value="specs">제품규격</TabsTrigger>
              <TabsTrigger value="policy">교환/환불</TabsTrigger>
              <TabsTrigger value="shipping">배송정책</TabsTrigger>
              <TabsTrigger value="caution">주의사항</TabsTrigger>
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

            <TabsContent value="specs" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">제품 규격</h3>
                {product.detail ? (
                  <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                    {product.detail}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    제품 규격 정보가 없습니다.
                  </p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="policy" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">교환/환불 정책</h3>
                {product.exchange_refund_policy ? (
                  <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                    {product.exchange_refund_policy}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    교환/환불 정책이 없습니다.
                  </p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">배송 정책</h3>
                {product.shipping_policy ? (
                  <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                    {product.shipping_policy}
                  </div>
                ) : (
                  <p className="text-muted-foreground">배송 정책이 없습니다.</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="caution" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">주의사항</h3>
                {product.caution ? (
                  <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                    {product.caution}
                  </div>
                ) : (
                  <p className="text-muted-foreground">주의사항이 없습니다.</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
