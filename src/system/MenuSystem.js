import React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineUser } from "react-icons/ai";
import { BiBook, BiClinic } from "react-icons/bi";
import { HeaderSystem } from "./index";
import { MdOutlineWorkOutline } from "react-icons/md";
import { BsFolderPlus } from "react-icons/bs";
import { GoPackage } from "react-icons/go";
import { Link } from "react-router-dom";

const MenuSystem = ({ roleId }) => {
  const { t } = useTranslation();

  const adminMenuList = {
    user: [
      {
        label: <Link to="user-manage">{t("menu-system.user-management")}</Link>,
        key: "user-manage",
        icon: <AiOutlineUser />,
      },
    ],

    doctor: [
      {
        label: <Link to="doctor-manage">{t("menu-system.doctor-manage")}</Link>,
        key: "doctor-manage",
        icon: <AiOutlineUser />,
      },
      {
        label: <Link to="doctor-schedule-manage">{t("menu-system.doctor-schedule-management")}</Link>,
        key: "doctor-schedule-manage",
        icon: <AiOutlineUser />,
      },
    ],

    clinic: [
      {
        label: <Link to="clinic-manage">{t("menu-system.clinic-management")}</Link>,
        key: "clinic-manage",
        icon: <BiClinic />,
      },
      {
        label: <Link to="clinic-specialty-manage">{t("menu-system.clinic-specialty-manage")}</Link>,
        key: "clinic-specialty-manage",
        icon: <BiClinic />,
      },
    ],

    specialty: [
      {
        label: <Link to="specialty-manage">{t("menu-system.specialty-management")}</Link>,
        key: "specialty-manage",
        icon: <MdOutlineWorkOutline />,
      },
    ],
    handbook: [
      {
        label: <Link to="handbook-manage">{t("menu-system.handbook-management")}</Link>,
        key: "handbook-manage",
        icon: <BiBook />,
      },
    ],

    package: [
      {
        label: <Link to="package-type">{t("menu-system.package-type")}</Link>,
        key: "package-type",
        icon: <GoPackage />,
      },
      {
        label: <Link to="package-manage">{t("menu-system.package-management")}</Link>,
        key: "package-manage",
        icon: <GoPackage />,
      },
      {
        label: <Link to="package-schedule">{t("menu-system.package-schedule")}</Link>,
        key: "package-schedule",
        icon: <GoPackage />,
      },
    ],

    allcode: [
      {
        label: <Link to="allcode-manage">{t("menu-system.allcode")}</Link>,
        key: "allcode-manage",
        icon: <BsFolderPlus />,
      },
    ],
  };

  const doctorMenuList = {
    user: [
      {
        label: <Link to="patient-booking-manage">{t("menu-system.patient-booking-manage")}</Link>,
        key: "patient-booking-manage",
        icon: <AiOutlineUser />,
      },
      {
        label: <Link to="schedule-manage">{t("menu-system.doctor-schedule-management")}</Link>,
        key: "schedule-manage",
        icon: <AiOutlineUser />,
      },
    ],
  };

  return (
    <div className="menu">
      <HeaderSystem menuSystemList={roleId === "R1" ? adminMenuList : doctorMenuList} />
    </div>
  );
};

export default MenuSystem;
