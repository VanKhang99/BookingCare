import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctorsById } from "../slices/doctorSlice";
import "../styles/ProvinceOptions.scss";

const initialState = {
  provinces: [],
  provinceSelected: {},
};

const ProvinceOptions = ({ specialtyId, onProvinceChange, remote }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);

  const makeUniqueLocation = (locationArr) => {
    const provincesIsHaved = [];
    let provincesUnique = [];

    for (let i = 0; i < locationArr.length; i++) {
      if (i === 0) {
        provincesIsHaved.push(locationArr[i].label);
        provincesUnique.push(locationArr[i]);
      } else if (i > 0 && provincesIsHaved.includes(locationArr[i].label)) {
        continue;
      } else if (i > 0 && !provincesIsHaved.includes(locationArr[i].label)) {
        provincesIsHaved.push(locationArr[i].label);
        provincesUnique.push(locationArr[i]);
      }
    }

    provincesUnique =
      language === "vi"
        ? [{ label: "Toàn quốc", value: "*" }, ...provincesUnique]
        : [{ label: "All", value: "*" }, ...provincesUnique];

    return provincesUnique;
  };

  const handleOptionLocation = async (id) => {
    try {
      const res = await dispatch(
        getAllDoctorsById({
          nameColumnMap: "specialtyId",
          id: +id,
          typeRemote: remote ? "includeOnlyTrue" : "includeOnlyFalse",
        })
      );

      const provinces = res.payload?.data.doctors.map((doctor) => {
        return {
          label: language === "vi" ? doctor.provinceData.valueVi : doctor.provinceData.valueEn,
          value: doctor.provinceData.keyMap,
        };
      });
      const provincesUnique = makeUniqueLocation(provinces);
      if (provincesUnique?.length > 0) {
        return setState({
          ...state,
          provinces: provincesUnique,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectedProvince = (option) => {
    onProvinceChange(option);
  };

  useEffect(() => {
    if (specialtyId) {
      handleOptionLocation(specialtyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <>
      <div className="province-options-container">
        <div className="province-options">
          {state.provinces?.length > 0 && (
            <Select
              // value={state.provinceSelected}
              defaultValue={state.provinces[0]}
              onChange={(option) => handleSelectedProvince(option)}
              options={state.provinces}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProvinceOptions;
