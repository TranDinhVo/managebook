import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ContactPage from "./pages/contact";
import BookPage from "./pages/book";
import { Outlet } from "react-router";
import Home from "./components/Home/index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { callFetchAccount } from "./services/api.service";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound/index";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import UserTable from "./components/Admin/User/UserTable";
import BookTable from "./components/Admin/Book/BookTable";
import OrderPage from "./pages/order";

const Layout = () => {
  return (
    <>
      <div
        className="layout-app"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <div style={{ flex: "1" }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};
let router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "book/:id",
        element: <BookPage />,
      },
      {
        path: "/order",
        element: <OrderPage />,
      },
    ],
  },
  {
    path: "/asdasd",
    element: <div>Asdsd</div>,
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        element: <UserTable />,
      },
      {
        path: "book",
        element: <BookTable />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.account.isLoading);
  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;
    const res = await callFetchAccount();
    if (res && res?.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };
  useEffect(() => {
    getAccount();
  }, []);
  return (
    <>
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
