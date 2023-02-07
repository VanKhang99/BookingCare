import React from "react";
import { MdNavigateNext } from "react-icons/md";

const NextArrow = (props) => {
  const { className, onClick, currentSlide, slideCount, slidesToShow } = props;
  return (
    <>
      {currentSlide !== slideCount - slidesToShow && (
        <button className={className} onClick={onClick}>
          <MdNavigateNext />
        </button>
      )}
    </>
  );
};

export default NextArrow;
