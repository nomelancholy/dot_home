import { BlurFade } from "@/common/components/ui/blur-fade";

export default function HomePage() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-12 grid-rows-12 gap-4 relative bg-white">
          <BlurFade
            delay={0.4}
            duration={0.8}
            className="col-start-1 col-end-8 row-start-1 row-end-8 z-20 object-cover w-full h-full rounded-lg shadow-lg"
          >
            <img src="/assets/thumbnail_01.jpg" alt="Random Image" />
          </BlurFade>
          <BlurFade
            delay={0.7}
            duration={1}
            className="col-start-7 col-end-13 row-start-7 row-end-13 z-10 object-cover w-full h-full rounded-lg shadow-lg"
          >
            <img src="assets/thumbnail_02.jpg" alt="Random Image" />
          </BlurFade>
          <BlurFade
            delay={0.9}
            duration={1.2}
            className="col-start-6 col-end-13 row-start-2 row-end-7 flex items-center justify-center z-30"
          >
            <span className="text-5xl font-extrabold leading-tight">
              Dot
              <br />
              ceramic
              <br />
              studio
            </span>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
