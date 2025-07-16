import { redirect } from "react-router";
import { makeSSRClient } from "@/supa-client";
import { createAddress, createProfile } from "../mutations";
import type { Route } from "./+types/generate-test-user";

function getTodayString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

export const meta: Route.MetaFunction = () => {
  return [{ title: "Generate Test User" }];
};

export async function action({ request }: Route.ActionArgs) {
  // Check for X-GEN-TESTER header
  const headerValue = request.headers.get("X-GEN-TESTER");
  if (headerValue !== "GENERATE-A-TEST-USER-REQEUST") {
    return {
      signupError: "Forbidden: Invalid or missing X-GEN-TESTER header.",
      formErrors: null,
      status: 403,
    };
  }

  const today = getTodayString();
  const name = `Tester ${today}`;
  const email = `testuser${today}@google.com`;
  const password = "abcd1234!";
  const phone = "010-1234-5678";
  const zipCode = "03048";
  const address1 = "서울특별시 종로구 청와대로 1";
  const address2 = "청와대";
  const emailConsent = Math.random() < 0.5;
  const phoneConsent = Math.random() < 0.5;
  const agreeTerms = true;
  const agreePrivacy = true;

  const { client, headers } = makeSSRClient(request);
  const { data: signupData, error: signupError } = await client.auth.signUp({
    email,
    password,
  });

  if (!signupData.user) {
    return {
      signupError: "회원가입에 실패했습니다.",
      formErrors: null,
    };
  }

  await createProfile(client, {
    profile_id: signupData.user.id as string,
    name,
    phone,
    email,
    email_consent: emailConsent,
    phone_consent: phoneConsent,
    agree_terms: agreeTerms,
    agree_privacy: agreePrivacy,
  });
  if (signupError) {
    return {
      signupError: signupError.message,
      formErrors: null,
    };
  }

  await createAddress(client, {
    profile_id: signupData.user.id as string,
    address_name: "기본 주소",
    address: address1 + " " + address2,
    zipcode: zipCode,
  });

  // 3. 유저 생성 실패 시 롤백 (필요시 구현)
  // Supabase에서는 auth.admin.deleteUser(userId)로 유저 삭제가 가능합니다.
  // (이 기능은 서비스 역할 키가 필요합니다.)

  return redirect("/", {
    headers,
  });
}

export default function GenerateTestUserPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        method="post"
        className="w-full max-w-sm space-y-6 p-8 bg-white dark:bg-black/80 rounded-lg shadow text-center"
      >
        <h2 className="text-2xl font-bold">테스트 유저 생성</h2>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded"
        >
          테스트 유저 생성
        </button>
      </form>
    </div>
  );
}
