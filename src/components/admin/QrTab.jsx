import React from "react";
import { CONFIG } from "../../constants/config";

export default function QrTab() {
  const currentPublicUrl =
    CONFIG.publicUrl ||
    (typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "");

  const getQrUrl = (url, size) => {
    return (
      "https://api.qrserver.com/v1/create-qr-code/?size=" +
      size +
      "x" +
      size +
      "&margin=8&ecc=M&data=" +
      encodeURIComponent(url)
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-tab">
      <div className="qrwrap">
        <img src={getQrUrl(currentPublicUrl, 460)} alt="접속 QR 코드" />
        <div className="url">{currentPublicUrl}</div>
        <div className="row" style={{ justifyContent: "center" }}>
          <button
            type="button"
            className="btn ghost no-print"
            onClick={handlePrint}
          >
            인쇄하기
          </button>
          <a
            className="btn ghost no-print"
            href={getQrUrl(currentPublicUrl, 1200)}
            download="qr.png"
            style={{ textDecoration: "none" }}
          >
            이미지 내려받기
          </a>
        </div>
      </div>

      <div className="poster">
        <div className="ph">
          <strong>
            Scan to ask.
            <br />
            궁금한 걸 물어보세요.
          </strong>
          <span>Preguntas · Questions · Domande · Perguntas</span>
        </div>
        <div className="pb">
          <img src={getQrUrl(currentPublicUrl, 700)} alt="포스터용 QR" />
        </div>
      </div>

      <p className="note no-print" style={{ marginTop: "20px" }}>
        주소가 <code>file://</code>로 시작하면 모바일에서 QR로 열리지 않습니다. 웹에 배포한 뒤(예: GitHub Pages, Vercel, Netlify)
        해당 주소를 <code>src/constants/config.js</code>의 <code>publicUrl</code>에 지정하세요.
      </p>
    </div>
  );
}
