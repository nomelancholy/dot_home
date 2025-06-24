import { useState } from "react";
import { Button } from "src/common/components/ui/button";
import { Link } from "react-router";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: 회원가입 처리
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 p-8 bg-white dark:bg-black/80 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold text-center">회원가입</h2>
        <input
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
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirm(e.target.value)
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
      </form>
    </div>
  );
}
