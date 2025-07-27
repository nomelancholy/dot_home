import { useTranslation } from "react-i18next";

export default function FindPasswordPage() {
  const { t } = useTranslation();
  return <div>{t("비밀번호 찾기")}</div>;
}
