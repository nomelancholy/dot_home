import { useState, useRef } from "react";
import { Button } from "src/common/components/ui/button";
import { Form, Link, redirect, useNavigation } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/signup-page";
import { makeSSRClient } from "@/supa-client";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { createAddress, createProfile } from "../mutations";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/common/components/ui/popover";

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

export const formSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirm: z.string().min(8),
    phone: z.string().regex(/^\d{3}-\d{3,4}-\d{4}$/),
    zipCode: z.string().min(1),
    address1: z.string().min(1),
    address2: z.string().min(1),
    emailConsent: z.boolean(),
    phoneConsent: z.boolean(),
    agreeTerms: z.boolean(),
    agreePrivacy: z.boolean(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirm"],
  });

export const action = async ({ request }: Route.ActionArgs) => {
  console.log("request :>> ", request);

  const formData = await request.formData();
  console.log("formData :>> ", formData);

  const raw = Object.fromEntries(formData);

  // 체크박스 값 변환
  const toBool = (v: string | undefined) => v === "on";
  const parsed = {
    ...raw,
    emailConsent: toBool(raw.emailConsent as string | undefined),
    phoneConsent: toBool(raw.phoneConsent as string | undefined),
    agreeTerms: toBool(raw.agreeTerms as string | undefined),
    agreePrivacy: toBool(raw.agreePrivacy as string | undefined),
  };

  const { success, data, error } = formSchema.safeParse(parsed);

  console.log("success :>> ", success);
  console.log("data :>> ", data);
  console.log("error :>> ", error);

  if (!success) {
    return {
      signupError: null,
      formErrors: error.flatten().fieldErrors,
    };
  }

  const {
    email,
    password,
    name,
    phone,
    zipCode,
    address1,
    address2,
    emailConsent,
    phoneConsent,
    agreeTerms,
    agreePrivacy,
  } = data;

  const { client, headers } = makeSSRClient(request);
  const { data: signupData, error: signupError } = await client.auth.signUp({
    email: email,
    password: password,
  });

  if (!signupData.user) {
    return {
      signupError: "회원가입에 실패했습니다.",
      formErrors: null,
    };
  }

  console.log("client :>> ", client);
  console.log("signupData :>> ", signupData);

  console.log("signupError :>> ", signupError);
  await createProfile(client, {
    profile_id: signupData.user.id as string,
    name: name,
    phone: phone,
    email: email,
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

  // 3. 유저 생성 실패 시 롤백
  // 만약 profile/address insert에서 에러가 발생하면, 이미 생성된 유저를 삭제해야 합니다.
  // Supabase에서는 auth.admin.deleteUser(userId)로 유저 삭제가 가능합니다.
  // (이 기능은 서비스 역할 키가 필요합니다.)

  return redirect("/", {
    headers,
  });
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export default function SignupPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const open = useDaumPostcodePopup();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [phoneConsent, setPhoneConsent] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const address2Ref = useRef<HTMLInputElement>(null);
  const [addressPopupOpen, setAddressPopupOpen] = useState(false);

  // Required field validation
  const isFormValid =
    email &&
    password &&
    confirm &&
    name &&
    phone &&
    zipCode &&
    address1 &&
    address2 &&
    agreeTerms &&
    agreePrivacy &&
    !passwordError;

  const handleComplete = (data: any) => {
    setZipCode(data.zonecode);
    setAddress1(data.address);
    setAddressPopupOpen(false);
    setTimeout(() => {
      address2Ref.current?.focus();
    }, 0);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (confirm && val !== confirm)
      setPasswordError("비밀번호가 일치하지 않습니다.");
    else setPasswordError("");
  };
  const handleConfirmChange = (val: string) => {
    setConfirm(val);
    if (password && val !== password)
      setPasswordError("비밀번호가 일치하지 않습니다.");
    else setPasswordError("");
  };
  const handlePhoneChange = (val: string) => {
    const formatted = formatPhone(val);
    setPhone(formatted);
  };
  // Address popup open for all address fields, prevent multiple opens
  const openAddressPopup = () => {
    if (addressPopupOpen) return;
    setAddressPopupOpen(true);
    open({ onComplete: handleComplete });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Form
        method="post"
        className="w-full max-w-sm space-y-6 p-8 bg-white dark:bg-black/80 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold text-center">회원가입</h2>
        <input
          name="email"
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        <input
          name="confirm"
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={(e) => handleConfirmChange(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        {passwordError && (
          <div className="text-red-500 text-xs">{passwordError}</div>
        )}
        <input
          name="name"
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        <input
          name="phone"
          type="tel"
          placeholder="전화번호"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          required
          inputMode="numeric"
          // pattern="[0-9]*"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        {/* 주소 입력 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">주소</label>
          <div className="flex gap-2">
            <input
              name="zipCode"
              type="text"
              placeholder="우편번호"
              value={zipCode}
              onClick={openAddressPopup}
              onFocus={openAddressPopup}
              readOnly
              required
              className="w-1/2 px-3 py-2 border rounded focus:outline-none focus:ring cursor-pointer"
            />
            <Button
              type="button"
              onClick={openAddressPopup}
              onFocus={openAddressPopup}
              className="w-1/2"
            >
              주소 검색
            </Button>
          </div>
          <input
            name="address1"
            type="text"
            placeholder="기본주소"
            value={address1}
            onClick={openAddressPopup}
            onFocus={openAddressPopup}
            readOnly
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring cursor-pointer"
          />
          <input
            name="address2"
            type="text"
            placeholder="상세주소"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            required
            ref={address2Ref}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="emailConsent"
            name="emailConsent"
            type="checkbox"
            checked={emailConsent}
            onChange={(e) => setEmailConsent(e.target.checked)}
          />
          <label htmlFor="emailConsent" className="text-sm">
            이메일 수신 동의
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="phoneConsent"
            name="phoneConsent"
            type="checkbox"
            checked={phoneConsent}
            onChange={(e) => setPhoneConsent(e.target.checked)}
          />
          <label htmlFor="phoneConsent" className="text-sm">
            전화번호 수신 동의
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="agreeTerms"
            name="agreeTerms"
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
            name="agreePrivacy"
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
        <Button type="submit" className="w-full" disabled={!isFormValid}>
          회원가입
        </Button>
        <div className="text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-primary underline">
            로그인
          </Link>
        </div>
      </Form>
    </div>
  );
}
