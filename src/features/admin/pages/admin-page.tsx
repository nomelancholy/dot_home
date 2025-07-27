import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Link } from "react-router";
import { Plus, Package, Tags, Users, Settings } from "lucide-react";
import type { Route } from "./+types/admin-page";
import { requireAdminAuth } from "@/lib/auth-helpers";

export const meta: Route.MetaFunction = () => {
  return [{ title: "DOT | Admin" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Admin 권한 체크
  const { user } = await requireAdminAuth(request);

  return { user };
};

export default function AdminPage({ loaderData }: Route.ComponentProps) {
  const adminFeatures = [
    {
      title: "카테고리 관리",
      description: "제품 카테고리를 추가하고 관리합니다.",
      icon: Tags,
      link: "/admin/category-registration",
      color: "bg-green-500",
    },
    {
      title: "제품 관리",
      description: "새로운 제품을 등록하고 기존 제품을 관리합니다.",
      icon: Package,
      link: "/admin/product-registration",
      color: "bg-blue-500",
    },

    {
      title: "사용자 관리",
      description: "사용자 정보와 권한을 관리합니다.",
      icon: Users,
      link: "#",
      color: "bg-purple-500",
    },
    {
      title: "주문 관리",
      description: "주문 정보를 관리합니다.",
      icon: Settings,
      link: "#",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">관리자 페이지</h1>
        <p className="text-muted-foreground">
          사이트 관리 기능에 접근할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminFeatures.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card
              key={feature.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <Button asChild className="w-full">
                  <Link to={feature.link}>
                    <Plus className="w-4 h-4 mr-2" />
                    접근하기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
