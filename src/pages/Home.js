import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Banner, Slider, Media, CTA } from "../components";

const Home = () => {
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  useEffect(() => {
    document.title =
      language === "vi"
        ? "BookingCare - Nền tảng chăm sóc sức khỏe toàn diện"
        : "BookingCare - Comprehensive healthcare platform";
  }, [language]);

  return (
    <div className="app">
      <main>
        <div className="wrapper">
          <div className="content">
            <Banner />
            <Slider
              mainTitle={t("slider.doctor-remote-title")}
              buttonText={t("button.see-more").toUpperCase()}
              doctorRemote="doctor-remote"
            />
            <Slider
              mainTitle={t("slider.popular-specialty-title")}
              buttonText={t("button.see-more").toUpperCase()}
              popularSpecialty="popular-specialty"
            />
            <Slider
              mainTitle={t("slider.outstanding-medical-facilities-title")}
              buttonText={t("button.searching").toUpperCase()}
              outstandingFacilities="outstanding-facilities"
            />
            <Slider
              mainTitle={t("slider.outstanding-doctors-title")}
              buttonText={t("button.searching").toUpperCase()}
              doctors="doctors"
            />
            <Slider
              mainTitle={t("slider.handbook-title")}
              buttonText={t("button.all-post").toUpperCase()}
              handbook="handbook"
            />
            <Media />
            <CTA />
            <Slider
              mainTitle={t("slider.for-doctor-facilities-title")}
              buttonText={t("button.post").toUpperCase()}
              buttonText2={t("button.cooperate").toUpperCase()}
              buttonText3={t("button.contact").toUpperCase()}
              doctorAndFacilities="doctor-facility"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
