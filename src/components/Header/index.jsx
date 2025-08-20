import {
  Avatar,
  Badge,
  Button,
  Col,
  Drawer,
  Dropdown,
  Input,
  Menu,
  message,
  Popover,
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
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { callLogout } from "../../services/api.service";
import { doLogoutAction } from "../../redux/account/accountSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openBar, setOpenBar] = useState(false);
  const [current, setCurrent] = useState("1");
  const carts = useSelector((state) => state.order.carts);

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const fullName = user.fullName;
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

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
      label: <label style={{ cursor: "pointer" }}>Quản lý tài khoản</label>,
    },
    {
      key: "logout",
      label: (
        <label style={{ cursor: "pointer" }} onClick={handleLogout}>
          Đăng xuất
        </label>
      ),
      icon: <IoLogOutOutline />,
    },
  ];
  if (user?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }
  const contentCarts = () => {
    return (
      <>
        {carts && (
          <>
            <div className="popover-carts">
              {carts.map((item) => {
                return (
                  <div className="popover-carts__item" key={item._id}>
                    <div className="popover-carts__item--left">
                      <div className="popover-carts__image">
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/book/${item.detail.thumbnail}`}
                          alt={`${item.detail.mainText}`}
                        />
                      </div>
                      <div className="popover-carts__name">
                        {item.detail.mainText}
                      </div>
                    </div>
                    <div className="popover-carts__price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.detail.price ?? 0)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="popover-carts__footer">
              <div>a</div>
              <Button
                className="popover-carts__button--btn2"
                onClick={() => navigate("/order")}
              >
                Xem giỏ hàng
              </Button>
            </div>
          </>
        )}
      </>
    );
  };
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
                  <Avatar src={urlAvatar} />
                  {fullName}
                </Space>
              </a>
            </Dropdown>
          ) : (
            <span onClick={() => navigate("/login")}>Tài Khoản</span>
          )}
        </Col>
        <Col className="header__shop" xs={4} sm={3} md={2} lg={2}>
          <Popover
            placement="bottomRight"
            title="Sản phẩm mới thêm"
            content={contentCarts}
          >
            <Badge count={carts?.length ?? 0} size="middle" showZero>
              <AiOutlineShoppingCart size={30} color="#2abce9" />
            </Badge>
          </Popover>
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
