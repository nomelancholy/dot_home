import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  pixelBasedPreset,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type * as React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const WelcomeEmail = () => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Preview>D.O.T. 에 오신 걸 환영해요!</Preview>
        <Body className="bg-offwhite font-sans text-base">
          <Container className="text-center">
            <Img
              src={`${baseUrl}/static/logo.jpg`}
              width="400"
              height="260"
              alt="D.O.T. Logo"
              className="mx-auto my-20"
            />
          </Container>
          <Container className="bg-white p-45 text-center">
            <Heading className="my-0 text-center leading-8">
              안녕하세요 <br />
              <span className="text-brand">D.O.T.</span>에 오신 걸 환영합니다:)
            </Heading>

            <Section className="text-center">
              <Row>
                <Column>
                  <Text className="text-base text-center">안녕하세요,</Text>
                  <Text className="text-base text-center">
                    디오티는 도자기 제품과 원데이 클래스를 통해 여러분의 바쁜
                    일상 속에서 ‘잠깐의 휴식’을 만들어 드리고자 하는 마음에서
                    시작된 공간입니다.
                  </Text>
                  <Text className="text-base text-center">
                    도자기를 마주하는 순간 흙의 촉감과 만들어지는 과정을
                    떠올리며 마음이 천천히 가라앉는 걸 느낄 수 있습니다. 휴식이
                    필요한 일상의 ‘나’에게 온전히 집중하는 시간을 가져보는건
                    어떨까요?
                  </Text>
                  <Text className="text-base text-center">
                    오늘 당신의 Day Off를 책임지겠습니다 천천히 둘러보시고,
                    마음이 가는 곳에 머물러보세요.
                  </Text>
                  <Text className="text-base text-center">감사합니다 🙂</Text>
                </Column>
              </Row>
            </Section>
            <Section className="text-center">
              <div className="flex flex-col gap-4 items-center">
                <Button
                  href="https://dayoff.today/shop"
                  className="rounded-lg bg-brand px-[18px] py-3 text-white text-center"
                >
                  👆 도자기 보러가기
                </Button>
                <Button
                  href="https://dayoff.today/class/one-day"
                  className="rounded-lg bg-brand px-[18px] py-3 text-white text-center"
                >
                  👆 OneDayClass 신청하기
                </Button>
              </div>
            </Section>
          </Container>
          <Container className="mt-20 text-center">
            <Text className=" text-center text-gray-400">D.O.T.</Text>
            <Text className="mb-45 text-center text-gray-400">
              당신의 오늘을 쉬어가는 공간
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
