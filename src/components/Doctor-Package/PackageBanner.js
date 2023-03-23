import React from "react";
import { Filter } from "../../components";

const PackageBanner = ({ packageArr, dataFiltered, onFilteredData, categoryId }) => {
  return (
    <>
      <div className="packages-head-image">
        <h2 className="packages-head-image__title">GÓI KHÁM BỆNH</h2>
      </div>

      <div className="packages-filter">
        <Filter
          packageArr={packageArr}
          dataFiltered={dataFiltered}
          onFilteredData={onFilteredData}
          categoryId={categoryId}
        />
      </div>
    </>
  );
};

export default PackageBanner;
