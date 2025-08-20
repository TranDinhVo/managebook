import { Avatar, Col, Dropdown, Layout, Menu, message, Row, Space } from "antd";
const { Content, Footer, Sider } = Layout;
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router";
import { MdOutlineDashboard } from "react-icons/md";
import { FaBars, FaRegUser } from "react-icons/fa";
import { LuBookCopy } from "react-icons/lu";
import { UserOutlined } from "@ant-design/icons";
import { BiCoinStack } from "react-icons/bi";
import { IoLogOutOutline } from "react-icons/io5";
import { callLogout } from "../../services/api.service";
import { doLogoutAction } from "../../redux/account/accountSlice";
const LayoutAdmin = () => {
  // const isAdminRoute = window.location.pathname.startsWith("/admin");
  // const user = useSelector((state) => state.account.user);
  // const userRole = user.role;
  // return (
  //   <>
  //     <div
  //       className="layout-app"
  //       style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
  //     >
  //       <div style={{ flex: "1", overflow: "auto" }}>
  //         <Outlet />
  //       </div>
  //     </div>
  //   </>
  // );
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res?.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };
  const itemsMenu = [
    {
      label: <Link to="/admin">Dashboard</Link>,
      key: "dashboard",
      icon: <MdOutlineDashboard />,
    },
    {
      label: "Manage Users",
      key: "users",
      icon: <FaRegUser />,
      children: [
        {
          label: <Link to="/admin/user">CRUD</Link>,
          key: "crud",
          icon: <UserOutlined />,
        },
        {
          label: "ABC",
          key: "abc",
          icon: <UserOutlined />,
        },
      ],
    },
    {
      label: <Link to="/admin/book">Manage Books</Link>,
      key: "books",
      icon: <LuBookCopy />,
    },
    {
      label: "Manage Orders",
      key: "orders",
      icon: <BiCoinStack />,
    },
  ];

  const items = [
    {
      key: "manage",
      label: <label style={{ cursor: "pointer" }}>Quản lý tài khoản</label>,
    },
    {
      label: <Link to="/">Trang chủ</Link>,
      key: "home",
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

  const user = useSelector((state) => state.account.user);
  const role = user.role;
  const fullName = user.fullName;
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {role == "ADMIN" && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
        >
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Admin</h2>
          <Menu
            theme="light"
            defaultSelectedKeys={["dashboard"]}
            mode="inline"
            items={itemsMenu}
          />
        </Sider>
      )}

      <Layout>
        {role == "ADMIN" && (
          <header
            style={{
              padding: "14px 0px",
              background: "#ddd",
              margin: 0,
            }}
          >
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 30px",
              }}
              gutter={[20, 20]}
            >
              <Col>
                <FaBars
                  size={25}
                  style={{ cursor: "pointer" }}
                  onClick={() => setCollapsed(!collapsed)}
                />
              </Col>
              <Col>
                <Dropdown menu={{ items }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar src={urlAvatar} />
                      {fullName}
                    </Space>
                  </a>
                </Dropdown>
              </Col>
            </Row>
          </header>
        )}

        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
        {role == "ADMIN" && (
          <Footer style={{ textAlign: "center", background: "#ddd" }}>
            Copy right © Designed by Tial 2025
          </Footer>
        )}
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;
