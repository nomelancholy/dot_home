import { useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/common/components/ui/carousel";
import { Marquee } from "@/common/components/ui/marquee";
import { cn } from "@/lib/utils";
import type { Route } from "./+types/class-one-day-page";
import { BentoGrid, BentoCard } from "@/common/components/ui/bento-grid";
import { supabaseAdmin } from "@/supa-client";
import { Skeleton } from "@/common/components/ui/skeleton";

export const meta: Route.MetaFunction = () => {
  return [{ title: "DOT | Class" }];
};

const reviews = [
  {
    username: "클린샌드위치공장3",
    body: `손재주가 없어 생각보다 오래 걸렸는데 친절하게 설명해주시고 안 되는 부분도 잘 진행될 수 있게 도와주셔서 감사했어요. 넘 재미있었어요! 결과물 한 달 후에 나온다고 하는데 넘 기다려져요. 감사합니다^^`,
  },
  {
    username: "초록톡수리3",
    body: `평소에 도자기 배워보고 싶다는 생각만 하고 있었는데 이렇게 경험 해보게 되어 좋았습니다🥰 선생님이 정말 친절하시고, 하나하나 자세하게 알려주셔서 재미있게 만들 수 있었습니다! 원하는 디자인이 무엇인지 물어봐주시고 그대로 만들 수 있게 도와주셔서 만족스러운 결과물을 얻을 수 있었던 것 같습니다😆 얼른 한달이 지나가서 받아보고 싶네요❣️`,
  },
  {
    username: "찜찜박사",
    body: "작가님이 너무 친절하시고 재밌는 시간이었어요❤️ 색소지 수업 듣고 싶었는데 색 제한도 없고 자유롭게 만들 수 있게 도와주셔서 너무너무 좋았어요! 수업시간 두시간동안 마블 하나 색소지작품 하나 만드는 수업인데 개인적으로 색소지가 너무너무 재미있어서 색소지만 이루어진 수업 있었음 좋겠다고 생각했어요! 공부도 이야기가하고 귀엽고 작가님의 설명도 자세하고 친절하시구 많이 도와주셔서 완성도 높은 물건을 얻는다는 생각이 들었어요.",
  },
  {
    username: "찜찜박사",
    body: "일정 맞춰서 한달뒤에 도자기 도나 부닥 드렸는데 흔쾌히 조정해주셔서 너무 감사드리고, 친구랑 계절마다 만들러 가기로 했어요! 너무 즐거운 시간이었어서 다음에 또 뵐게요! 오늘 만든 도자기들도 기대되고 다음 만든 도자기들도 지금 벌써 그림 그리고 있어요. 늘 귀여운 인사도❤️ Day off today라는 이름 만큼 오늘은 일상과 다르게 색다른 즐거운 시간 보냈고, 작가님께 인스타에 만드는 모습 사진 찍어서 스토리로 올려주셔서 그것도 넘 귀여워서 캡쳐했어요💛 감사합니다! 또 뵈요.😋",
  },
  {
    username: "대머리탈옥수",
    body: `일단 소규모로 진행되고 작가님께서 한명한명 신경써서 지도 해주셨습니다. 특히 못했다고 나무라지 않으시고 계속 작업을 이어나갈 수 있게 도와주셨어요. 새로운 경험을 하는 입장에서 처음은 언제나 어려운 법이지만 이작가님께 배우는 거라면 좀 더 즐거울거예요`,
  },
  {
    username: "비싼설탕과자1",
    body: `선생님 너무 친절하시고 조용하고 예쁜 공간이었어요~ 가는길은 힙합이고 들어가면 클래식 느낌 ㅋㅋㅋ 따뜻하고 편안한 분위기가 느껴집니다~ 덕분에 힐링하고 갑니다~~ 결과물도 예쁘게 나올길 :)`,
  },
  {
    username: "쵸쵸쿠키",
    body: `만들면서 다른 생각이 안들고 작업에만 집중할 수 있어 정말 좋은 경험이었어요ㅎㅎㅎ 미리 만들고 싶은걸 생각해왔는데 그대로 만들어진거 같아 넘 만족합니다😊😉 어려운건 선생님께서 차근차근 알려주셔서 넘 재미게 듣고 왔습니다!! 다음에 친구들이랑 또 갈게요!!🙌`,
  },
  {
    username: "작은수영용오리발",
    body: `예전부터 친구랑 만들고 싶어서 알아보다 갔는데 자유롭게 만들고 싶은거 만들 수 있어서 좋았습니다! 선생님도 너무 친절하고 꼼꼼하게 생각하고 간거 만들 수 있게 도와주시고 알려주셔서 너무 좋았어요!! 다음에 또 갈거같아요 추천합니다 :)`,
  },
  {
    username: "빵쪼아인간",
    body: `친절하신 사장님 쾌적한 공간 맛있는 음료 💖 덕분에 두 시간이라는 시간이 훌쩍 지나갈 정도로 재미있는 시간 보냈고 왔어요 🥰 친구랑 둘 다 흙을 처음 만지는 데 원하는 모양 만들 수 있게 친절하게 알려 주셔서 쉽게 만들 수 있었어요! 흙이 생각보다 다루기 쉽진 않았는데 힘들어하는 부분은 사장님께서 똑똑 해결해 주셨어요 ㅋㅋㅋ 🥹 사장님께서 만들어서 판매하시는 컵도 너무 예뻐서 하나 골라서 구매했어요 ㅎㅎ 완성까지 한 달 정도 걸린다고 하셨는데 너무 기대됩니다 🙌`,
  },
  {
    username: "서툰연탄한판구이5",
    body: `북촌에서 데이트하기전에 방문하고온 찐 후기입니다! 일단 저는 여자친구랑 둘이서 방문했는데, 조금 시간이 늦었음에도 선생님이 너무 친절하셔서 정말 너무나도 죄송했습니다.. 공방체험이 처음이라서 서툴러도 하나하나 설명 해주시고 잘 안되는 부분은 옆에서 계속 봐주시면서 직접 수정까지 해주셔서 2시간 체험시간이 어떻게 가는지도 모르고 하고 온 것 같아요 ㅎㅎ`,
  },
  {
    username: "서툰연탄한판구이5",
    body: `남자친구나 여자친구와 데이트 하실거면 서둘러 예약하시고 방문해보세요! 한사람씩 이쁘게 설명해주시고 나만의예쁜 작품 만들면서 자세한 설명 덕분에 개인적으로는 만족스러운 결과물 이 나온거 같습니다! 색입혀서 한 달 뒤에 완성품이 나온는데 벌써부터 결과물이 너무 기다려집니다 😋 커플분들은 꼭 한번 방문해보세요 ㅎㅎ 추억만들기에는 여기만한곳이 없는거같습니다 매우강추드려요 ㅎㅎ`,
  },
  {
    username: "박드보레",
    body: `너무 좋았던 기억에 이번에는 다른 친구와 함께 방문했습니다. 역시나 대 만족... 구상했던 그릇 그 이상으로 만들어져서 만족 또 만족.. 미리 스케치해서 방문하시면 사장님께서 길을 안내해 주십니다... 길을 따라 걷다 보니 상상으로만 존재했던 내 그릇이 눈 앞에 !!`,
  },
  {
    username: "haennana",
    body: `지난번에 원데이 클래스 듣고 정말 만족해서 한 번 더 방문했습니다! 크리스마스 맞이 머그컵과 접시를 만들고 싶었어요!! 원하는 느낌대로 컵이랑 접시를 만들 수 있어서 정말 좋았습니다. 무엇보다 크리스마스 리스+산타토끼 조합의 접시가 너무너무 만족스러워요!!!! 얼른 완성된 작품을 받고싶어요.🙏`,
  },
  {
    username: "찜찜박사",
    body: `저번에 수업 듣고 대!만!족!!해서 친구랑 둘 다 다음에 가면 뭐 할까 얘기하면서 도자기 나오는 날쯤에 맞춰서 또 예약하고 싶어요! 작가님도 조용조용하고 귀여운 목소리로 친절하시구 색소지 색도 마음껏 쓸 수 있어서 너무 좋아요! 이번엔 제가 좀 디테일에 욕심 부려서 느렸던 것 같은데 작가님이 거의 다 해다고 해주시고 흑흑 ㅎㅎ 오늘도 너무너무 재미있었어요!`,
  },
  {
    username: "찜찜박사",
    body: `그래도 저번에 한번 해봤다고 이번에 만든 게 조금 더 완성도가 높아진 것 같다고... 스스로 생각하고 있어요. 지난번 수업에서 만든 것도 만족스럽게 잘 나왔고 또 갈게요 이번엔 좀 더, 쉽고 빠른 디자인으로 생각해가겠습니다!! 오늘도 너무 감사했어요😋❣️`,
  },
  {
    username: "박상묵",
    body: `시간이 오래걸린만큼 진심이었는데, 작가님이 친절하게 설명해주셔서 아주 만족스러운 결과물을 얻었어요!! 색깔도 많고 자유도도 높아서 아주아주 좋았어요! 두번째 클래스였는데, 두번다 여자친구랑 아주 재미있는 추억 만들었어요! 감사합니다.`,
  },
];

const ReviewCard = ({ username, body }: { username: string; body: string }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-lg bg-background" />
      )}
      <img
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export const loader = async ({}: Route.LoaderArgs) => {
  const { data: sampleImages } = await supabaseAdmin.storage
    .from("assets")
    .list("class");

  // prefix별로 분류
  const color: string[] = [];
  const free: string[] = [];
  const potteryWheel: string[] = [];

  sampleImages?.forEach((img) => {
    const { data: urlData } = supabaseAdmin.storage
      .from("assets")
      .getPublicUrl(`class/${img.name}`);
    if (img.name.startsWith("color_")) color.push(urlData.publicUrl);
    else if (img.name.startsWith("free_")) free.push(urlData.publicUrl);
    else if (img.name.startsWith("pottery_wheel_"))
      potteryWheel.push(urlData.publicUrl);
  });

  // 랜덤 섞기 함수
  function shuffle<T>(arr: T[]): T[] {
    return arr
      .map((v) => [Math.random(), v] as [number, T])
      .sort((a, b) => a[0] - b[0])
      .map(([, v]) => v);
  }

  // 비율에 맞게 랜덤 추출
  const colorSample = shuffle(color).slice(0, 4);
  const freeSample = shuffle(free).slice(0, 3);
  const potterySample = shuffle(potteryWheel).slice(0, 3);

  // 합치고 다시 랜덤 섞기(순서 다양화)
  const carouselImages = shuffle([
    ...colorSample,
    ...freeSample,
    ...potterySample,
  ]);

  const { data: thumbnailImages } = await supabaseAdmin.storage
    .from("assets")
    .list("class/thumbnail");

  // 기존 썸네일 반환도 유지
  const thumbnails: Record<string, string> = {};
  thumbnailImages?.forEach((img) => {
    const { data: urlData } = supabaseAdmin.storage
      .from("assets")
      .getPublicUrl(`class/thumbnail/${img.name}`);
    if (img.name.includes("color")) thumbnails.color = urlData.publicUrl;
    else if (img.name.includes("free")) thumbnails.free = urlData.publicUrl;
    else if (img.name.includes("pottery_wheel"))
      thumbnails.potteryWheel = urlData.publicUrl;
  });

  return {
    thumbnails,
    carouselImages,
  };
};

export default function ClassOneDayPage({ loaderData }: Route.ComponentProps) {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const thumbnails = loaderData.thumbnails ?? {};

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden ">
        <div className="w-full max-w-6xl my-12">
          <BentoGrid>
            <BentoCard
              className="row-span-2"
              name="디오티 물레 클래스(90분)"
              background={
                <img
                  src={thumbnails.potteryWheel}
                  alt="pottery_wheel_thumbnail"
                  className="absolute inset-0"
                />
              }
              description="도자공예과 출신 선생님의 전문적인 수업으로 만족스러운 결과물을 만들 수 있도록 도와드립니다."
              href="https://m.booking.naver.com/booking/6/bizes/1177496/items/6731133?area=ple&lang=ko&tab=book&theme=place"
              cta="예약하러가기"
            ></BentoCard>
            <BentoCard
              className=""
              name="컬러 클레이 클래스 (90-120분)"
              background={
                <img
                  src={thumbnails.color}
                  alt="color_class_thumbnail"
                  className="absolute inset-0"
                />
              }
              description="연리문이라는 전통 기법을 사용해 알록달록한 색소지(흙)으로 자신만의 그릇을 만드는 수업입니다."
              href="https://m.booking.naver.com/booking/6/bizes/1177496/items/6581778?area=bmp&lang=ko&service-target=map-pc&tab=book&theme=place"
              cta="예약하러가기"
            ></BentoCard>
            <BentoCard
              className=""
              name="자유 원데이 클래스 (120분)"
              background={
                <img
                  src={thumbnails.free}
                  alt="free_class_thumbnail"
                  className="absolute inset-0"
                />
              }
              description="백자토(흙)를 가지고 각자 원하시는 모양의 도자기를 만드는 수업입니다."
              href="https://m.booking.naver.com/booking/6/bizes/1177496/items/5955427?area=ple&lang=ko&tab=book&theme=place"
              cta="예약하러가기"
            ></BentoCard>
          </BentoGrid>
        </div>

        <Marquee pauseOnHover className="mt-8 [--duration:40s]">
          {reviews.map((review, index) => (
            <ReviewCard key={review.username + index} {...review} />
          ))}
        </Marquee>
        <div className="w-full flex flex-col items-center mt-16 mb-4">
          <h2 className="text-2xl font-bold text-center mb-2">
            실제 수강생 체험 모습 및 완성 작품
          </h2>
        </div>

        <Carousel
          className="w-full max-w-6xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
          plugins={[plugin.current]}
          opts={{ loop: true }}
        >
          <CarouselContent>
            {loaderData.carouselImages.map((img, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 md:basis-1/3 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
              >
                <ImageWithSkeleton src={img} alt={`class_image_${index + 1}`} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
        <div className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background"></div>
        <div className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background"></div>
      </div>
    </div>
  );
}
