import { useState } from "react";
import { Button } from "src/common/components/ui/button";
import { Link, useNavigation } from "react-router";
import type { Route } from "./+types/signup-method-page";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/common/components/ui/popover";

export const meta: Route.MetaFunction = () => {
  return [{ title: "회원가입 방법 선택" }];
};

// 개인정보 수집 약관 컴포넌트
function PrivacyPolicy() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">개인정보 수집 및 이용 동의</h1>
      <p className="mb-2">
        본 사이트는 회원가입, 서비스 제공, 문의 응대 등을 위해 아래와 같이
        개인정보를 수집 및 이용합니다.
      </p>
      <ul className="list-disc pl-6 mb-2">
        <li>수집 항목: 이름, 이메일, 전화번호, 주소 등</li>
        <li>수집 목적: 회원 식별, 서비스 제공, 고지사항 전달 등</li>
        <li>
          보유 및 이용 기간: 회원 탈퇴 시까지 (관련 법령에 따라 보관 필요 시
          해당 기간까지)
        </li>
      </ul>
      <p>
        이용자는 개인정보 수집 및 이용에 동의하지 않을 권리가 있으나, 동의 거부
        시 회원가입이 제한될 수 있습니다.
      </p>
    </div>
  );
}

// 이용 약관 컴포넌트
function TermsPolicy() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">회원가입 이용 약관</h1>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. 개인정보 수집</h2>
        <p className="text-gray-700">
          원활한 배송을 위해 회원가입 시 전화번호, 주소 등 개인정보를
          수집합니다. 수집된 정보는 배송 목적 외에는 사용되지 않습니다.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">2. 개인정보의 이용 목적</h2>
        <p className="text-gray-700">
          수집된 개인정보는 상품 배송, 주문 확인, 고객 문의 응대 등 서비스
          제공을 위해서만 사용됩니다.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">3. 개인정보 보관 및 파기</h2>
        <p className="text-gray-700">
          회원 탈퇴 시 또는 관련 법령에 따라 개인정보는 안전하게 파기됩니다.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">4. 동의 거부 권리</h2>
        <p className="text-gray-700">
          회원은 개인정보 제공에 동의하지 않을 권리가 있으나, 이 경우 서비스
          이용이 제한될 수 있습니다.
        </p>
      </section>
    </div>
  );
}

export default function SignupMethodPage() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const isFormValid = agreeTerms && agreePrivacy;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-8 bg-white dark:bg-black/80 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">회원 가입</h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
            />
            <label htmlFor="agreeTerms" className="text-sm">
              <a
                href="#"
                className="underline text-primary"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  setTermsOpen(true);
                }}
              >
                이용 약관
              </a>
              에 동의합니다.
            </label>
            <Popover open={termsOpen} onOpenChange={setTermsOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  이용 약관 보기
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-w-xl w-full">
                <TermsPolicy />
                <div className="flex justify-end mt-4">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setTermsOpen(false)}
                  >
                    닫기
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="agreePrivacy"
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              required
            />
            <label htmlFor="agreePrivacy" className="text-sm">
              <a
                href="#"
                className="underline text-primary"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  setPrivacyOpen(true);
                }}
              >
                개인정보 수집
              </a>
              에 동의합니다.
            </label>
            <Popover open={privacyOpen} onOpenChange={setPrivacyOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  개인정보 수집 약관 보기
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-w-xl w-full">
                <PrivacyPolicy />
                <div className="flex justify-end mt-4">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setPrivacyOpen(false)}
                  >
                    닫기
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/auth/signup"
            className={`block w-full text-center py-2 px-4 rounded ${
              isFormValid
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={(e) => {
              if (!isFormValid) {
                e.preventDefault();
              }
            }}
          >
            이메일로 회원가입
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-black/80 px-2 text-muted-foreground">
                또는
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/auth/social/kakao/start">
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"
                  />
                </svg>
                카카오로 회원가입
              </Button>
            </Link>

            {/* <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => {
                // 구글 회원가입 로직
                console.log("구글 회원가입");
              }}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 회원가입
            </Button> */}
          </div>

          <div className="text-center text-sm">
            <Link to="/auth/login" className="text-primary underline">
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
