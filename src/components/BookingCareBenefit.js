import React from "react";
import HtmlReactParser from "html-react-parser";
import "../styles/BookingCareBenefit.scss";

const BookingCareBenefit = ({ html }) => {
  return (
    <div className="BC-benefit">
      <div className="BC-benefit-content">{HtmlReactParser(html)}</div>
    </div>
  );
};

export default BookingCareBenefit;
