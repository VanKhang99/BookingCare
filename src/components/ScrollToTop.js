import React, { useState, useEffect } from "react";
import { HiOutlineArrowSmUp } from "react-icons/hi";
import "../styles/ScrollToTop.scss";

const ScrollToTop = () => {
  const [scrollToTop, setScrollToTop] = useState(false);

  const handleShowToTop = () => {
    setScrollToTop(window.scrollY > 600);
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleShowToTop);
    return () => {
      window.removeEventListener("scroll", handleShowToTop);
    };
  }, []);

  return (
    <div className={`scroll-to-top ${scrollToTop ? "show" : "hide"}`} onClick={handleScrollToTop}>
      <HiOutlineArrowSmUp />
    </div>
  );
};

export default ScrollToTop;
