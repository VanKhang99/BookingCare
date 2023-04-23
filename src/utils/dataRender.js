import { path } from "../utils/constants";

export const headerNavList = [
  {
    id: 1,
    router: `/${path.SPECIALTIES}`,
  },
  {
    id: 2,
    router: `/${path.CLINIC}s`,
  },
  {
    id: 3,
    router: `/${path.DOCTOR}s`,
  },
  {
    id: 4,
    router: `/${path.PACKAGE}s`,
  },
];

export const placeholderArrayVi = [
  "Tìm lý do khám",
  "Tìm phòng khám - bệnh viện",
  "Tìm bác sĩ",
  "Tìm gói khám bệnh",
  "Tìm chuyên khoa",
];
export const placeholderArrayEn = [
  "Find a reason to check",
  "Find clinic - hospital",
  "Find a doctor",
  "Find medical packages",
  "Find a specialty",
];

export const heroServicesList = [
  {
    id: 1,
    image: "https://cdn.bookingcare.vn/fo/2021/12/08/133537-khamchuyenkhoa.png",
    router: "/specialties",
  },
  {
    id: 2,
    image: "https://cdn.bookingcare.vn/fo/2021/12/08/133657-khamtuxa.png",
    router: "/specialties/remote",
  },
  {
    id: 3,
    image: "https://cdn.bookingcare.vn/fo/2021/12/08/133744-khamtongquat.png",
    router: "/packages",
  },
  {
    id: 4,
    image: "https://cdn.bookingcare.vn/fo/2021/12/08/133744-dichvuxetnghiem.png",
    router: "/medical-test",
  },
  {
    id: 5,
    image: "https://cdn.bookingcare.vn/fo/2021/12/08/133744-suckhoetinhthan.png",
    router: "/mental-health",
  },
  // {
  //   id: 6,
  //   image: "https://cdn.bookingcare.vn/fo/2022/05/19/104635-khamnhakhoa.png",
  //   router: "/dental",
  // },
  // {
  //   id: 7,
  //   image: "https://cdn.bookingcare.vn/fo/2022/05/16/151930-phau-thuat.jpg",
  //   router: "/package-surgery",
  // },
  {
    id: 8,
    image: "https://cdn.bookingcare.vn/fo/2021/12/08/133744-khamtainha.png",
    router: "/medical-product",
  },
  {
    id: 9,
    image: "https://cdn.bookingcare.vn/fo/2023/04/12/160542-icon-bai-test-suc-khoe.png",
    router: "/health-test",
  },
];

export const healthTestList = [
  {
    id: 1,
    imageItem:
      "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F04%2F17%2F155549-1.png&w=1920&q=75",
    nameVi: "Bài Test đánh giá trầm cảm BECK",
    nameEN: "BECK Depression Assessment Test",
    testType: "BECK",
  },
  {
    id: 2,
    imageItem:
      "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F04%2F17%2F155457-2.png&w=1920&q=75",
    nameVi: "Bài Test đánh giá rối loạn ZUNG",
    nameEN: "ZUNG Anxiety Assessment Test",
    testType: "ZUNG",
  },
  {
    id: 3,
    imageItem:
      "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F04%2F17%2F155557-3.png&w=1920&q=75",
    nameVi: "Bài Test đánh giá mức độ trầm cảm sau sinh EPDS",
    nameEN: "EPDS . Postpartum Depression Test",
    testType: "EPDS",
  },
  {
    id: 1,
    imageItem:
      "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F04%2F17%2F155603-4.png&w=1920&q=75",
    nameVi: "Bài Test đánh giá Lo âu - Trầm cảm - Stress (DASS 21)",
    nameEN: "Anxiety - Depression - Stress Assessment Test (DASS 21)",
    testType: "DASS",
  },
];
