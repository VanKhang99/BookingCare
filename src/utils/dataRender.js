import { AiOutlineUser } from "react-icons/ai";
import { BiBook, BiClinic } from "react-icons/bi";
import { MdOutlineWorkOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { path } from "../utils/constants";

export const headerNavList = [
  {
    id: 1,
    router: "/specialty",
  },
  {
    id: 2,
    router: "/facilities",
  },
  {
    id: 3,
    router: "/doctors",
  },
  {
    id: 4,
    router: "/medical-package",
  },
];

export const bannerServicesList = [
  {
    id: 1,
    image: "https://cdn.bookingcare.vn/fo/2021/12/08/133537-khamchuyenkhoa.png",
    router: "/specialty",
  },
  {
    id: 2,
    image: "https://cdn.bookingcare.vn/fo/2021/12/08/133657-khamtuxa.png",
    router: "/remote-exam",
  },
  {
    id: 3,
    image: "https://cdn.bookingcare.vn/fo/2021/12/08/133744-khamtongquat.png",
    router: "/medical-package",
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
  {
    id: 6,
    image: "https://cdn.bookingcare.vn/fo/2022/05/19/104635-khamnhakhoa.png",
    router: "/dental",
  },
  {
    id: 7,
    image: "https://cdn.bookingcare.vn/fo/2022/05/16/151930-phau-thuat.jpg",
    router: "/package-surgery",
  },
  {
    id: 8,
    image: "https://cdn.bookingcare.vn/fo/2021/12/08/133744-khamtainha.png",
    router: "/medical-product",
  },
  {
    id: 9,
    image: "https://cdn.bookingcare.vn/fo/2022/07/29/101157-icon-lich-su.jpg",
    router: "/business-health",
  },
];

export const menuSystemHeader = {
  user: [
    {
      label: <Link to="user-manage">CRUD</Link>,
      key: "1",
      icon: <AiOutlineUser />,
      url: `/${path.SYSTEM}/user-manage`,
    },
    {
      label: <Link to="user-manage-redux">CRUD Redux</Link>,
      key: "2",
      icon: <AiOutlineUser />,
      url: `/${path.SYSTEM}/user-manage-redux`,
    },
    {
      label: <Link to="doctor-manage">Quản lý bác sĩ</Link>,
      key: "3",
      icon: <AiOutlineUser />,
      url: `/${path.SYSTEM}/doctor-manage`,
    },
    {
      label: <Link to="admin-manage">Quản lý admin</Link>,
      key: "4",
      icon: <AiOutlineUser />,
      url: `/${path.SYSTEM}/admin-manage`,
    },
  ],
  clinic: [
    {
      label: "Quản lý phòng khám",
      key: "1",
      icon: <BiClinic />,
    },
  ],
  specialty: [
    {
      label: "Quản lý chuyên khoa",
      key: "1",
      icon: <MdOutlineWorkOutline />,
    },
  ],
  handbook: [
    {
      label: "Quản lý cẩm nang",
      key: "1",
      icon: <BiBook />,
    },
  ],
};
