import { makeSSRClient } from "@/supa-client";
import type { Route } from "./+types/product-registration-page";
import { z } from "zod";
import { Form, redirect, useNavigation } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";
import { requireAdminAuth } from "@/lib/auth-helpers";
import { Upload, X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "제품명을 입력해주세요"),
  unique_name: z
    .string()
    .min(1, "영문 제품명을 입력해주세요")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "영문, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다"
    ),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  stock: z.number().min(0, "재고는 0 이상이어야 합니다"),
  description: z.string().min(1, "제품 설명을 입력해주세요"),
  category_id: z.number().nullable(),
  purchase_link: z.string().nullable(),
  detail: z.string().nullable(),
  exchange_refund_policy: z.string().nullable(),
  shipping_policy: z.string().nullable(),
  caution: z.string().nullable(),
  product_image_1: z
    .instanceof(File)
    .refine((file) => file.size > 0, "제품 이미지 1을 업로드해주세요")
    .refine(
      (file) => file.type.startsWith("image/"),
      "이미지 파일만 업로드 가능합니다"
    ),
  product_image_2: z.instanceof(File).nullable().optional(),
  product_image_3: z.instanceof(File).nullable().optional(),
  product_image_4: z.instanceof(File).nullable().optional(),
  product_image_5: z.instanceof(File).nullable().optional(),
  detail_page_image_1: z
    .instanceof(File)
    .refine((file) => file.size > 0, "상세페이지 이미지 1을 업로드해주세요")
    .refine(
      (file) => file.type.startsWith("image/"),
      "이미지 파일만 업로드 가능합니다"
    ),
  detail_page_image_2: z.instanceof(File).nullable().optional(),
  detail_page_image_3: z.instanceof(File).nullable().optional(),
  detail_page_image_4: z.instanceof(File).nullable().optional(),
  detail_page_image_5: z.instanceof(File).nullable().optional(),
});

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

  console.log("action formData :>> ", formData);

  const raw = Object.fromEntries(formData);

  // 파일 필드들을 처리하여 빈 파일을 null로 변환
  const getFileOrNull = (fieldName: string): File | null => {
    const file = formData.get(fieldName) as File | null;
    // 파일이 없거나 크기가 0이면 null 반환
    return file && file.size > 0 ? file : null;
  };

  const parsed = {
    name: raw.name as string,
    unique_name: raw.unique_name as string,
    price: parseFloat(raw.price as string),
    stock: parseInt(raw.stock as string),
    description: raw.description as string,
    category_id: raw.category_id ? parseInt(raw.category_id as string) : null,
    purchase_link: (raw.purchase_link as string) || null,
    detail: (raw.detail as string) || null,
    exchange_refund_policy: (raw.exchange_refund_policy as string) || null,
    shipping_policy: (raw.shipping_policy as string) || null,
    caution: (raw.caution as string) || null,
    product_image_1: getFileOrNull("product_image_1"),
    product_image_2: getFileOrNull("product_image_2"),
    product_image_3: getFileOrNull("product_image_3"),
    product_image_4: getFileOrNull("product_image_4"),
    product_image_5: getFileOrNull("product_image_5"),
    detail_page_image_1: getFileOrNull("detail_page_image_1"),
    detail_page_image_2: getFileOrNull("detail_page_image_2"),
    detail_page_image_3: getFileOrNull("detail_page_image_3"),
    detail_page_image_4: getFileOrNull("detail_page_image_4"),
    detail_page_image_5: getFileOrNull("detail_page_image_5"),
  };

  const { success, data, error } = formSchema.safeParse(parsed);

  console.log("formSchema success :>> ", success);
  console.log("formSchema data :>> ", data);
  console.log("formSchema error :>> ", error);

  if (!success) {
    return {
      formErrors: error.flatten().fieldErrors,
      formData: parsed,
    };
  }

  // 파일 업로드 처리
  const uploadedFiles: Record<string, string> = {};

  // 파일 필드들을 처리
  const fileFields = [
    "product_image_1",
    "product_image_2",
    "product_image_3",
    "product_image_4",
    "product_image_5",
    "detail_page_image_1",
    "detail_page_image_2",
    "detail_page_image_3",
    "detail_page_image_4",
    "detail_page_image_5",
  ];

  for (const fieldName of fileFields) {
    const file = data[fieldName as keyof typeof data] as File | null;
    if (file && file.size > 0) {
      // 이미지 타입 검증 (null이 아닌 경우에만)
      if (!file.type.startsWith("image/")) {
        throw new Error(`${fieldName}: 이미지 파일만 업로드 가능합니다`);
      }

      try {
        // 파일 확장자 추출
        const fileExtension = file.name.split(".").pop();
        const fileName = `${data.unique_name}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExtension}`;

        // Supabase Storage에 파일 업로드
        const { data: uploadData, error } = await client.storage
          .from("products")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        console.log("uploadData :>> ", uploadData);
        console.log("error :>> ", error);

        if (error) {
          console.error(`File upload error for ${fieldName}:`, error);
          throw new Error(`파일 업로드 실패: ${error.message}`);
        }

        // 업로드된 파일의 공개 URL 생성
        const {
          data: { publicUrl },
        } = client.storage.from("products").getPublicUrl(fileName);

        uploadedFiles[fieldName] = publicUrl;
        console.log(`File uploaded successfully: ${fieldName} = ${publicUrl}`);
      } catch (error) {
        console.error(`Error uploading file ${fieldName}:`, error);
        throw new Error(
          `파일 업로드 중 오류가 발생했습니다: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  }

  try {
    const { error: insertError } = await client.from("products").insert({
      name: data.name,
      unique_name: data.unique_name,
      price: data.price,
      product_image_1: uploadedFiles.product_image_1 || null,
      product_image_2: uploadedFiles?.product_image_2 || null,
      product_image_3: uploadedFiles?.product_image_3 || null,
      product_image_4: uploadedFiles?.product_image_4 || null,
      product_image_5: uploadedFiles?.product_image_5 || null,
      detail_page_image_1: uploadedFiles.detail_page_image_1 || null,
      detail_page_image_2: uploadedFiles?.detail_page_image_2 || null,
      detail_page_image_3: uploadedFiles?.detail_page_image_3 || null,
      detail_page_image_4: uploadedFiles?.detail_page_image_4 || null,
      detail_page_image_5: uploadedFiles?.detail_page_image_5 || null,
      stock: data.stock,
      description: data.description,
      category_id: data.category_id,
      purchase_link: data.purchase_link,
      detail: data.detail,
      exchange_refund_policy: data.exchange_refund_policy,
      shipping_policy: data.shipping_policy,
      caution: data.caution,
    } as any);

    if (insertError) {
      return {
        formErrors: { name: ["제품 등록에 실패했습니다."] },
        formData: parsed,
      };
    }

    return redirect("/shop");
  } catch (error) {
    return {
      formErrors: { name: ["제품 등록 중 오류가 발생했습니다."] },
      formData: parsed,
    };
  }
};

// 파일 업로드 컴포넌트
function FileUploadField({
  label,
  name,
  required = false,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log("handleFileChange file :>> ", file);
    if (file) {
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    console.log("thumbnailUrl :>> ", thumbnailUrl);

    return () => {
      console.log("thumbnailUrl :>> ", thumbnailUrl);
    };
  }, [thumbnailUrl]);

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && "*"}
      </label>
      <div className="space-y-2">
        {thumbnailUrl && (
          <div className="space-y-2">
            <div className="relative">
              <img
                src={thumbnailUrl}
                alt="미리보기"
                className="w-full h-32 object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setThumbnailUrl(null)}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              파일이 선택되었습니다. 다른 파일을 선택하려면 위의 X 버튼을
              클릭하세요.
            </div>
          </div>
        )}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            name={name}
            accept="image/*"
            onChange={handleFileChange}
            id={`file-${name}`}
            className="hidden"
          />
          {!thumbnailUrl && (
            <label
              htmlFor={`file-${name}`}
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                클릭하여 이미지 업로드
              </span>
              <span className="text-xs text-gray-500 mt-1">
                JPG, PNG, GIF (최대 5MB)
              </span>
            </label>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}

export default function ProductRegistrationPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
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
              <label className="block text-sm font-medium mb-2">
                영문 제품명 *
              </label>
              <input
                type="text"
                name="unique_name"
                placeholder="예: pompon-cup-blue"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                영문, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다
              </p>
              {actionData?.formErrors?.unique_name && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.formErrors.unique_name[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">가격 *</label>
              <input
                type="number"
                name="price"
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

          <div>
            <label className="block text-sm font-medium mb-2">
              구매 링크 (선택사항)
            </label>
            <input
              type="url"
              name="purchase_link"
              placeholder="https://example.com/product"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-muted-foreground mt-1">
              외부 구매 링크가 있는 경우 입력해주세요. 없으면 내부 결제 시스템을
              사용합니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              제품 규격 (선택사항)
            </label>
            <textarea
              name="detail"
              rows={3}
              placeholder="제품의 상세 규격 정보를 입력해주세요"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              교환/환불 정책 (선택사항)
            </label>
            <textarea
              name="exchange_refund_policy"
              rows={3}
              placeholder="교환 및 환불 정책을 입력해주세요"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              배송 정책 (선택사항)
            </label>
            <textarea
              name="shipping_policy"
              rows={3}
              placeholder="배송 관련 정책을 입력해주세요"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              주의사항 (선택사항)
            </label>
            <textarea
              name="caution"
              rows={3}
              placeholder="제품 사용 시 주의사항을 입력해주세요"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 제품 이미지들 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">제품 이미지 (썸네일용)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadField
                label="제품 이미지 1"
                name="product_image_1"
                required
                error={actionData?.formErrors?.product_image_1?.[0]}
              />
              <FileUploadField label="제품 이미지 2" name="product_image_2" />
              <FileUploadField label="제품 이미지 3" name="product_image_3" />
              <FileUploadField label="제품 이미지 4" name="product_image_4" />
              <FileUploadField label="제품 이미지 5" name="product_image_5" />
            </div>
          </div>

          {/* 상세페이지 이미지들 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">상세페이지 이미지</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadField
                label="상세페이지 이미지 1"
                name="detail_page_image_1"
                required
                error={actionData?.formErrors?.detail_page_image_1?.[0]}
              />
              <FileUploadField
                label="상세페이지 이미지 2"
                name="detail_page_image_2"
              />
              <FileUploadField
                label="상세페이지 이미지 3"
                name="detail_page_image_3"
              />
              <FileUploadField
                label="상세페이지 이미지 4"
                name="detail_page_image_4"
              />
              <FileUploadField
                label="상세페이지 이미지 5"
                name="detail_page_image_5"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "등록 중..." : "제품 등록"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
