import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { bannerServicesList } from "../../utils/dataRender";
import { AiOutlineSearch } from "react-icons/ai";
import "../../styles/Banner.scss";

const Banner = () => {
  const { t } = useTranslation();

  return (
    <div className="banner">
      <div className="banner-top">
        <div className="banner-top-content  content">
          <div className="banner-top-title">
            <h1>
              {t("banner.medical-background")}
              <br />
              <b>{t("banner.health-care")}</b>
            </h1>
          </div>
          <div className="banner-top-search">
            <div className="banner-search-content">
              <span>
                <AiOutlineSearch />
              </span>
              <input type="text" placeholder="Tìm lí do khám" />
            </div>
          </div>
          <div className="banner-top-download">
            <a
              href="https://play.google.com/store/apps/details?id=vn.bookingcare.bookingcare"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://bookingcare.vn/assets/icon/google-play-badge.svg"
                alt="Google play download app"
              />
            </a>
            <a href="https://bookingcare.vn/app/ios" target="_blank" rel="noreferrer">
              <img
                src="https://bookingcare.vn/assets/icon/app-store-badge-black.svg"
                alt="Apple store download app"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="banner-service">
        <ul className="services-list">
          {bannerServicesList &&
            bannerServicesList.length > 0 &&
            bannerServicesList.map((service, index) => {
              return (
                <li key={service.id} className="services-item">
                  <Link to={service.router} className="services-link">
                    <div
                      className="services-img"
                      style={{
                        backgroundImage: `url(${service.image})`,
                      }}
                    ></div>

                    <strong>{t("banner.services-name").split(", ")[index]}</strong>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Banner;
