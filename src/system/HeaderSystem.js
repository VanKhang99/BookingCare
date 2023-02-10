import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import { languages } from "../utils/constants";
import { TbLogout } from "react-icons/tb";
import { Button, Dropdown, Space } from "antd";
import { handleCurrentKey } from "../slices/systemSlice";
import { logout } from "../slices/userSlice";
import { handleChangeLanguage, handleChangePathSystem } from "../slices/appSlice";
import "./styles/HeaderSystem.scss";

const Header = ({ menuSystemList }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { userInfo } = useSelector((store) => store.user);
  const { currentKeyMenu } = useSelector((store) => store.system);

  const handleChange = (value) => {
    dispatch(handleChangeLanguage(value));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuClick = ({ item, key }) => {
    dispatch(handleCurrentKey(key));
    dispatch(handleChangePathSystem(item.props.url));
  };

  const userFromLocalStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  return (
    <header className="system-header-container">
      <div className="system-header-content">
        <div className="system-header-left">
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

          {menuSystemList["clinic"] && (
            <Dropdown
              menu={{
                items: menuSystemList["clinic"],
                onClick: handleMenuClick,
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
              }}
            >
              <Button className="system-button">
                <Space>Allcode</Space>
              </Button>
            </Dropdown>
          )}
        </div>

        <div className="system-header-right">
          <div className="welcome">
            <div>{`${t("menu-system.welcome")} ${
              userInfo && userInfo.firstName ? userInfo.firstName : userFromLocalStorage?.firstName
            }`}</div>
          </div>

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

          <button className="logout" onClick={handleLogout}>
            <span>
              <TbLogout title="Logout" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
