import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Filter, Package, PackageBanner, ModalBooking } from "../components";
import { getAllPackages, getPackage } from "../slices/packageSlice";
import { getCategory } from "../slices/categorySlice";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { dataModalBooking } from "../utils/helpers";
import "../styles/DetailCategory.scss";

const initialState = {
  packageArr: [],

  isOpenModalBooking: false,
  hourBooked: "",
  packageId: "",
  packageData: {},

  hideCategoryIntro: false,
  haveFilterByClinicsAndCity: true,
};

const DetailCategory = () => {
  const [categoryState, setCategoryState] = useState(initialState);
  const [packageFiltered, setPackageFiltered] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { categoryId } = useParams();
  const { data: category } = useFetchDataBaseId(+categoryId, "category", getCategory);

  const fetchAllPackagesByCategory = async () => {
    try {
      const res = await dispatch(getAllPackages({ clinicId: null, specialtyId: null, getAll: false }));
      if (res.payload.data.length > 0) {
        const packageBelongCategory = res.payload.data.filter((cate) => cate.categoryId.includes(categoryId));
        // const packageArr = res.payload.data;
        setCategoryState({ ...categoryState, packageArr: res.payload.data });
        setPackageFiltered(packageBelongCategory);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleModal = async (hourClicked, doctorId = null, packageId = null) => {
    // console.log("test");
    // (Why get doctorId)
    //pass DoctorId --> Doctor --> BookingHours
    /// --> Run function (handleClick) to get "doctorId" pass reverse to parentComponent
    ////////via function handleModal --> run get dataDoctor and price to ModalBooking
    try {
      if (packageId) {
        const res = await dispatch(getPackage(+packageId));

        if (res?.payload?.data) {
          return setCategoryState({
            ...categoryState,
            packageData: res.payload.data,
            packageId,

            isOpenModalBooking: !categoryState.isOpenModalBooking,
            hourClicked: { ...hourClicked },
          });
        }
      }

      return setCategoryState({
        ...categoryState,
        isOpenModalBooking: !categoryState.isOpenModalBooking,
        hourClicked: { ...hourClicked },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilteredData = (arr) => {
    setPackageFiltered(arr);
  };

  const handleHideCategoryIntro = () => {
    setCategoryState({ ...categoryState, hideCategoryIntro: true });
  };

  useEffect(() => {
    fetchAllPackagesByCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="detail-category">
      {!categoryState.hideCategoryIntro && (
        <div className="category-intro">
          <div className="category-intro__background"></div>
          <div className="category-content">
            <div className="category-content-left">
              <img src={category?.imageUrl} alt="" className="category-content-left__image" />
            </div>
            <div className="category-content-right">
              <h2 className="category-content-right__title">
                {language === "vi" ? category?.nameVi : category?.nameEn}
              </h2>
              <p>
                Khám sức khỏe tổng quát định kỳ là biện pháp hữu hiệu giúp tầm soát những bệnh nguy hiểm từ
                giai đoạn sớm và tư vấn phòng chống những căn bệnh thường gặp, giúp bảo vệ sức khỏe và nâng
                cao chất lượng sống đồng thời nhìn lại sức khỏe bản thân, tránh được các lo lắng về sức khỏe.
              </p>
              <p>
                Theo khuyến cáo của Tổ chức Y tế thế giới, người từ 18 tuổi trở lên cần được khám sức khỏe
                định kỳ 6 tháng/ lần hoặc 1 năm/ lần nhằm phát hiện và điều trị sớm các bệnh lý đang trong
                giai đoạn tiềm ẩn, qua đó có thể chẩn đoán các nguy cơ tiềm ẩn của nhiều bệnh nguy hiểm về tim
                mạch, rối loạn chức năng hô hấp, ung thư phổi, dạ dày, vòm họng hay các bệnh viêm gan siêu vi…
              </p>
              <p>
                Khám sức khỏe định kỳ có ý nghĩa đặc biệt quan trọng trong việc phát hiện các bệnh ung thư -
                căn bệnh hầu như không có triệu chứng ở giai đoạn khởi phát.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={categoryState.hideCategoryIntro ? "category-body margin-top" : "category-body"}>
        <Filter
          categoryId={categoryId}
          packageArr={categoryState.packageArr}
          dataFiltered={packageFiltered}
          onFilteredData={handleFilteredData}
          onHideCategoryIntro={handleHideCategoryIntro}
          haveFilterByClinicsAndCity={categoryState.haveFilterByClinicsAndCity}
        />

        <div className="category-packages u-wrapper">
          {packageFiltered.length > 0 &&
            packageFiltered.map((pk) => {
              return (
                <Package
                  key={pk.id}
                  packageId={pk.id}
                  onToggleModal={handleModal}
                  packageData={pk}
                  assurance
                  needAddress
                />
              );
            })}
        </div>
      </div>

      <div className="modal-booking">
        <ModalBooking
          show={categoryState.isOpenModalBooking}
          onHide={() => handleModal()}
          packageId={categoryState.packageId ? categoryState.packageId : ""}
          packageData={dataModalBooking(language, categoryState.packageData, "package")}
          hourClicked={!_.isEmpty(categoryState.hourClicked) && categoryState.hourClicked}
        />
      </div>
    </div>
  );
};

export default DetailCategory;
