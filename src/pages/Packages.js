import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Filter, Slider } from "../components";
import { getAllPackages } from "../slices/packageSlice";
import { getAllPackagesType } from "../slices/packageTypeSlice";
import "../styles/Packages.scss";

const initialState = {};

const Packages = () => {
  const [packageState, setPackageState] = useState(initialState);
  const [dataFiltered, setDataFiltered] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { packageArr } = useSelector((store) => store.package);
  const { packagesType } = useSelector((store) => store.packageType);

  const handleFilteredData = (arr) => {
    setDataFiltered(arr);
  };

  useEffect(() => {
    dispatch(getAllPackages({ clinicId: null, specialId: null }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getAllPackagesType());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="packages">
      <div className="packages-head">
        <div className="packages-head-image">
          <h2 className="packages-head-image__title">KHÁM TỔNG QUÁT</h2>
        </div>
      </div>

      <div className="packages-filter">
        <Filter packageArr={packageArr} dataFiltered={dataFiltered} onFilteredData={handleFilteredData} />
      </div>

      <div className="packages-categories">
        <Slider
          mainTitle="Danh mục"
          buttonText={t("button.see-more").toUpperCase()}
          packagesCategories="packages-categories"
          packagesType={packagesType}
        />
      </div>

      <div className="packages-clinics">
        <Slider
          mainTitle="Cơ sở y tế"
          buttonText={t("button.see-more").toUpperCase()}
          packagesClinics="packages-clinics"
        />
      </div>
    </div>
  );
};

export default Packages;
