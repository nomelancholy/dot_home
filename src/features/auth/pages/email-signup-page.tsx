import { useState } from "react";
import { Button } from "src/common/components/ui/button";
import { Form, Link, redirect, useNavigation } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/email-signup-page";
import { makeSSRClient } from "@/supa-client";
import { checkEmailExists, checkUsernameExists } from "../queries";

export const formSchema = z
  .object({
    username: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다.").trim(),
    email: z.string().email("이메일 형식이 올바르지 않습니다."),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
        "영문, 숫자, 특수문자를 모두 포함해야 합니다."
      )
      .refine(
        (val) =>
          !["12345678", "password", "qwerty", "11111111", "00000000"].includes(
            val.toLowerCase()
          ),
        { message: "너무 쉬운 비밀번호는 사용할 수 없습니다." }
      ),
    confirm: z.string().min(8, "비밀번호가 일치하지 않습니다."),
  })
  .refine((data) => data.password === data.confirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirm"],
  });

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const raw = Object.fromEntries(formData);

  const { success, data, error } = formSchema.safeParse(raw);

  if (!success) {
    return {
      signupError: null,
      formErrors: error.flatten().fieldErrors,
    };
  }

  const { email, password, username } = data;
  const trimmedUsername = username.trim();

  const usernameExists = await checkUsernameExists(trimmedUsername);

  if (usernameExists) {
    return {
      signupError: "이미 존재하는 닉네임입니다.",
      formErrors: { username: ["이미 존재하는 닉네임입니다."] },
    };
  }

  const emailExists = await checkEmailExists(email);

  if (emailExists) {
    return {
      signupError: "이미 존재하는 이메일입니다.",
      formErrors: { email: ["이미 존재하는 이메일입니다."] },
    };
  }

  const { client, headers } = makeSSRClient(request);
  const { data: signupData, error: signupError } = await client.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: trimmedUsername,
      },
    },
  });

  if (!signupData.user) {
    return {
      signupError: "회원가입에 실패했습니다.",
      formErrors: null,
    };
  }

  return redirect("/", { headers });
};

export default function EmailSignupPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // Required field validation
  const isFormValid =
    email && password && confirm && username && !passwordError;

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Form
        method="post"
        className="w-full max-w-sm space-y-6 p-8 bg-white dark:bg-black/80 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold text-center">이메일로 회원가입</h2>

        {/* 전체 회원가입 에러 표시 */}
        {actionData?.signupError && (
          <div className="text-red-500 text-sm text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            {actionData.signupError}
          </div>
        )}

        {/* 이메일 입력 필드 */}
        <div className="space-y-1">
          <input
            name="email"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              actionData?.formErrors?.email ? "border-red-500" : ""
            }`}
          />
          {actionData?.formErrors?.email && (
            <div className="text-red-500 text-xs">
              {actionData.formErrors.email[0]}
            </div>
          )}
        </div>

        {/* 비밀번호 입력 필드 */}
        <div className="space-y-1">
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              actionData?.formErrors && "password" in actionData.formErrors
                ? "border-red-500"
                : ""
            }`}
          />
          <div className="text-xs text-gray-500">
            영문/숫자/특수문자를 포함하여 8자 이상이어야 합니다
          </div>
          {actionData?.formErrors &&
            "password" in actionData.formErrors &&
            actionData.formErrors.password && (
              <div className="text-red-500 text-xs">
                {actionData.formErrors.password[0]}
              </div>
            )}
          {/* 프론트엔드에서 규칙 위반 에러가 있다면 표시 (불일치 메시지는 제외) */}
          {passwordError &&
            passwordError !== "비밀번호가 일치하지 않습니다." && (
              <div className="text-red-500 text-xs">{passwordError}</div>
            )}
        </div>

        {/* 비밀번호 확인 입력 필드 */}
        <div className="space-y-1">
          <input
            name="confirm"
            type="password"
            placeholder="비밀번호 확인"
            value={confirm}
            onChange={(e) => handleConfirmChange(e.target.value)}
            required
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              actionData?.formErrors && "confirm" in actionData.formErrors
                ? "border-red-500"
                : ""
            }`}
          />
          {actionData?.formErrors &&
            "confirm" in actionData.formErrors &&
            actionData.formErrors.confirm && (
              <div className="text-red-500 text-xs">
                {actionData.formErrors.confirm[0]}
              </div>
            )}
          {/* 비밀번호 불일치 에러 표시 */}
          {passwordError === "비밀번호가 일치하지 않습니다." && (
            <div className="text-red-500 text-xs">{passwordError}</div>
          )}
        </div>

        {/* 닉네임 입력 필드 */}
        <div className="space-y-1">
          <input
            name="username"
            type="text"
            placeholder="닉네임"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              actionData?.formErrors?.username ? "border-red-500" : ""
            }`}
          />
          {actionData?.formErrors?.username && (
            <div className="text-red-500 text-xs">
              {actionData.formErrors.username[0]}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "회원가입 중..." : "회원가입"}
        </Button>

        <div className="text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <Link to="/auth/login" className="text-primary underline">
            로그인
          </Link>
        </div>
      </Form>
    </div>
  );
}
