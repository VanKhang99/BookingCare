import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { headerNavList } from "../utils/dataRender";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { Language } from "./index";
import "../styles/Header.scss";

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="header-container fixed">
      <div className="header-content u-wrapper">
        <div className="header-left">
          <Link to="/">
            <div className="header-left__logo"></div>
          </Link>
        </div>

        <div className="header-middle">
          <ul className="header-nav">
            {headerNavList.map((item, index) => {
              return (
                <li key={item.id} className="header-nav__item">
                  <Link to={item.router} className="header-nav__link">
                    <b>{t("header.nav-link-title").split(", ")[index]}</b>
                    <span>{t("header.nav-link-subtitle").split(", ")[index]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="header-right">
          <Link to="/login" className="login">
            <span>Đăng nhập</span>
          </Link>

          <Link to="/support" className="header-right__support">
            <span title={t("header.support")}>
              <HiQuestionMarkCircle />
            </span>
          </Link>

          <Language />
        </div>
      </div>
    </header>
  );
};

export default Header;
