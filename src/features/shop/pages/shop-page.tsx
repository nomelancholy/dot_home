import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Lens } from "@/common/components/ui/lens";
import { ShimmerButton } from "@/common/components/ui/shimmer-button";
import { Button } from "@/common/components/ui/button";

export default function ShopPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-4 gap-4 w-full">
        {Array.from({ length: 12 }).map((_, index) => (
          <Card key={index} className="">
            <CardHeader>
              <Lens>
                <div className="aspect-square w-full rounded-lg overflow-hidden mb-4">
                  <img
                    src={`/assets/${index + 1}.jpg`}
                    alt="상품"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Lens>
              <CardTitle className="text-lg text-center">
                {`${index + 1} 번째 컵`}
              </CardTitle>
              {/* <CardDescription>
                    See our latest and best camp destinations all across the five
                    continents of the globe.
                  </CardDescription> */}
            </CardHeader>
            {/* <CardFooter className="space-x-4">
              <Button>Let&apos;s go</Button>
              <Button variant="secondary">Another time</Button>
            </CardFooter> */}
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <ShimmerButton
          shimmerColor="#fff"
          shimmerSize="0.1em"
          borderRadius="16px"
          shimmerDuration="2s"
          background="var(--primary)"
          className="px-6 py-3"
          onClick={() =>
            window.open(
              "https://smartstore.naver.com/day_off_today?nl-ts-pid=jZRnCdqVN8VsslY0dDKssssssio-091737",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          구매하러 가기
        </ShimmerButton>
      </div>
    </div>
  );
}
