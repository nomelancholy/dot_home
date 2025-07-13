import { makeSSRClient } from "@/supa-client"
import type { Route } from "./+types/product-registration-page"
import { z } from "zod"
import { Form, redirect } from "react-router"
import { useState } from "react"
import { Button } from "@/common/components/ui/button"
import { Card } from "@/common/components/ui/card"
import { categories } from "../schema"

export const loader = async({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request)

    const {
        data: { user },
    } = await client.auth.getUser()

    if (!user) {
        return redirect("/auth/login")
    }

    // Check if user has admin role
    const { data: profile } = await client
        .from("profiles")
        .select("role")
        .eq("profile_id", user.id)
        .single()

    if (!profile || profile.role !== "admin") {
        return redirect("/shop")
    }

    // Get categories for the form
    const { data: categoriesData } = await client
        .from("categories")
        .select("*")
        .order("name")

    return {
        categories: categoriesData || []
    }
}

export const action = async({ request }: Route.ActionArgs) => {
    const { client } = makeSSRClient(request)

    const {
        data: { user },
    } = await client.auth.getUser()

    if (!user) {
        return redirect("/auth/login")
    }

    // Check admin role again in action
    const { data: profile } = await client
        .from("profiles")
        .select("role")
        .eq("profile_id", user.id)
        .single()

    if (!profile || profile.role !== "admin") {
        return redirect("/shop")
    }

    const formData = await request.formData()
    const raw = Object.fromEntries(formData)

    const parsed = {
        name: raw.name as string,
        price: parseFloat(raw.price as string),
        thumbnail_url: raw.thumbnail_url as string,
        stock: parseInt(raw.stock as string),
        description: raw.description as string,
        category_id: raw.category_id ? parseInt(raw.category_id as string) : null
    }

    const { success, data, error } = formSchema.safeParse(parsed)

    if (!success) {
        return {
            formErrors: error.flatten().fieldErrors,
            formData: parsed
        }
    }

    try {
        const { data: newProduct, error: insertError } = await client
            .from("product")
            .insert({
                name: data.name,
                price: data.price,
                thumbnail_url: data.thumbnail_url,
                stock: data.stock,
                description: data.description,
                category_id: data.category_id
            })
            .select()
            .single()

        if (insertError) {
            return {
                formErrors: { 
                    name: ["상품 등록에 실패했습니다."],
                    price: [],
                    thumbnail_url: [],
                    stock: [],
                    description: [],
                    category_id: []
                },
                formData: parsed
            }
        }

        return redirect("/shop")
    } catch (error) {
        return {
            formErrors: { 
                name: ["상품 등록 중 오류가 발생했습니다."],
                price: [],
                thumbnail_url: [],
                stock: [],
                description: [],
                category_id: []
            },
            formData: parsed
        }
    }
}

export const formSchema = z.object({
    name: z.string().min(1, "상품명을 입력해주세요"),
    price: z.number().min(0, "가격은 0 이상이어야 합니다"),
    thumbnail_url: z.string().min(1, "썸네일 URL을 입력해주세요"),
    stock: z.number().min(0, "재고는 0 이상이어야 합니다"),
    description: z.string().min(1, "상품 설명을 입력해주세요"),
    category_id: z.number().nullable()
})

export default function ProductRegistrationPage({ loaderData, actionData }: Route.ComponentProps) {
    const [formData, setFormData] = useState({
        name: actionData?.formData?.name || "",
        price: actionData?.formData?.price?.toString() || "",
        thumbnail_url: actionData?.formData?.thumbnail_url || "",
        stock: actionData?.formData?.stock?.toString() || "",
        description: actionData?.formData?.description || "",
        category_id: actionData?.formData?.category_id?.toString() || ""
    })

    const formErrors = actionData?.formErrors

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card className="p-6">
                    <h1 className="text-2xl font-bold mb-6 text-center">상품 등록</h1>
                    
                    {formErrors?.name && formErrors.name.length > 0 && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {formErrors.name.map((error: string, index: number) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}

                    <Form method="post" className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                                상품명 *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            {formErrors?.name && formErrors.name.length > 0 && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.name.join(", ")}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="category_id" className="block text-sm font-medium mb-2">
                                카테고리
                            </label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={formData.category_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">카테고리 선택</option>
                                {loaderData?.categories?.map((category) => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium mb-2">
                                가격 *
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            {formErrors?.price && formErrors.price.length > 0 && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.price.join(", ")}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium mb-2">
                                재고 *
                            </label>
                            <input
                                id="stock"
                                name="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            {formErrors?.stock && formErrors.stock.length > 0 && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.stock.join(", ")}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="thumbnail_url" className="block text-sm font-medium mb-2">
                                썸네일 URL *
                            </label>
                            <input
                                id="thumbnail_url"
                                name="thumbnail_url"
                                type="url"
                                value={formData.thumbnail_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="https://example.com/image.jpg"
                                required
                            />
                            {formErrors?.thumbnail_url && formErrors.thumbnail_url.length > 0 && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.thumbnail_url.join(", ")}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-2">
                                상품 설명 *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                required
                            />
                            {formErrors?.description && formErrors.description.length > 0 && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.description.join(", ")}</p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                className="flex-1"
                            >
                                상품 등록
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => window.history.back()}
                            >
                                취소
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    )
}



