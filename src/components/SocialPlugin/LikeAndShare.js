import React from "react";
import PluginWrapper from "./PluginWrapper";

const LikeAndShare = ({ link }) => {
  console.log(link);
  return (
    <>
      <PluginWrapper>
        <div
          className="fb-like"
          data-href="https://developers.facebook.com/docs/plugins/"
          data-width=""
          data-layout="button_count"
          data-action="like"
          data-size="small"
          data-share="true"
        ></div>
      </PluginWrapper>
    </>
  );
};

export default LikeAndShare;
