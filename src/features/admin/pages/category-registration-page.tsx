import { makeSSRClient } from "@/supa-client";
import { z } from "zod";
import { Form, redirect, useNavigation } from "react-router";
import { useState } from "react";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { requireAdminAuth } from "@/lib/auth-helpers";
import type { Route } from "./+types/category-registration-page";
import { createCategory } from "../mutations";

export const formSchema = z.object({
  name: z.string().min(1, "카테고리명을 입력해주세요"),
});

export const meta: Route.MetaFunction = () => {
  return [{ title: "DOT | Category Registration" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Admin 권한 체크
  await requireAdminAuth(request);

  const { client } = makeSSRClient(request);

  // Get existing categories
  const { data: categories } = await client
    .from("categories")
    .select("*")
    .order("name");

  return {
    categories: categories || [],
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  // Admin 권한 체크
  const { user, profile } = await requireAdminAuth(request);

  console.log("User ID:", user.id);
  console.log("Profile:", profile);
  console.log("Is Admin:", profile?.role === "admin");

  const { client } = makeSSRClient(request);
  const formData = await request.formData();

  const categoryName = formData.get("name") as string;

  const validation = categorySchema.safeParse({ name: categoryName });

  if (!validation.success) {
    return {
      success: false,
      error: "카테고리명을 입력해주세요",
    };
  }

  console.log("categoryName :>> ", categoryName);

  try {
    const { error: insertError, categoryData } = await createCategory(client, {
      name: categoryName.trim(),
    });

    console.log("insertError :>> ", insertError);

    console.log("categoryData :>> ", categoryData);
    if (insertError) {
      return {
        success: false,
        error: "카테고리 등록에 실패했습니다.",
      };
    }

    console.log("categoryData :>> ", categoryData);

    // Get updated categories list
    const { data: categories } = await client
      .from("categories")
      .select("*")
      .order("name");

    return {
      success: true,
      categories: categories || [],
    };
  } catch (error) {
    return {
      success: false,
      error: "카테고리 등록 중 오류가 발생했습니다.",
    };
  }
};

const categorySchema = z.object({
  name: z.string().min(1, "카테고리명을 입력해주세요"),
});

export default function CategoryRegistrationPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const [categoryName, setCategoryName] = useState("");
  const categories = actionData?.categories || loaderData?.categories || [];

  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">카테고리 관리</h1>
        <p className="text-muted-foreground">
          제품 카테고리를 추가하고 관리합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 카테고리 추가 폼 */}
        <Card>
          <CardHeader>
            <CardTitle>새 카테고리 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <div>
                <Label htmlFor="name">카테고리명</Label>
                <Input
                  id="name"
                  name="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="카테고리명을 입력하세요"
                  required
                />
              </div>

              {actionData?.error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {actionData.error}
                </div>
              )}

              {actionData?.success && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                  카테고리가 성공적으로 등록되었습니다.
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                카테고리 추가
              </Button>
            </Form>
          </CardContent>
        </Card>

        {/* 기존 카테고리 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>기존 카테고리</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-muted-foreground">
                등록된 카테고리가 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {categories.map((category: any) => (
                  <div
                    key={category.category_id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ID: {category.category_id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
