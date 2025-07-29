import { useState } from "react";
import type { Route } from "./+types/profile-page";
import { makeSSRClient } from "@/supa-client";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Badge } from "@/common/components/ui/badge";
import { Separator } from "@/common/components/ui/separator";
import { toast } from "sonner";

export function loader({ request }: Route.LoaderArgs) {
  const { client } = makeSSRClient(request);

  // 실제 구현에서는 사용자 정보, 주문 내역, 배송지 정보를 가져와야 합니다
  return {
    user: null,
    profile: null,
    orders: [],
    shippingAddresses: [],
  };
}

export function action({ request }: Route.ActionArgs) {
  // 실제 구현에서는 폼 데이터를 처리해야 합니다
  return {
    success: true,
  };
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: "내 정보 | 도자기 공방" },
    {
      name: "description",
      content: "내 정보 관리, 배송지 관리, 주문 내역을 확인할 수 있습니다.",
    },
  ];
};

export default function ProfilePage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { user, profile, orders, shippingAddresses } = loaderData || {};
  const [activeTab, setActiveTab] = useState("profile");

  // 내 정보 관리 컴포넌트
  function ProfileManagement() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      name: (profile as any)?.name || "",
      nickname: (profile as any)?.nickname || "",
      email: (user as any)?.email || "",
      phone: (profile as any)?.phone || "",
    });

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      // 실제 구현에서는 API 호출
      toast.success("정보가 수정되었습니다.");
      setIsEditing(false);
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            내 정보 관리
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "취소" : "수정"}
            </Button>
          </CardTitle>
          <CardDescription>
            이름과 닉네임 등 가입 정보를 확인하고 수정할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) =>
                    setFormData({ ...formData, nickname: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
                placeholder="010-0000-0000"
              />
            </div>
            {isEditing && (
              <Button type="submit" className="w-full">
                저장
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    );
  }

  // 배송지 관리 컴포넌트
  function ShippingAddressManagement() {
    const [addresses, setAddresses] = useState([
      {
        id: 1,
        name: "집",
        recipient: "홍길동",
        phone: "010-1234-5678",
        address: "서울시 강남구 테헤란로 123",
        detailAddress: "456동 789호",
        isDefault: true,
      },
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({
      name: "",
      recipient: "",
      phone: "",
      address: "",
      detailAddress: "",
      isDefault: false,
    });

    function handleAddAddress(e: React.FormEvent) {
      e.preventDefault();
      const address = {
        id: Date.now(),
        ...newAddress,
      };
      setAddresses([...addresses, address]);
      setNewAddress({
        name: "",
        recipient: "",
        phone: "",
        address: "",
        detailAddress: "",
        isDefault: false,
      });
      setIsAdding(false);
      toast.success("배송지가 추가되었습니다.");
    }

    function handleDeleteAddress(id: number) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
      toast.success("배송지가 삭제되었습니다.");
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            배송지 관리
            <Button onClick={() => setIsAdding(true)}>배송지 추가</Button>
          </CardTitle>
          <CardDescription>
            주문시 사용할 배송지 정보를 등록하고 관리할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{address.name}</span>
                  {address.isDefault && <Badge variant="secondary">기본</Badge>}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  삭제
                </Button>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>받는 사람: {address.recipient}</p>
                <p>연락처: {address.phone}</p>
                <p>
                  주소: {address.address} {address.detailAddress}
                </p>
              </div>
            </div>
          ))}

          {isAdding && (
            <form
              onSubmit={handleAddAddress}
              className="border rounded-lg p-4 space-y-4"
            >
              <h4 className="font-medium">새 배송지 추가</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addressName">배송지명</Label>
                  <Input
                    id="addressName"
                    value={newAddress.name}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, name: e.target.value })
                    }
                    placeholder="집, 회사 등"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient">받는 사람</Label>
                  <Input
                    id="recipient"
                    value={newAddress.recipient}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        recipient: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  placeholder="010-0000-0000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detailAddress">상세주소</Label>
                <Input
                  id="detailAddress"
                  value={newAddress.detailAddress}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      detailAddress: e.target.value,
                    })
                  }
                  placeholder="동, 호수 등"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      isDefault: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="isDefault">기본 배송지로 설정</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  추가
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsAdding(false)}
                >
                  취소
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    );
  }

  // 주문 내역 컴포넌트
  function OrderHistory() {
    const mockOrders = [
      {
        id: "ORD-001",
        date: "2024-01-15",
        status: "배송완료",
        items: [{ name: "도자기 컵", quantity: 2, price: 15000 }],
        total: 30000,
      },
      {
        id: "ORD-002",
        date: "2024-01-10",
        status: "배송중",
        items: [{ name: "도자기 접시", quantity: 1, price: 25000 }],
        total: 25000,
      },
      {
        id: "ORD-003",
        date: "2024-01-05",
        status: "주문접수",
        items: [{ name: "도자기 그릇", quantity: 3, price: 12000 }],
        total: 36000,
      },
    ];

    function getStatusBadge(status: string) {
      const statusMap = {
        주문접수: "default",
        배송중: "secondary",
        배송완료: "default",
      } as const;

      return (
        <Badge
          variant={statusMap[status as keyof typeof statusMap] || "default"}
        >
          {status}
        </Badge>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>주문 내역</CardTitle>
          <CardDescription>
            주문한 도자기들의 내역과 상태를 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{order.id}</h4>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>
              <Separator className="my-3" />
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      수량: {item.quantity}개
                    </p>
                  </div>
                  <p className="font-medium">{item.price.toLocaleString()}원</p>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="flex justify-between items-center">
                <span className="font-medium">총 결제금액</span>
                <span className="font-bold text-lg">
                  {order.total.toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">내 정보</h1>
          <p className="text-gray-600">
            내 정보 관리, 배송지 관리, 주문 내역을 확인하고 관리할 수 있습니다.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">내 정보 관리</TabsTrigger>
            <TabsTrigger value="shipping">배송지 관리</TabsTrigger>
            <TabsTrigger value="orders">주문 내역</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileManagement />
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            <ShippingAddressManagement />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <OrderHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
