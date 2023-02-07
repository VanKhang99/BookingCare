import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Select } from "antd";
import { languages } from "../../utils/constants";
import { headerNavList } from "../../utils/dataRender";
import { handleChangeLanguage } from "../../slices/appSlice";
import { HiMenu, HiQuestionMarkCircle } from "react-icons/hi";
import "../../styles/Header.scss";

const Header = ({ fixed }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleChange = (value) => {
    dispatch(handleChangeLanguage(value));
  };

  return (
    <header className={`header-container fixed`}>
      <div className="header-content u-wrapper">
        <div className="header-left">
          <span className="header-menu">
            <HiMenu />
          </span>

          <Link to="/">
            <div className="header-logo"></div>
          </Link>
        </div>

        <div className="header-middle">
          <ul className="nav-list">
            {headerNavList.map((item, index) => {
              return (
                <li key={item.id} className="nav-item">
                  <Link to={item.router} className="nav-link">
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

          <Link to="/support" className="support">
            <span title={t("header.support")}>
              <HiQuestionMarkCircle />
            </span>
          </Link>

          <div className="language">
            <Select
              defaultValue={localStorage.getItem("language") === "vi" ? "VI" : "EN"}
              onChange={handleChange}
              options={[
                {
                  value: `${languages.VI}`,
                  label: "VI",
                },
                {
                  value: `${languages.EN}`,
                  label: "EN",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
