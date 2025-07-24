import {
  Badge,
  Col,
  Drawer,
  Dropdown,
  Input,
  Menu,
  message,
  Row,
  Space,
} from "antd";
import { BiLogoReact } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import "../../assets/styles/header.scss";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { callLogout } from "../../services/api.service";
import { doLogoutAction } from "../../redux/account/accountSlice";
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openBar, setOpenBar] = useState(false);
  const [current, setCurrent] = useState("1");
  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res?.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };
  const items = [
    {
      key: "sub1",
      label: "Quản lí tài khoản",
      // icon: <FaUserCog />,
      children: [
        { key: "1", label: "Option 1" },
        { key: "2", label: "Option 2" },
        { key: "3", label: "Option 3" },
        { key: "4", label: "Option 4" },
      ],
    },
    {
      key: "logout",
      label: <div onClick={handleLogout}>Đăng xuất</div>,
      icon: <IoLogOutOutline />,
    },
  ];
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const fullName = user.fullName;
  return (
    <>
      <Row className="header" gutter={[20, 20]}>
        <Col className="header__bar" xs={3} onClick={() => setOpenBar(true)}>
          <FaBars size={25} />
        </Col>
        <Col className="header__logo" xs={2} sm={3} md={3} lg={3}>
          <BiLogoReact size={50} color="#2abce9" />
          <span>Tial</span>
        </Col>
        <Col className="header__input" xs={17} sm={14} md={15} lg={17}>
          <Input
            prefix={<IoIosSearch size={30} color="#2abce9" />}
            placeholder="Hôm nay đọc gì?"
          />
        </Col>
        <Col className="header__account" xs={2} sm={4} md={3} lg={2}>
          {isAuthenticated === true ? (
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <span> Xin chào {fullName}</span>
                  {/* <DownOutlined /> */}
                </Space>
              </a>
            </Dropdown>
          ) : (
            <span onClick={() => navigate("/login")}>Tài Khoản</span>
          )}
        </Col>
        <Col className="header__shop" xs={4} sm={3} md={2} lg={2}>
          <Badge count={5} size="middle">
            <AiOutlineShoppingCart size={30} color="#2abce9" />
          </Badge>
        </Col>
      </Row>
      <Drawer
        title="Menu Chức năng"
        placement="left"
        width={400}
        onClose={() => setOpenBar(false)}
        open={openBar}
      >
        <Menu
          theme="light"
          onClick={(e) => setCurrent(e.key)}
          style={{ width: 256 }}
          defaultOpenKeys={["sub1"]}
          selectedKeys={[current]}
          mode="inline"
          items={items}
        />
      </Drawer>
    </>
  );
};
export default Header;
