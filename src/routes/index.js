import HomePage from "../pages/HomePage/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import TypeProductsPage from "../pages/TypeProductsPage/TypeProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";

const routes = [
  {
    path: "/",
    component: HomePage,
    showHeader: true,
  },
  {
    path: "/category/:type",
    component: TypeProductsPage,
    showHeader: true,
  },
  {
    path: "/order",
    component: OrderPage,
    showHeader: true,
  },
  {
    path: "/products",
    component: ProductsPage,
    showHeader: true,
  },
  {
    path: "/product-detail/:id",
    component: ProductDetailPage,
    showHeader: true,
  },
  {
    path: "/sign-in",
    component: SignInPage,
  },
  {
    path: "/sign-up",
    component: SignUpPage,
  },
  {
    path: "/profile",
    component: ProfilePage,
    showHeader: true,
  },
  {
    path: "/admin",
    component: AdminPage,
    showHeader: false,
    isPrivate: true,
  },
  {
    path: "*",
    component: NotFoundPage,
  },
];

export default routes;
