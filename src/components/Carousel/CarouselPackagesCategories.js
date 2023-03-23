import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { path } from "../../utils/constants";

const CarouselPackagesCategories = ({ settings, category }) => {
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);

  return (
    <Carousel className="slides" {...settings}>
      {category?.length > 0 &&
        category.map((pType) => {
          const { imageUrl, id: packageId, nameVi, nameEn, id } = pType;
          return (
            <Link to={`/`} key={id} className="slide">
              <div className="slide-content">
                <div className="slide-content__img">
                  <img
                    src={imageUrl}
                    alt={language === "vi" ? nameVi : nameEn}
                    style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "50%" }}
                  />
                </div>
                <span className="slide-content__name">{language === "vi" ? nameVi : nameEn}</span>
              </div>
            </Link>
          );
        })}
    </Carousel>
  );
};

export default CarouselPackagesCategories;
