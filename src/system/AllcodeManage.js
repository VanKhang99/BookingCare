import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllCodes, getOneAllCode, createAllCode, deleteAllCode } from "../slices/allcodeSlice";
import { checkData } from "../utils/helpers";
import { IoReload } from "react-icons/io5";
// import "./styles/AllcodeManage.scss";

const initialState = {
  selectedType: "",
  oldSelectedType: "",
  selectedAllcode: "",
  oldSelectedAllcode: "",
  isHaveInfo: false,
  action: "",

  keyMap: "",
  type: "",
  valueEn: "",
  valueVi: "",

  allCodes: [],
  typesUnique: [],
};

const AllcodeManage = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const keyMapRef = useRef(null);

  const handleFetchAllcode = async (typeString) => {
    try {
      const res = await dispatch(getAllCodes(typeString));
      if (res?.payload?.allCode.length > 0) {
        let typesUnique;
        const allCodes = res.payload.allCode;

        if (typeString === "all") {
          typesUnique = [...new Set(allCodes.map((ac) => ac.type))];
          return setState({ ...state, allCodes, typesUnique });
        }

        return setState({ ...state, allCodes });
      }
    } catch (error) {
      console.error = error;
    }
  };

  const handleOptions = (data, typeArr) => {
    if (!data) return;

    const objectOptions = data.map((item) => {
      let label;
      let value;
      if (typeArr === "type") {
        label = item;
        value = item;
      }

      if (typeArr === "all") {
        label = language === "vi" ? `${item.valueVi}` : `${item.valueEn}`;
        value = item.keyMap;
      }

      return { label, value };
    });

    return objectOptions;
  };

  const handleInputsChange = (e, typeInput) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (typeInput.startsWith("selected")) {
      stateCopy[typeInput] = e;
    } else {
      stateCopy[typeInput] = e.target.value;
    }
    setState({ ...stateCopy });
  };

  const handleSaveDataAllCode = async () => {
    try {
      let propsCheckArr = ["keyMap", "type", "valueEn", "valueVi"];
      const validate = checkData(state, propsCheckArr);
      if (!validate) throw new Error("Input data not enough");

      const allCodeData = {
        keyMap: state.keyMap,
        type: state.type,
        valueEn: state.valueEn,
        valueVi: state.valueVi,
        action: state.action || "create",
      };
      console.log(allCodeData);

      const info = await dispatch(createAllCode(allCodeData));

      if (info?.payload?.status === "success") {
        toast.success("All-code data has been created into all-code table successfully!");
        return setState({ ...initialState, typesUnique: state.typesUnique });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleUpdateAllcode = async (selectedOption) => {
    try {
      const res = await dispatch(getOneAllCode(selectedOption?.value || state.oldSelectedAllcode));
      const allCodeData = res.payload.data;
      const allCodeSelected = handleOptions(state.allCodes, "all").find(
        (item) => item.value === allCodeData.keyMap
      );
      const typeSelected = handleOptions(state.typesUnique, "type").find(
        (item) => item.value === allCodeData.type
      );

      return setState({
        ...state,
        selectedType: typeSelected,
        selectedAllcode: allCodeSelected,
        oldSelectedAllcode: allCodeData.keyMap,
        oldSelectedType: typeSelected.value,
        keyMap: allCodeData.keyMap,
        type: allCodeData.type,
        valueEn: allCodeData.valueEn,
        valueVi: allCodeData.valueVi,
        isHaveInfo: true,
        action: "edit",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAllCode = async () => {
    try {
      if (!state.selectedAllcode) return toast.error("Please select allCode before delete!");
      alert("Are you sure you want to delete?");

      console.log(state.selectedAllcode);
      const res = await dispatch(deleteAllCode(state.selectedAllcode.value));
      if (res.payload === "") {
        toast.success("AllCode is deleted successfully!");
        return setState({ ...initialState, typesUnique: state.typesUnique });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleOptions();
    if (state.oldSelectedAllcode) {
      handleUpdateAllcode();
    }
    keyMapRef.current = state.oldSelectedAllcode;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    if (!_.isEmpty(state.selectedType)) {
      handleFetchAllcode(state.selectedType.value);
    } else {
      handleFetchAllcode("all");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_.isEmpty(state.selectedType), state.selectedType?.label]);

  return (
    <div className="allcode-manage container">
      <div className="u-main-title mt-3 text-center">Quản lý bảng Allcode</div>

      <div className="allcode-manage-created">
        <div className="row justify-content-between">
          <h2 className="u-sub-title mt-5 mb-3 d-flex justify-content-between align-items-center">
            ALLCODES CREATED
            <button
              className="u-system-button--refresh-data"
              onClick={() => setState({ ...initialState, typesUnique: state.typesUnique })}
            >
              <IoReload />
            </button>
          </h2>

          <div className="col-6">
            <Select
              value={state.selectedType}
              onChange={(option) => {
                handleInputsChange(option, "selectedType");
              }}
              options={handleOptions(state.typesUnique, "type")}
              placeholder={language === "vi" ? "Chọn type" : "Choose type"}
            />
          </div>

          <div className="col-6">
            <Select
              value={state.selectedAllcode}
              onChange={(option) => {
                handleInputsChange(option, "selectedAllcode");
                handleUpdateAllcode(option);
              }}
              options={handleOptions(state.allCodes, "all")}
              placeholder={language === "vi" ? "Chọn giá trị allCode" : "Choose a allCode"}
            />
          </div>
        </div>
      </div>

      <div className="allcode-manage-inputs">
        <h2 className="u-sub-title mt-5 mb-3">INPUTS</h2>
        <div className="row">
          <Form.Group className="col-6" controlId="formKeyMap">
            <h4 className="u-input-label">KeyMap</h4>
            <Form.Control
              type="text"
              value={state.keyMap}
              className="u-input"
              onChange={(e, id) => handleInputsChange(e, "keyMap")}
            />
          </Form.Group>

          <Form.Group className="col-6" controlId="formType">
            <h4 className="u-input-label">Type</h4>
            <Form.Control
              type="text"
              value={state.type}
              className="u-input"
              onChange={(e, id) => handleInputsChange(e, "type")}
            />
          </Form.Group>

          <Form.Group className="mt-5 col-6" controlId="formValueEn">
            <h4 className="u-input-label">Value (EN)</h4>
            <Form.Control
              type="text"
              value={state.valueEn}
              className="u-input"
              onChange={(e, id) => handleInputsChange(e, "valueEn")}
            />
          </Form.Group>

          <Form.Group className="mt-5 col-6" controlId="formValueVi">
            <h4 className="u-input-label">Value (VI)</h4>
            <Form.Control
              type="text"
              value={state.valueVi}
              className="u-input"
              onChange={(e, id) => handleInputsChange(e, "valueVi")}
            />
          </Form.Group>
        </div>
      </div>

      <div className="u-system-button d-flex justify-content-end gap-3 mt-4">
        <Button variant="danger" onClick={() => handleDeleteAllCode()}>
          {t("button.delete")}
        </Button>
        <Button variant="primary" onClick={() => handleSaveDataAllCode()}>
          {state.isHaveInfo ? `${t("button.update")}` : `${t("button.create")}`}
        </Button>
      </div>
    </div>
  );
};

export default AllcodeManage;
