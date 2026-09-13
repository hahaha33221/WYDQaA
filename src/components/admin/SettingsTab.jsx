import React from "react";
import { CONFIG } from "../../constants/config";
import { useStore } from "../../context/StoreContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";

export default function SettingsTab() {
  const { live, isCloud, wipeAllQuestions } = useStore();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const handleWipe = async () => {
    if (window.confirm(t.wipeConfirm)) {
      await wipeAllQuestions();
      showToast(t.wipedAlert);
    }
  };

  return (
    <div className="settings-tab">
      <p className="note">
        지금 상태:{" "}
        <strong>
          {isCloud
            ? live
              ? "실시간 연결됨 (Firebase)"
              : "연결 시도 중..."
            : "테스트 모드 (이 기기에만 저장)"}
        </strong>
        <br />
        <br />
        여러 사람이 각자 휴대폰으로 쓰려면 <code>src/constants/config.js</code>의 <code>CONFIG.dbUrl</code>에
        Firebase Realtime Database 주소를 입력하세요. 무료로 생성할 수 있으며, 데이터베이스 규칙은{" "}
        <code>{`{"rules":{".read":true,".write":true}}`}</code>로 설정하면 즉시 연동됩니다.
        (행사 종료 후에는 규칙을 잠그는 것을 권장합니다.)
        <br />
        <br />
        운영자 접속 번호는 <code>CONFIG.adminCode</code>에서 변경할 수 있습니다.
        <br />
        송출용 큰 화면은 주소 뒤에 <code>#screen</code>을 붙이면 열립니다.
      </p>

      <div className="row" style={{ marginTop: "24px" }}>
        <button type="button" className="btn ghost danger" onClick={handleWipe}>
          받은 질문 모두 지우기
        </button>
      </div>
    </div>
  );
}
