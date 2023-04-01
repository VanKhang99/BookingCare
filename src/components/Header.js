import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Language } from "./index";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { BsEmojiSmile } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { headerNavList } from "../utils/dataRender";
import "../styles/Header.scss";

const Header = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { isLoggedIn, userInfo } = useSelector((store) => store.user);

  const handleShowUserModal = () => {
    setShowUserModal(!showUserModal);
  };

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
          <Language />

          {/* <Link to="/support" className="header-right__support">
            <span title={t("header.support")}>
              <HiQuestionMarkCircle />
            </span>
          </Link> */}

          {isLoggedIn ? (
            <div className="user" onClick={handleShowUserModal}>
              <img
                src={
                  userInfo.imageUrl
                    ? userInfo.imageUrl
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                }
                alt={
                  language === "vi"
                    ? `${userInfo.lastName} ${userInfo.firstName}`
                    : `${userInfo.firstName} ${userInfo.lastName}`
                }
              />

              <div className={showUserModal ? "user-modal open" : "user-modal"}>
                <div className="user-modal-top">
                  <img
                    src={
                      userInfo.imageUrl
                        ? userInfo.imageUrl
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                    }
                    alt={
                      language === "vi"
                        ? `${userInfo.lastName} ${userInfo.firstName}`
                        : `${userInfo.firstName} ${userInfo.lastName}`
                    }
                    className="user-modal-top__image"
                  />
                  <span className="user-modal-top__name">
                    {language === "vi"
                      ? `${userInfo.lastName} ${userInfo.firstName}`
                      : `${userInfo.firstName} ${userInfo.lastName}`}
                  </span>
                </div>

                <div className="user-modal-bottom">
                  <div className="user-modal-bottom__left">
                    <BsEmojiSmile />
                    <span>Trung tâm cá nhân</span>
                  </div>
                  <div className="user-modal-bottom__right">
                    <IoLogOutOutline />
                    <span>Đăng xuất</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login">
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
