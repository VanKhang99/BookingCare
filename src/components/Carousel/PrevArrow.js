import React from "react";
import { MdNavigateBefore } from "react-icons/md";

const PrevArrow = (props) => {
  const { className, onClick, currentSlide } = props;
  return (
    <>
      {currentSlide !== 0 && (
        <button className={className} onClick={onClick}>
          <MdNavigateBefore />
        </button>
      )}
    </>
  );
};

export default PrevArrow;
