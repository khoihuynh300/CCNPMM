import HomePage from "../pages/HomePage/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

const routes = [
  {
    path: "/",
    component: HomePage,
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
    path: "*",
    component: NotFoundPage,
  },
];

export default routes;
