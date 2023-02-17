import React, { memo } from "react";

import "../styles/InputSearch.scss";

const InputSearch = ({ placeholder, onSearch, icon, onClickSearch, onEnterKey }) => {
  return (
    <div className="input-search">
      <input type="text" placeholder={placeholder} onChange={onSearch} onKeyDown={onEnterKey} />
      {icon && (
        <span className="input-search__icon" onClick={onClickSearch}>
          {icon}
        </span>
      )}
    </div>
  );
};

export default memo(InputSearch);
