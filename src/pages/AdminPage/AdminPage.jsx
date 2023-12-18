import React, { useState } from "react";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";

import UserManagement from "../../components/UserManagement/UserManagement";
import ProductManagement from "../../components/ProductManagement/ProductManagement";
import OrderManagement from "../../components/OrderManagement/OrderManagement";
import CategoryManagement from "../../components/CategoryManagement/CategoryManagement";
import Sider from "antd/es/layout/Sider";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";

const keys = ["category", "users", "products", "orders"]
const items = [
  {
    key: keys[1],
    icon: <UserOutlined />,
    children: "",
    label: "Người dùng",
    type: "",
  },
  {
    key: keys[0],
    icon: <UnorderedListOutlined />,
    children: "",
    label: "Danh mục",
    type: "",
  },
  {
    key: keys[2],
    icon: <AppstoreOutlined />,
    children: "",
    label: "Sản phẩm",
    type: "",
  },
  {
    key: keys[3],
    icon: <ShoppingCartOutlined />,
    children: "",
    label: "Đơn hàng",
    type: "",
  },
];

const AdminPage = () => {
  const [keySelected, setKeySelected] = useState(keys[1]);
  const onClickNavBar = ({ key }) => {
    setKeySelected(key);
  };

  const renderPage = (key) => {
    switch (key) {
      case keys[0]:
        return <CategoryManagement />;
      case keys[1]:
        return <UserManagement />;
      case keys[2]:
        return <ProductManagement />;
      case keys[3]:
        return <OrderManagement />;
      default:
        return <UserManagement />;
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
