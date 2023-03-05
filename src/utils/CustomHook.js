import { useState, useEffect, useMemo } from "react";
import _ from "lodash";
import { useDispatch } from "react-redux";
// import _ from "lodash";

export const useFetchDataBaseId = (id, type, functionDispatch, remote = undefined) => {
  const [data, setData] = useState({});
  const dispatch = useDispatch();

  const handleFetchData = async (id) => {
    if (type === "doctor" || type === "moreInfoDoctor" || type === "package") {
      id = +id;
    }

    try {
      let res;
      if (remote || remote === 0) {
        res = await dispatch(functionDispatch({ keyMapId: id, remote }));
      } else {
        res = await dispatch(functionDispatch(id));
      }
      if (res?.payload?.data) {
        return setData(res.payload.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!id) return;

    handleFetchData(id);
  }, [id]);

  return data;
};

export const useDataModal = (language, data, hourClicked) => {
  // console.log(data);
  return useMemo(() => {
    if (_.isEmpty(data)) return;
    const {
      priceData,
      clinic,
      moreData: { firstName, lastName, imageUrl, positionData, roleData },
    } = data;

    const dataModal = {
      doctorName: language === "vi" ? `${lastName} ${firstName}` : `${firstName} ${lastName}`,
      imageUrl: imageUrl,
      price: priceData,
      clinicName: language === "vi" ? clinic.nameVi : clinic.nameEn,
      position: language === "vi" ? positionData.valueVi : positionData.valueEn,
      role: language === "vi" ? roleData.valueVi : roleData.valueEn,
      positionId: positionData.keyMap,
    };
    return dataModal;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hourClicked]);
};
