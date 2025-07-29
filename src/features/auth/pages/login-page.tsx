import { useState } from "react";
import { Button } from "src/common/components/ui/button";
import { Form, Link, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/login-page";
import { z } from "zod";
import { makeSSRClient } from "@/supa-client";

export const meta: Route.MetaFunction = () => {
  return [{ title: "로그인" }];
};

const fromSchema = z.object({
  email: z
    .string({ required_error: "이메일을 입력해주세요." })
    .email({ message: "이메일 형식이 올바르지 않습니다." }),
  password: z
    .string({ required_error: "비밀번호를 입력해주세요." })
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const { success, data, error } = fromSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return {
      loginError: null,
      formErrors: error.flatten().fieldErrors,
    };
  }

  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    return {
      loginError: loginError.message,
      formErrors: null,
    };
  }

  return redirect("/", {
    headers,
  });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Form
        method="post"
        className="w-full max-w-sm space-y-6 p-8 bg-white dark:bg-black/80 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold text-center">로그인</h2>
        <input
          name="email"
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        {actionData &&
          "formErrors" in actionData &&
          actionData.formErrors &&
          (Array.isArray(actionData.formErrors.email) ? (
            actionData.formErrors.email.map((msg, i) => (
              <p key={i} className="text-red-500 text-sm">
                {msg === "Required" ? "이메일 형식이 올바르지 않습니다." : msg}
              </p>
            ))
          ) : (
            <p>{actionData.formErrors.email}</p>
          ))}
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        {actionData && "formErrors" in actionData && actionData.formErrors && (
          <p className="text-red-500 text-sm">
            {actionData.formErrors.password?.join(", ")}
          </p>
        )}
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>

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
              카카오로 로그인하기
            </Button>
          </Link>

          {/* <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => {
              // 구글 로그인 로직
              console.log("구글 로그인");
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
            Google로 로그인하기
          </Button> */}
        </div>

        {/* <div className="text-center text-sm">
          비밀번호를 잊어버리셨나요?{" "}
          <Link to="/auth/find-password" className="text-primary underline">
            비밀번호 찾기
          </Link>
        </div> */}
        <div className="text-center text-sm">
          계정이 없으신가요?{" "}
          <Link to="/auth/signup-method" className="text-primary underline">
            회원가입
          </Link>
        </div>
      </Form>
    </div>
  );
}
