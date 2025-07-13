import { makeSSRClient } from "@/supa-client"
import type { Route } from "./+types/product-registration-page"
import { z } from "zod"

export const loader = async({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request)

    const {
        data: {user},
    } = await client.auth.getUser()
}

export const formSchema = z.object({
    name: z.string(),
    price: z.number(),
    thumbnail_url: z.string(),
    stock: z.number(),
    description: z.string()
})

export default function ProductRegistrationPage() {
    return <>상품 등록 페이지</>
}



