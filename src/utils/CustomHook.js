import { useState, useEffect } from "react";
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
