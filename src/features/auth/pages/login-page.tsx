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
  console.log("formData :>> ", formData);

  const { success, data, error } = fromSchema.safeParse(
    Object.fromEntries(formData)
  );

  console.log("success :>> ", success);
  console.log("data :>> ", data);
  console.log("error :>> ", error);

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
  console.log("LoginPage actionData :>> ", actionData);
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

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
        <div className="text-center text-sm">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-primary underline">
            회원가입
          </Link>
        </div>
      </Form>
    </div>
  );
}
