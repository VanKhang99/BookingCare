import React from "react";
import "../../styles/Media.scss";

const Media = () => {
  return (
    <section className="media-container u-border-bottom">
      <div className="media-content u-wrapper">
        <div className="media">
          <div className="media-top">
            <h2>Truyền thông nói về BookingCare</h2>
          </div>

          <div className="media-body">
            <div className="video">
              <iframe
                width="570"
                height="321"
                src="https://www.youtube.com/embed/FyDQljKtWnI"
                title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <ul className="articles">
              <li className="article">
                <a
                  href="https://suckhoedoisong.vn/dat-lich-kham-benh-tiet-kiem-thong-minh-va-hieu-qua-169153232.htm"
                  target="_blank"
                  rel="noreferrer"
                  className="article-link"
                >
                  <div
                    className="img"
                    style={{
                      backgroundImage:
                        "url(https://bookingcare.vn/assets/truyenthong/suckhoedoisong.png)",
                    }}
                    title="Báo sức khỏe đời sống nói về BookingCare"
                  ></div>
                </a>
              </li>

              <li className="article">
                <a
                  href="https://vtv.vn/video/ca-phe-khoi-nghiep-14-11-2018-334894.htm"
                  target="_blank"
                  rel="noreferrer"
                  className="article-link"
                >
                  <div
                    className="img"
                    style={{
                      backgroundImage:
                        "url(https://bookingcare.vn/assets/truyenthong/vtv1.png)",
                    }}
                    title="VTV1 - Cà phê khởi nghiệp 14-11-2018"
                  ></div>
                </a>
              </li>

              <li className="article">
                <a
                  href="https://ictnews.vietnamnet.vn/kinh-doanh/doanh-nghiep/startup-bookingcare-chinh-thuc-ra-mat-phien-ban-di-dong-cua-nen-tang-ho-tro-dat-lich-kham-online-173512.ict"
                  target="_blank"
                  rel="noreferrer"
                  className="article-link"
                >
                  <div
                    className="img"
                    style={{
                      backgroundImage:
                        "url(https://bookingcare.vn/assets/truyenthong/ictnews.png)",
                    }}
                    title="Báo điện tử ictnews giới thiệu BookingCare"
                  ></div>
                </a>
              </li>

              <li className="article">
                <a
                  href="https://vtc.vn/dat-kham-chuyen-khoa-va-hanh-trinh-ho-tro-cac-benh-vien-qua-tai-ar434101.html"
                  target="_blank"
                  rel="noreferrer"
                  className="article-link"
                >
                  <div
                    className="img img-vtc-news"
                    style={{
                      backgroundImage:
                        "url(https://bookingcare.vn/assets/truyenthong/vtcnews.png)",
                    }}
                    title="VTC News nói về BookingCare"
                  ></div>
                </a>
              </li>

              <li className="article">
                <a
                  href="https://video.vnexpress.net/cuoc-song-4-0/kham-benh-khong-phai-xep-hang-o-ha-noi-3797126.html"
                  target="_blank"
                  rel="noreferrer"
                  className="article-link"
                >
                  <div
                    className="img"
                    style={{
                      backgroundImage:
                        "url(https://bookingcare.vn/assets/truyenthong/vnexpress.png)",
                    }}
                    title="VnExpress nói về BookingCare"
                  ></div>
                </a>
              </li>

              <li className="article">
                <a
                  href="https://www.youtube.com/watch?v=mstAc81lpMc"
                  target="_blank"
                  rel="noreferrer"
                  className="article-link"
                >
                  <div
                    className="img img-vtc"
                    style={{
                      backgroundImage:
                        "url(https://bookingcare.vn/assets/truyenthong/vtcgo.png)",
                    }}
                    title="VTC Go nói về BookingCare"
                  ></div>
                </a>
              </li>

              <li className="article">
                <a
                  href="https://ehealth.gov.vn/?action=News&newsId=46094"
                  target="_blank"
                  rel="noreferrer"
                  className="article-link"
                >
                  <div
                    className="img"
                    style={{
                      backgroundImage:
                        "url(https://bookingcare.vn/assets/truyenthong/cuc-cong-nghe-thong-tin-bo-y-te-2.png)",
                    }}
                    title="Cục công nghệ thông tin - Bộ Y tế nói về BookingCare"
                  ></div>
                </a>
              </li>

              <li className="article">
                <a
                  href="https://infonet.vietnamnet.vn/da-co-hon-20000-luot-benh-nhan-dat-lich-kham-qua-bookingcare-175080.html"
                  target="_blank"
                  rel="noreferrer"
                  className="article-link"
                >
                  <div
                    className="img"
                    style={{
                      backgroundImage:
                        "url(https://bookingcare.vn/assets/truyenthong/infonet.png)",
                    }}
                    title="Báo điện tử infonet nói về BookingCare"
                  ></div>
                </a>
              </li>

              <li className="article">
                <a
                  href="https://vtv.vn/video/ca-phe-khoi-nghiep-16-8-2018-317687.htm"
                  target="_blank"
                  rel="noreferrer"
                  className="article-link"
                >
                  <div
                    className="img"
                    style={{
                      backgroundImage:
                        "url(https://bookingcare.vn/assets/truyenthong/vtv1.png)",
                    }}
                    title="VTV1 - Cà phê khởi nghiệp 16-08-2018"
                  ></div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Media;
