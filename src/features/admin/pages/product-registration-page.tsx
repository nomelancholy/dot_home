import { makeSSRClient } from "@/supa-client";
import type { Route } from "./+types/product-registration-page";
import { z } from "zod";
import { Form, redirect } from "react-router";
import { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";
import { categories } from "../../shop/schema";
import { requireAdminAuth } from "@/lib/auth-helpers";
import { Upload, X } from "lucide-react";

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Admin 권한 체크
  await requireAdminAuth(request);

  const { client } = makeSSRClient(request);

  // Get categories for the form
  const { data: categoriesData } = await client
    .from("categories")
    .select("*")
    .order("name");

  return {
    categories: categoriesData || [],
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  // Admin 권한 체크
  await requireAdminAuth(request);

  const { client } = makeSSRClient(request);
  const formData = await request.formData();

  if (
    formData.get("thumbnail_url") ||
    formData.get("product_image_1") ||
    formData.get("product_image_2") ||
    formData.get("product_image_3") ||
    formData.get("product_image_4") ||
    formData.get("product_image_5")
  ) {
    const file = formData.get("thumbnail_url") as File;
    const file1 = formData.get("product_image_1") as File;
    const file2 = formData.get("product_image_2") as File;
    const file3 = formData.get("product_image_3") as File;
    const file4 = formData.get("product_image_4") as File;
    const file5 = formData.get("product_image_5") as File;

    const { data, error } = await client.storage
      .from("product-images")
      .upload(file.name, file);
    if (error) throw error;
  }

  const raw = Object.fromEntries(formData);

  const parsed = {
    name: raw.name as string,
    price: parseFloat(raw.price as string),
    thumbnail_url: raw.thumbnail_url as string,
    product_image_1: raw.product_image_1 as string,
    product_image_2: (raw.product_image_2 as string) || null,
    product_image_3: (raw.product_image_3 as string) || null,
    product_image_4: (raw.product_image_4 as string) || null,
    product_image_5: (raw.product_image_5 as string) || null,
    stock: parseInt(raw.stock as string),
    description: raw.description as string,
    category_id: raw.category_id ? parseInt(raw.category_id as string) : null,
  };

  const { success, data, error } = formSchema.safeParse(parsed);

  if (!success) {
    return {
      formErrors: error.flatten().fieldErrors,
      formData: parsed,
    };
  }

  try {
    const { error: insertError } = await client.from("product").insert({
      name: data.name,
      price: data.price,
      thumbnail_url: data.thumbnail_url,
      product_image_1: data.product_image_1,
      product_image_2: data.product_image_2,
      product_image_3: data.product_image_3,
      product_image_4: data.product_image_4,
      product_image_5: data.product_image_5,
      stock: data.stock,
      description: data.description,
      category_id: data.category_id,
    });

    if (insertError) {
      return {
        formErrors: { name: ["제품 등록에 실패했습니다."] },
        formData: parsed,
      };
    }

    return redirect("/admin/product-registration");
  } catch (error) {
    return {
      formErrors: { name: ["제품 등록 중 오류가 발생했습니다."] },
      formData: parsed,
    };
  }
};

const formSchema = z.object({
  name: z.string().min(1, "제품명을 입력해주세요"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  thumbnail_url: z.string().min(1, "썸네일 이미지를 업로드해주세요"),
  product_image_1: z.string().min(1, "제품 이미지 1을 업로드해주세요"),
  product_image_2: z.string().nullable(),
  product_image_3: z.string().nullable(),
  product_image_4: z.string().nullable(),
  product_image_5: z.string().nullable(),
  stock: z.number().min(0, "재고는 0 이상이어야 합니다"),
  description: z.string().min(1, "제품 설명을 입력해주세요"),
  category_id: z.number().nullable(),
});

// 파일 업로드 컴포넌트
function FileUploadField({
  label,
  name,
  required = false,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // TODO: 실제 파일 업로드 로직 구현
      // const { data, error } = await uploadToBucket(file);
      // if (error) throw error;
      // onChange(data.url);

      // 임시로 파일명을 URL로 사용 (실제 구현 시 제거)
      const fakeUrl = `https://example.com/uploads/${file.name}`;
      onChange(fakeUrl);
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div>
      <Form method="post" encType="multipart/form-data">
        <label className="block text-sm font-medium mb-2">
          {label} {required && "*"}
        </label>
        <div className="space-y-2">
          {value ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <span className="text-sm text-green-700 truncate">{value}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("")}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                name={name}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id={`file-${name}`}
                required={required}
              />
              <label
                htmlFor={`file-${name}`}
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {isUploading ? "업로드 중..." : "클릭하여 이미지 업로드"}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF (최대 5MB)
                </span>
              </label>
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </Form>
    </div>
  );
}

export default function ProductRegistrationPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    thumbnail_url: "",
    product_image_1: "",
    product_image_2: "",
    product_image_3: "",
    product_image_4: "",
    product_image_5: "",
    stock: "",
    description: "",
    category_id: "",
  });

  const categories = loaderData?.categories || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">제품 등록</h1>
        <p className="text-muted-foreground">새로운 제품을 등록합니다.</p>
      </div>

      <Card className="p-6">
        <Form method="post" className="space-y-6" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">제품명 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {actionData?.formErrors?.name && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.formErrors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">가격 *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
              {actionData?.formErrors?.price && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.formErrors.price[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">재고 *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
              {actionData?.formErrors?.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.formErrors.stock[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">카테고리</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">카테고리 선택</option>
                {categories.map((category: any) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              제품 설명 *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {actionData?.formErrors?.description && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.formErrors.description[0]}
              </p>
            )}
          </div>

          {/* 썸네일 이미지 */}
          <FileUploadField
            label="썸네일 이미지"
            name="thumbnail_url"
            required
            value={formData.thumbnail_url}
            onChange={(value) =>
              setFormData({ ...formData, thumbnail_url: value })
            }
            error={actionData?.formErrors?.thumbnail_url?.[0]}
          />

          {/* 제품 이미지들 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">제품 이미지</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadField
                label="제품 이미지 1"
                name="product_image_1"
                required
                value={formData.product_image_1}
                onChange={(value) =>
                  setFormData({ ...formData, product_image_1: value })
                }
                error={actionData?.formErrors?.product_image_1?.[0]}
              />
              <FileUploadField
                label="제품 이미지 2"
                name="product_image_2"
                value={formData.product_image_2}
                onChange={(value) =>
                  setFormData({ ...formData, product_image_2: value })
                }
              />
              <FileUploadField
                label="제품 이미지 3"
                name="product_image_3"
                value={formData.product_image_3}
                onChange={(value) =>
                  setFormData({ ...formData, product_image_3: value })
                }
              />
              <FileUploadField
                label="제품 이미지 4"
                name="product_image_4"
                value={formData.product_image_4}
                onChange={(value) =>
                  setFormData({ ...formData, product_image_4: value })
                }
              />
              <FileUploadField
                label="제품 이미지 5"
                name="product_image_5"
                value={formData.product_image_5}
                onChange={(value) =>
                  setFormData({ ...formData, product_image_5: value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              취소
            </Button>
            <Button type="submit">제품 등록</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
