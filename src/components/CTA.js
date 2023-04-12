import React from "react";
import { useTranslation } from "react-i18next";
import { BsCheck } from "react-icons/bs";
import "../styles/CTA.scss";

const CTA = () => {
  const { t } = useTranslation();

  return (
    <section className="cta-container u-background-grey u-border-bottom">
      <div className="cta-content u-wrapper">
        <div className="cta">
          <div className="cta__img"></div>

          <div className="cta-download">
            <h2 className="cta-download__title">{t("slider.download-app.title")}</h2>
            <ul className="cta-features">
              <li className="cta-feature">
                <BsCheck /> {t("slider.download-app.benefit-1")}
              </li>
              <li className="cta-feature">
                <BsCheck /> {t("slider.download-app.benefit-2")}
              </li>
              <li className="cta-feature">
                <BsCheck /> {t("slider.download-app.benefit-3")}
              </li>
            </ul>
            <div className="cta-download__imgs">
              <a href="https://play.google.com/store/apps/details?id=vn.bookingcare.bookingcare">
                <img src="https://bookingcare.vn/assets/icon/google-play-badge.svg" alt="Google Play" />
              </a>
              <a href="https://apps.apple.com/vn/app/bookingcare/id1347700144">
                <img src="https://bookingcare.vn/assets/icon/app-store-badge-black.svg" alt="Google Play" />
              </a>
            </div>

            <a href="https://bookingcare.vn/app" className="cta-download__open-link">
              {t("slider.download-app.or-open-link")}: <b>https://bookingcare.vn/app</b>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
