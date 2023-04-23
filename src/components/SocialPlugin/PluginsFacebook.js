import React, { useEffect } from "react";

const PluginsFacebook = ({ link }) => {
  const initFacebookSDK = () => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
    let locale = "vi_VN";
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: +process.env.REACT_APP_FACEBOOK_APP_ID, // You App ID
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: "v2.5", // use version 2.1
      });
    };
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = `//connect.facebook.net/${locale}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  };

  useEffect(() => {
    initFacebookSDK();
  }, []);
  return (
    <>
      <div className="plugins">
        <div className="like-share" style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
          <div
            className="fb-like"
            data-href="https://bookingcare2023.vercel.app"
            data-width=""
            data-layout="button_count"
            data-action="like"
            data-size="small"
            data-share="false"
            style={{ marginTop: "10px" }}
          ></div>

          <div
            className="fb-share-button"
            data-href="https://bookingcare2023.vercel.app"
            data-layout="button_count"
          ></div>
        </div>

        <div className="comments">
          <div
            className="fb-comments"
            data-href="https://bookingcare2023.vercel.app"
            data-width="100%"
            data-numposts="1"
          ></div>
        </div>
      </div>
    </>
  );
};

export default PluginsFacebook;
