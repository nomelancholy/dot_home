import { Resend } from "resend";
import { WelcomeEmail } from "react-email-starter/emails/welcome-page";
import { redirect } from "react-router";
import { makeSSRClient } from "@/supa-client";
import type { Route } from "./+types/welcome-page";

const client = new Resend(process.env.RESEND_API_KEY);

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const accessToken = url.searchParams.get("access_token");
  const refreshToken = url.searchParams.get("refresh_token");

  const { client: supabase } = makeSSRClient(request);

  // URL에서 토큰을 받았다면 세션 설정
  if (accessToken && refreshToken) {
    const { data: sessionData, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    console.log("Session set result:", sessionData, error);

    if (sessionData.session) {
      // 세션이 성공적으로 설정되면 환영 이메일 발송 후 홈페이지로
      if (email) {
        const { data, error } = await client.emails.send({
          from: "day off today <master@mail.dayoff.today>",
          to: email,
          subject: "Welcome to Day Off Today",
          react: <WelcomeEmail />,
        });

        console.log("Email sent:", data, error);
      }

      return redirect("/");
    }
  }

  // 기존 세션 확인
  const { data: user } = await supabase.auth.getUser();
  console.log("user :>> ", user);
  console.log("email from URL :>> ", email);

  // URL에서 이메일을 받았지만 토큰이 없는 경우
  if (email) {
    // URL에서 받은 이메일로 환영 이메일 발송
    const { data, error } = await client.emails.send({
      from: "day off today <master@mail.dayoff.today>",
      to: email,
      subject: "Welcome to Day Off Today",
      react: <WelcomeEmail />,
    });

    console.log("data :>> ", data);
    console.log("error :>> ", error);

    // 이메일 발송 후 로그인 상태로 만들기 위해 세션 설정
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData.session) {
      // 세션이 있으면 홈페이지로 리다이렉트 (로그인된 상태)
      return redirect("/");
    } else {
      // 세션이 없으면 로그인 페이지로 리다이렉트
      return redirect("/auth/login");
    }
  }

  // 세션에서 유저 정보를 가져온 경우
  if (user.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("profile_id", user.user.id)
      .single();

    console.log("profile :>> ", profile);

    if (profile?.email) {
      const { data, error } = await client.emails.send({
        from: "day off today <master@mail.dayoff.today>",
        to: profile.email,
        subject: "Welcome to Day Off Today",
        react: <WelcomeEmail />,
      });

      console.log("data :>> ", data);
      console.log("error :>> ", error);
    }

    // 이미 로그인된 상태이므로 홈페이지로 리다이렉트
    return redirect("/");
  }

  // 세션도 없고 이메일도 없는 경우 로그인 페이지로
  return redirect("/auth/login");
};

export default function WelcomePage({ loaderData }: Route.ComponentProps) {
  // 이 페이지는 리다이렉트만 처리하므로 실제로는 렌더링되지 않습니다
  return null;
}
