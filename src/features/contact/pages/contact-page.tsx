import { ScratchToReveal } from "@/common/components/ui/scratch-to-reveal";

export default function ContactPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <img src="/assets/1.jpg" alt="" />
      <div>
        <div>
          <h3>Instagram</h3>
          <ScratchToReveal
            width={250}
            height={250}
            minScratchPercentage={70}
            className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
            gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
          >
            <a href="https://www.instagram.com/dot_studio" className="text-xl">
              @dot_studio
            </a>
          </ScratchToReveal>
        </div>

        <div>
          <ScratchToReveal
            width={250}
            height={250}
            minScratchPercentage={70}
            className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
            gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
          >
            <p className="text-9xl">😎</p>
          </ScratchToReveal>
        </div>

        <ScratchToReveal
          width={250}
          height={250}
          minScratchPercentage={70}
          className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
          gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
        >
          <p className="text-9xl">😎</p>
        </ScratchToReveal>
        <ScratchToReveal
          width={250}
          height={250}
          minScratchPercentage={70}
          className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
          gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
        >
          <p className="text-9xl">😎</p>
        </ScratchToReveal>
      </div>
    </div>
  );
}
