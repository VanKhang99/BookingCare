import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/Footer.scss";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer-container">
      <div className="u-wrapper">
        <div className="footer">
          <div className="footer-left">
            <div className="logo-img">
              <img src="https://bookingcare.vn/assets/icon/bookingcare-2020.svg" alt="Logo BookingCare" />
            </div>

            <div className="info-company">
              <strong className="name-company">{t("footer.company-name")}</strong>
              <div className="address">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
                </svg>
                <span>28 Thành Thái, Dịch Vọng, Cầu Giấy, Hà Nội</span>
              </div>
              <div className="business-license">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8V72zm0 64c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8v-16zm192.81 248H304c8.84 0 16 7.16 16 16s-7.16 16-16 16h-47.19c-16.45 0-31.27-9.14-38.64-23.86-2.95-5.92-8.09-6.52-10.17-6.52s-7.22.59-10.02 6.19l-7.67 15.34a15.986 15.986 0 0 1-14.31 8.84c-.38 0-.75-.02-1.14-.05-6.45-.45-12-4.75-14.03-10.89L144 354.59l-10.61 31.88c-5.89 17.66-22.38 29.53-41 29.53H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h12.39c4.83 0 9.11-3.08 10.64-7.66l18.19-54.64c3.3-9.81 12.44-16.41 22.78-16.41s19.48 6.59 22.77 16.41l13.88 41.64c19.77-16.19 54.05-9.7 66 14.16 2.02 4.06 5.96 6.5 10.16 6.5zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
                </svg>
                <span>{t("footer.business-registration-number")}</span>
              </div>
              <div className="copyright">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 448c-110.532 0-200-89.451-200-200 0-110.531 89.451-200 200-200 110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200zm107.351-101.064c-9.614 9.712-45.53 41.396-104.065 41.396-82.43 0-140.484-61.425-140.484-141.567 0-79.152 60.275-139.401 139.762-139.401 55.531 0 88.738 26.62 97.593 34.779a11.965 11.965 0 0 1 1.936 15.322l-18.155 28.113c-3.841 5.95-11.966 7.282-17.499 2.921-8.595-6.776-31.814-22.538-61.708-22.538-48.303 0-77.916 35.33-77.916 80.082 0 41.589 26.888 83.692 78.277 83.692 32.657 0 56.843-19.039 65.726-27.225 5.27-4.857 13.596-4.039 17.82 1.738l19.865 27.17a11.947 11.947 0 0 1-1.152 15.518z" />
                </svg>{" "}
                {new Date().getFullYear()} BookingCare.
              </div>
            </div>

            <div className="images">
              <a
                href="http://online.gov.vn/Home/WebDetails/68563?AspxAutoDetectCookieSupport=1"
                target="_blank"
                rel="noreferrer"
              >
                <img src="https://bookingcare.vn/assets/icon/bo-cong-thuong.svg" alt="Register" />
              </a>
              <a href="http://online.gov.vn/Home/AppDetails/1101" target="_blank" rel="noreferrer">
                <img src="https://bookingcare.vn/assets/icon/bo-cong-thuong.svg" alt="Register" />
              </a>
            </div>
          </div>

          <div className="footer-middle">
            <ul className="list">
              {Array.from({ length: 8 }, (_, index) => index + 1).map((item) => {
                return (
                  <li className="item" key={item}>
                    <a href="/" target="_blank" rel="noreferrer" className="link">
                      {t("footer.list").split(", ")[item - 1]}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="footer-right">
            <div className="branches">
              <div className="branch">
                <strong>{t("footer.headquarter-hanoi")}</strong>
                <span>28 Thành Thái, Dịch Vọng, Cầu Giấy, Hà Nội</span>
              </div>
              <div className="branch">
                <strong>{t("footer.office-hcm")}</strong>
                <span>Số 01, Hồ Bá Kiện, Phường 15, Quận 10</span>
              </div>
              <div className="support">
                <strong>{t("footer.customer-support")}</strong>
                <span>support@bookingcare.vn (7h - 18h)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-download">
          <div className="left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M272 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM160 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm112-108c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V60c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v312z" />
            </svg>

            <div className="download-text">
              {t("footer.download")}:{" "}
              <a
                href="https://play.google.com/store/apps/details?id=vn.bookingcare.bookingcare"
                target="_blank"
                rel="noreferrer"
              >
                Android -
              </a>
              <a href="https://bookingcare.vn/app/ios" target="_blank" rel="noreferrer">
                {" "}
                iPhone/iPad -
              </a>
              <a href="https://bookingcare.vn/app" target="_blank" rel="noreferrer">
                {" "}
                Khác
              </a>
            </div>
          </div>

          <div className="social">
            <div className="item">
              <a href="https://www.facebook.com/bookingcare" target="_blank" rel="noreferrer">
                <img
                  src="https://bookingcare.vn/themes/app1912/assets/img/social/facebook-square.svg"
                  alt="Facebook"
                />
              </a>
            </div>

            <div className="item">
              <a
                href="https://www.youtube.com/channel/UC9l2RhMEPCIgDyGCH8ijtPQ"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://bookingcare.vn/themes/app1912/assets/img/social/youtube-square.svg"
                  alt="Facebook"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
