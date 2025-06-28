import { useState } from "react";
import { Button } from "src/common/components/ui/button";
import { Form, Link, redirect, useNavigation } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/signup-page";
import { maskeSSRClient } from "@/supa-client";

const formSchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return {
      signupError: null,
      formErrors: error.flatten().fieldErrors,
    };
  }

  const { client, headers } = maskeSSRClient(request);
  const { error: signupError } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        username: data.username,
      },
    },
  });

  if (signupError) {
    return {
      signupError: signupError.message,
      formErrors: null,
    };
  }

  return redirect("/", {
    headers,
  });
};

export default function SignupPage({ actionData }: Route.ComponentProps) {
  console.log("SignupPage actionData :>> ", actionData);
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Form
        method="post"
        className="w-full max-w-sm space-y-6 p-8 bg-white dark:bg-black/80 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold text-center">회원가입</h2>
        <input
          name="name"
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        <input
          name="username"
          type="text"
          placeholder="닉네임"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
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

        <Button type="submit" className="w-full">
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
