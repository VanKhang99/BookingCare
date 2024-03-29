import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "../components";
import { Select } from "antd";
import { languages } from "../utils/constants";
import { Button, Dropdown, Space } from "antd";
import { IoHome } from "react-icons/io5";
import { handleCurrentKey } from "../slices/appSlice";
import { handleChangeLanguage } from "../slices/appSlice";
import "./styles/HeaderSystem.scss";

const Header = ({ menuSystemList, packageMenu }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { userInfo } = useSelector((store) => store.user);
  const { currentKeyMenu } = useSelector((store) => store.app);

  const handleChange = (value) => {
    dispatch(handleChangeLanguage(value));
  };

  const handleMenuClick = (e) => {
    return dispatch(handleCurrentKey(e.key));
  };

  const handleToHomePage = () => {
    navigate("/");
  };

  return (
    <header className="system-header-container">
      <div className="system-header-content">
        <div className="system-header-left">
          <div className="system-header-left__home" onClick={handleToHomePage}>
            <IoHome />
          </div>

          {menuSystemList["user"] && (
            <Dropdown
              menu={{
                items: menuSystemList["user"],
                onClick: handleMenuClick,
                selectedKeys: currentKeyMenu,
              }}
            >
              <Button className="system-button">
                <Space>{t("menu-system.user")}</Space>
              </Button>
            </Dropdown>
          )}

          {menuSystemList["doctor"] && (
            <Dropdown
              menu={{
                items: menuSystemList["doctor"],
                onClick: handleMenuClick,
                selectedKeys: currentKeyMenu,
              }}
            >
              <Button className="system-button">
                <Space>{t("menu-system.doctor")}</Space>
              </Button>
            </Dropdown>
          )}

          {menuSystemList["clinic"] && (
            <Dropdown
              menu={{
                items: menuSystemList["clinic"],
                onClick: handleMenuClick,
                selectedKeys: currentKeyMenu,
              }}
            >
              <Button className="system-button">
                <Space>{t("menu-system.clinic")}</Space>
              </Button>
            </Dropdown>
          )}

          {menuSystemList["specialty"] && (
            <Dropdown
              menu={{
                items: menuSystemList["specialty"],
                onClick: handleMenuClick,
                selectedKeys: currentKeyMenu,
              }}
            >
              <Button className="system-button">
                <Space>{t("menu-system.specialty")}</Space>
              </Button>
            </Dropdown>
          )}

          {menuSystemList["handbook"] && (
            <Dropdown
              menu={{
                items: menuSystemList["handbook"],
                onClick: handleMenuClick,
                selectedKeys: currentKeyMenu,
              }}
            >
              <Button className="system-button">
                <Space>{t("menu-system.handbook")}</Space>
              </Button>
            </Dropdown>
          )}

          {menuSystemList["package"] && (
            <Dropdown
              menu={{
                items: menuSystemList["package"],
                onClick: handleMenuClick,
                selectedKeys: currentKeyMenu,
              }}
            >
              <Button className="system-button">
                <Space>{t("menu-system.package")}</Space>
              </Button>
            </Dropdown>
          )}

          {menuSystemList["allcode"] && (
            <Dropdown
              menu={{
                items: menuSystemList["allcode"],
                onClick: handleMenuClick,
                selectedKeys: currentKeyMenu,
              }}
            >
              <Button className="system-button">
                <Space>Allcode</Space>
              </Button>
            </Dropdown>
          )}
        </div>

        <div className="system-header-right">
          <LoginModal />

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

export default memo(Header);
