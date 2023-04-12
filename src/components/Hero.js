import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { heroServicesList } from "../utils/dataRender";
import { AiOutlineSearch } from "react-icons/ai";
import { placeholderArrayVi, placeholderArrayEn } from "../utils/dataRender";
import { TIMEOUT_HERO_INPUT_PLACEHOLDER } from "../utils/constants";
import "../styles/Hero.scss";

const Hero = () => {
  const [placeholderInput, setPlaceholderInput] = useState(
    localStorage.getItem("language") === "vi" ? placeholderArrayVi : placeholderArrayEn
  );
  const [indexPlaceholder, setIndexPlaceholder] = useState(0);
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIndexPlaceholder((prevState) => {
        if (prevState === placeholderInput.length - 1) return 0;
        return prevState + 1;
      });
    }, TIMEOUT_HERO_INPUT_PLACEHOLDER);

    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexPlaceholder]);

  useEffect(() => {
    setPlaceholderInput(language === "vi" ? placeholderArrayVi : placeholderArrayEn);
  }, [language]);

  return (
    <div className="hero-container">
      <div className="hero-top">
        <div className="hero-top__title">
          <h1>
            {t("hero.medical-background")}
            <br />
            <b>{t("hero.health-care")}</b>
          </h1>
        </div>
        <div className="hero-top__search">
          <div className="hero-top__search-wrap">
            <span>
              <AiOutlineSearch />
            </span>
            <input type="text" placeholder={`${placeholderInput[indexPlaceholder]}`} />
          </div>
        </div>
        <div className="hero-top__download">
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

      <div className="hero-service">
        <ul className="services-list">
          {heroServicesList &&
            heroServicesList.length > 0 &&
            heroServicesList.map((service, index) => {
              return (
                <li key={service.id} className="services-list__item">
                  <Link to={service.router} className="services-list__link">
                    <div
                      className="services-list__link-img"
                      style={{
                        backgroundImage: `url(${service.image})`,
                      }}
                    ></div>

                    <strong>{t("hero.services-name").split(", ")[index]}</strong>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Hero;
