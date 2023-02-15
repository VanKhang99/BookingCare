import React from "react";

import "../styles/InputSearch.scss";

const InputSearch = ({ placeholder, onSearch }) => {
  return (
    <div className="input-search">
      <input type="text" placeholder={placeholder} onChange={onSearch} />
    </div>
  );
};

export default InputSearch;
