import type { Route } from "../../../../types/src/features/auth/pages/+types/terms-page";
import { Card } from "../../../common/components/ui/card";
import { Button } from "../../../common/components/ui/button";

export function loader({ request }: Route.LoaderArgs) {
  return {};
}

export function action({ request }: Route.ActionArgs) {
  return {};
}

export function meta({}: Route.MetaArgs): Route.MetaDescriptors {
  return [
    { title: "회원가입 이용 약관" },
    {
      name: "description",
      content: "배송을 위해 전화번호와 주소 등 개인정보를 수집합니다.",
    },
  ];
}

export function TermsPage({}: Route.ComponentProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="max-w-xl w-full p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">회원가입 이용 약관</h1>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1. 개인정보 수집</h2>
          <p className="text-gray-700">
            원활한 배송을 위해 회원가입 시 전화번호, 주소 등 개인정보를
            수집합니다. 수집된 정보는 배송 목적 외에는 사용되지 않습니다.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            2. 개인정보의 이용 목적
          </h2>
          <p className="text-gray-700">
            수집된 개인정보는 상품 배송, 주문 확인, 고객 문의 응대 등 서비스
            제공을 위해서만 사용됩니다.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            3. 개인정보 보관 및 파기
          </h2>
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
        <div className="flex justify-end">
          <Button asChild>
            <a href="/signup">동의하고 회원가입</a>
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default TermsPage;
