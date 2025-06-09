import { ShimmerButton } from "@/common/components/ui/shimmer-button";

export default function ShopPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Shop</h1>

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
