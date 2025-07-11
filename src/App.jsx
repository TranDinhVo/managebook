import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ContactPage from "./pages/contact";
import BookPage from "./pages/book";
import { Outlet } from "react-router";
import Home from './components/Home/index';
import Header from './components/Header';
import Footer from "./components/Footer";

const Layout = () => {
    return <>
      <div className="layout-app">
        <Header/>
        <Outlet/>
        <Footer/>
      </div>
    </>
  }
let router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    errorElement: <div>404 not found tial</div>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "contact",
        element: <ContactPage/>
      },
      {
        path: "book",
        element: <BookPage/>
      }
    ]
  },
  {
    path: "/login",
    element:<LoginPage/>
   
  },
    {
    path: "/register",
    element: <RegisterPage/>
   
  },
]);
export default function App() {
 
  

  return (
    <><RouterProvider router={router} /></>
  );
}
