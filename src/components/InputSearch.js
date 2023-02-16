import React from "react";

import "../styles/InputSearch.scss";

const InputSearch = ({ placeholder, onSearch, icon }) => {
  return (
    <div className="input-search">
      <input type="text" placeholder={placeholder} onChange={onSearch} />
      {icon && <span className="input-search__icon">{icon}</span>}
    </div>
  );
};

export default InputSearch;
