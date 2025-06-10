import { BlurFade } from "@/common/components/ui/blur-fade";
// import { TypingAnimation } from "@/common/components/ui/typing-animation";
import { TextReveal } from "@/common/components/ui/text-reveal";
import { SparklesText } from "@/components/magicui/sparkles-text";

const images = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "14.jpg",
];

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <BlurFade delay={0.2} duration={0.8} className="w-1/2 h-1/2 py-10">
        <img src="/assets/logo.jpg" alt="logo" />
      </BlurFade>
      <SparklesText className="py-20">
        어서오세요 :) 도자기 공방 DOT입니다.
      </SparklesText>
      <TextReveal>
        {`DOT는 
Day Off Today의 약자입니다.
디오티 공간에서 편안히 쉬어가세요`}
      </TextReveal>

      <section id="photos">
        <div className="columns-2 gap-4 sm:columns-3">
          {images.map((imageUrl, idx) => (
            <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
              <img
                className="mb-4 size-full rounded-lg object-contain"
                src={`/assets/${imageUrl}`}
                alt={`Random stock image ${idx + 1}`}
              />
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  );
}
