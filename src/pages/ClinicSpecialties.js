import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { InputSearch } from "../components";
import { getAllSpecialtiesByClinicId } from "../slices/clinicSpecialtySlice";
import { helperFilterSearch } from "../utils/helpers";
import { MdLocationOn } from "react-icons/md";
import { path } from "../utils/constants";
import "../styles/ClinicSpecialties.scss";

const ClinicSpecialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [filterSpecialties, setFilterSpecialties] = useState([]);
  const dispatch = useDispatch();
  const { clinicId } = useParams();
  const { language } = useSelector((store) => store.app);

  const handleFetchSpecialties = async () => {
    try {
      const res = await dispatch(getAllSpecialtiesByClinicId(clinicId));
      if (res?.payload?.data.length > 0) {
        setSpecialties([...res.payload.data]);
        setFilterSpecialties([...res.payload.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchSpecialties = (e) => {
    let specialtiesCopy = [...specialties];
    const newSpecialties = specialtiesCopy.filter((specialty) => {
      const { targetName, input } = helperFilterSearch(e.target.value, specialty.specialtyName.nameVi);

      if (language === "vi") return targetName.includes(input);

      return specialty.nameData.valueEn.toLowerCase().includes(e.target.value.toLowerCase());
    });

    return setFilterSpecialties(newSpecialties);
  };

  useEffect(() => {
    if (clinicId) {
      handleFetchSpecialties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="clinic-specialties-container">
      <div className="clinic-specialties u-wrapper">
        <div className="clinic-specialties-top">
          <h2 className="clinic-specialties-top__title">
            {language === "vi" ? "Danh sách các chuyên khoa" : "List of specialties"}
          </h2>

          <div className="clinic-specialties-top-search">
            <InputSearch
              placeholder={language === "vi" ? "Tìm kiếm chuyên khoa" : "Search for a specialty"}
              onSearch={handleSearchSpecialties}
            />
          </div>
        </div>

        <div className="clinic-specialties-list">
          {filterSpecialties.length > 0 &&
            filterSpecialties.map((specialty) => {
              const {
                imageUrl,
                specialtyName,
                clinicInfo: { imageUrl: imageClinic, nameVi, nameEn },
              } = specialty;

              return (
                <Link
                  to={`/${path.CLINIC}/${specialty.clinicId}/${path.SPECIALTIES}/${specialty.specialtyId}`}
                  key={specialty.specialtyId}
                  className="clinic-specialties-item"
                >
                  <div className="clinic-specialties-item__image">
                    <img
                      src={imageUrl ? imageUrl : imageClinic}
                      alt={`Khám ${specialtyName.nameVi} - ${nameVi}`}
                    />
                  </div>

                  <div className="clinic-specialties-info">
                    <span className="clinic-specialties-info__name">
                      {language === "vi"
                        ? `Khám ${specialtyName.nameVi} - ${nameVi}`
                        : `${specialtyName.nameEn} examination - ${nameEn}`}
                    </span>

                    <div className="clinic-specialties-info__address">
                      <MdLocationOn />
                      <span>{specialty.address}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ClinicSpecialties;
