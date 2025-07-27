import { redirect } from "react-router";
import { makeSSRClient } from "@/supa-client";
import type { Route } from "./+types/welcome-page";

// 이메일 발송 기능은 임시로 비활성화
// const client = new Resend(process.env.RESEND_API_KEY);

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const accessToken = url.searchParams.get("access_token");
  const refreshToken = url.searchParams.get("refresh_token");

  const { client: supabase } = makeSSRClient(request);

  // 먼저 기존 세션 확인
  const {
    data: { session: existingSession },
  } = await supabase.auth.getSession();

  // 이미 로그인된 상태라면 홈페이지로 리다이렉트
  if (existingSession) {
    return redirect("/");
  }

  // URL에서 토큰을 받았다면 세션 설정 시도
  if (accessToken && refreshToken) {
    try {
      const { data: sessionData, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionData.session && !error) {
        // 세션이 성공적으로 설정되면 홈페이지로
        // 이메일 발송 기능은 임시로 비활성화
        // if (email) {
        //   try {
        //     const { data, error: emailError } = await client.emails.send({
        //       from: "day off today <master@mail.dayoff.today>",
        //       to: email,
        //       subject: "Welcome to Day Off Today",
        //       react: <WelcomeEmail />,
        //     });
        //   } catch (emailError) {
        //     console.error("Failed to send welcome email:", emailError);
        //   }
        // }

        return redirect("/");
      } else {
        console.error("Failed to set session:", error);
        // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
        return redirect("/auth/login");
      }
    } catch (error) {
      console.error("Error setting session:", error);
      return redirect("/auth/login");
    }
  }

  // URL에서 이메일을 받았지만 토큰이 없는 경우
  // 이메일 발송 기능은 임시로 비활성화
  // if (email) {
  //   try {
  //     const { data, error } = await client.emails.send({
  //       from: "day off today <master@mail.dayoff.today>",
  //       to: email,
  //       subject: "Welcome to Day Off Today",
  //       react: <WelcomeEmail />,
  //     });
  //   } catch (error) {
  //     // console.error("Failed to send welcome email:", error);
  //   }

  //   // 이메일 발송 후 로그인 페이지로 리다이렉트
  //   return redirect("/auth/login");
  // }

  // 세션도 없고 이메일도 없는 경우 로그인 페이지로
  return redirect("/auth/login");
};

export default function WelcomePage({ loaderData }: Route.ComponentProps) {
  // 이 페이지는 리다이렉트만 처리하므로 실제로는 렌더링되지 않습니다
  return null;
}
