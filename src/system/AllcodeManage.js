import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllCodes, getOneAllCode, createAllCode } from "../slices/allcodeSlice";
import { checkData } from "../utils/helpers";
import { IoReload } from "react-icons/io5";
import "./styles/AllcodeManage.scss";

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
      const propsKeyArr = Object.keys(state);
      const validateInputs = checkData(state, propsKeyArr);

      if (!validateInputs) throw new Error("Please fill out all fields!");

      const res = await dispatch(createAllCode(state));

      console.log(res);

      if (res?.payload?.status === "success") {
        setState({ ...initialState });
        keyMapRef.current.focus();
        toast.success("All-code data has been created into all-code table successfully!");
        return;
      } else if (res?.payload?.status === "error") {
        throw new Error(res.payload.message);
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
        // selectedType: typeSelected,
        selectedAllcode: allCodeSelected,
        oldSelectedAllcode: allCodeData.keyMap,
        // oldSelectedType: typeSelected.value,
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

  useEffect(() => {
    if (!_.isEmpty(state.selectedType)) {
      handleFetchAllcode(state.selectedType.value);
    } else {
      handleFetchAllcode("all");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedType]);

  console.log(state);

  return (
    <div className="allcode-manage container">
      <div className="u-main-title mt-3 text-center">Quản lý bảng Allcode</div>

      <div className="allcode-manage-content">
        <div className="package-type-created">
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
                placeholder="Chọn loại Allcode"
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
                placeholder="Chọn giá trị allcode"
              />
            </div>

            {/* {packagesType.length > 0 ? (
                <Select
                  value={state.selectedType}
                  onChange={(option) => {
                    handleInputs(option, "selectedType");
                    handleUpdatePackageType(option);
                  }}
                  options={handleInfoOptions(packagesType)}
                  placeholder={t("package-type-manage.place-holder")}
                />
              ) : (
                <p>Chưa có giá trị allcode nào được tạo</p>
              )} */}
          </div>
        </div>
      </div>

      <div className="allcode-inputs">
        <div className="row">
          <Form.Group className="mt-5 col-6" controlId="formKeyMap">
            <Form.Label className="allcode-inputs__label">Key Map</Form.Label>
            <Form.Control
              type="text"
              value={state.keyMap}
              onChange={(e, id) => handleInputsChange(e, "keyMap")}
            />
          </Form.Group>

          <Form.Group className="mt-5 col-6" controlId="formType">
            <Form.Label className="allcode-inputs__label">Type</Form.Label>
            <Form.Control
              type="text"
              value={state.type}
              onChange={(e, id) => handleInputsChange(e, "type")}
            />
          </Form.Group>

          <Form.Group className="mt-5 col-6" controlId="formValueEn">
            <Form.Label className="allcode-inputs__label">Value Vi</Form.Label>
            <Form.Control
              type="text"
              value={state.valueEn}
              onChange={(e, id) => handleInputsChange(e, "valueEn")}
            />
          </Form.Group>

          <Form.Group className="mt-5 col-6" controlId="formValueVi">
            <Form.Label className="allcode-inputs__label">Value Vi</Form.Label>
            <Form.Control
              type="text"
              value={state.valueVi}
              onChange={(e, id) => handleInputsChange(e, "valueVi")}
            />
          </Form.Group>
        </div>

        <div className="allcode-inputs__button mt-5 text-end">
          <Button variant="primary" onClick={() => handleSaveDataAllCode()}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllcodeManage;
