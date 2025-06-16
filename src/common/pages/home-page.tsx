import { BlurFade } from "@/common/components/ui/blur-fade";

export default function HomePage() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 grid-rows-6 sm:grid-rows-8 md:grid-rows-10 lg:grid-rows-12 gap-2 sm:gap-3 md:gap-4 relative bg-white max-w-[90vw] max-h-[90vh] aspect-square">
          <BlurFade
            delay={0.4}
            duration={0.8}
            className="col-start-1 col-end-5 sm:col-end-6 md:col-end-7 lg:col-end-8 row-start-1 row-end-5 sm:row-end-6 md:row-end-7 lg:row-end-8 z-20 object-cover w-full h-full rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src="/assets/thumbnail_01.jpg"
              alt="Random Image"
              className="w-full h-full object-cover"
            />
          </BlurFade>
          <BlurFade
            delay={0.7}
            duration={1}
            className="col-start-4 sm:col-start-5 md:col-start-6 lg:col-start-7 col-end-7 sm:col-end-9 md:col-end-11 lg:col-end-13 row-start-4 sm:row-start-5 md:row-start-6 lg:row-start-7 row-end-7 sm:row-end-9 md:row-end-11 lg:row-end-13 z-10 object-cover w-full h-full rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src="assets/thumbnail_02.jpg"
              alt="Random Image"
              className="w-full h-full object-cover"
            />
          </BlurFade>
          <BlurFade
            delay={0.9}
            duration={1.2}
            className="col-start-4 sm:col-start-5 md:col-start-6 lg:col-start-6 col-end-7 sm:col-end-9 md:col-end-11 lg:col-end-13 row-start-1 sm:row-start-2 md:row-start-2 lg:row-start-2 row-end-4 sm:row-end-5 md:row-end-6 lg:row-end-7 flex items-center justify-center z-30"
          >
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
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
