import { BlurFade } from "@/common/components/ui/blur-fade";
// import { TypingAnimation } from "@/common/components/ui/typing-animation";
import { TextReveal } from "@/common/components/ui/text-reveal";
import { SparklesText } from "@/common/components/ui/sparkles-text";
import { cn } from "@/lib/utils";

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
  "13.jpg",
];

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <BlurFade
        delay={0.2}
        duration={0.8}
        className="w-1/2 h-1/2 py-10 max-w-3xl max-h-3xl bg-background"
      >
        <img
          src="/assets/logo.jpg"
          alt="logo"
          className="bg-background w-full h-full object-contain rounded-2xl"
        />
      </BlurFade>
      <SparklesText className="mt-20 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
        <span>어서오세요 :)</span>
        <br />
        <span>도자기 공방 DOT입니다.</span>
        <br className="hidden md:block" />
      </SparklesText>
      <TextReveal>
        {`DOT는 
Day Off Today의 약자입니다.
디오티 공간에서 편안히 쉬어가세요`}
      </TextReveal>

      <section id="photos">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-7xl mx-auto">
          {images.map((image, index) => (
            <BlurFade
              key={index}
              delay={0.2 * index}
              duration={0.8}
              className="w-full aspect-square rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={`/assets/${image}`}
                alt={`About Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  );
}
