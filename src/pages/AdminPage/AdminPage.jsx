import React, { useState } from "react";
import {
  HomeOutlined,
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";

import HomeManagement from "../../components/HomeManagement/HomeManagement";
import UserManagement from "../../components/UserManagement/UserManagement";
import ProductManagement from "../../components/ProductManagement/ProductManagement";
import OrderManagement from "../../components/OrderManagement/OrderManagement";
import Sider from "antd/es/layout/Sider";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";

const items = [
  {
    key: "home",
    icon: <HomeOutlined />,
    children: "",
    label: "Trang chủ",
    type: "",
  },
  {
    key: "users",
    icon: <UserOutlined />,
    children: "",
    label: "Người dùng",
    type: "",
  },
  {
    key: "products",
    icon: <AppstoreOutlined />,
    children: "",
    label: "Sản phẩm",
    type: "",
  },
  {
    key: "orders",
    icon: <ShoppingCartOutlined />,
    children: "",
    label: "Đơn hàng",
    type: "",
  },
];

const AdminPage = () => {
  const [keySelected, setKeySelected] = useState(items[0].key);
  const onClickNavBar = ({ key }) => {
    setKeySelected(key);
  };

  const renderPage = (key) => {
    switch (key) {
      case items[0].key:
        return <HomeManagement />;
      case items[1].key:
        return <UserManagement />;
      case items[2].key:
        return <ProductManagement />;
      case items[3].key:
        return <OrderManagement />;
      default:
        return <HomeManagement />;
    }
  };

  return (
    <>
      <HeaderComponent isAdmin={true}/>
      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: "60px",
            bottom: 0,
          }}
          theme="light"
        >
          <Menu
            onClick={onClickNavBar}
            style={{
              height: "100%",
            }}
            defaultSelectedKeys={[items[0].key]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: 200,
            marginTop:60,
            background: "white",
            padding: 10
          }}
        >
          {renderPage(keySelected)}
        </Layout>
      </Layout>
    </>
  );
};

export default AdminPage;
