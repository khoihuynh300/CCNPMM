import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { WrapperUploadFile } from "./style";
import { getBase64, isNumeric } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as productService from "../../services/productService";
import { useQuery } from "@tanstack/react-query";
import { renderOptions } from "../../utils";
import { useSelector } from "react-redux";

const ProductManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const user = useSelector((state) => state?.user);

  const initial = () => ({
    name: "",
    price: "",
    description: "",
    image: "",
    type: "",
    countInStock: "",
    newType: "",
    discount: "",
  });
  const [stateProduct, setStateProduct] = useState(initial());
  const [stateProductDetails, setStateProductDetails] = useState(initial());

  const [createProductForm] = Form.useForm();
  const [updateProductForm] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const { name, price, description, image, type, countInStock, discount } = data;
    const res = productService.createProduct(
      {
        name,
        price,
        description,
        image,
        type,
        countInStock,
        discount,
      },
      user?.access_token
    );
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = productService.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = productService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = productService.deleteManyProduct(ids, token);
    return res;
  });

  const { data, error, isPending, isSuccess, isError } = mutation;
  const {
    data: dataUpdate,
    error: errorUpdate,
    isPending: isPendingUpdate,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isPending: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    isPending: isLoadingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const getAllProducts = async () => {
    const res = await productService.getAllProduct();
    return res;
  };

  const getDetailsProduct = async (rowSelected) => {
    const res = await productService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
      });
    }
  };

  const getAllTypeProduct = async () => {
    const res = await productService.getAllTypeProduct();
    return res;
  };
  const queryProduct = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  const typeProduct = useQuery({ queryKey: ["type-product"], queryFn: getAllTypeProduct });
  const { isPending: isLoadingProducts, data: products } = queryProduct;

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      getDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    updateProductForm.setFieldsValue(stateProductDetails);
  }, [updateProductForm, stateProductDetails]);

  useEffect(() => {
    if (isSuccess) {
      if (data?.status === "OK") {
        message.success("Tạo sản phẩm thành công");
        handleCancel();
      } else {
        message.error(data.message);
      }
    } else if (isError) {
      console.log(error);
      message.error("Lỗi");
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccessUpdate) {
      if (dataUpdate?.status === "OK") {
        message.success("Cập nhật sản phẩm thành công");
      } else {
        message.error(dataUpdate.message);
      }
    } else if (isErrorUpdate) {
      console.log(error);
      message.error("Lỗi");
    }
  }, [isSuccessUpdate, isErrorUpdate]);

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "OK") {
      message.success("Đã xóa sản phẩm");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Lỗi");
    }
  }, [isSuccessDelected, isErrorDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success("Xóa thành công");
    } else if (isErrorDeletedMany) {
      message.error("Lỗi");
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany]);

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text) => `${text.toLocaleString()}đ`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      image: "",
      type: "",
      countInStock: "",
      discount: "",
    });
    createProductForm.resetFields();
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      image: stateProduct.image,
      type: stateProduct.type === "add_type" ? stateProduct.newType : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };

  const handleChangeSelectTypeDetail = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      type: value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };

  const dataTable = products?.data.map((item) => {
    return { ...item, key: item._id };
  });

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateProduct = () => {
    const params = {
      name: stateProductDetails.name,
      price: stateProductDetails.price,
      description: stateProductDetails.description,
      image: stateProductDetails.image,
      type:
        stateProductDetails.type === "add_type"
          ? stateProductDetails.newType
          : stateProductDetails.type,
      countInStock: stateProductDetails.countInStock,
      discount: stateProductDetails.discount,
    };
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...params },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  return (
    <div>
      <h2>Quản lý sản phẩm</h2>
      <div>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          data={dataTable}
          columns={columns}
          handleDeleteMany={handleDeleteManyProducts}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <Modal
        forceRender
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          autoComplete="on"
          form={createProductForm}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
          >
            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Nhập loại sản phẩm" }]}
          >
            <Select
              name="type"
              value={stateProduct.type}
              onChange={handleChangeSelect}
              options={renderOptions(typeProduct?.data?.data)}
            />
          </Form.Item>
          {stateProduct.type === "add_type" && (
            <Form.Item
              label="New type"
              name="newType"
              rules={[{ required: true, message: "Nhập loại sản phẩm" }]}
            >
              <InputComponent
                value={stateProduct.newType}
                onChange={handleOnchange}
                name="newType"
              />
            </Form.Item>
          )}
          <Form.Item
            label="Count inStock"
            name="countInStock"
            rules={[{ required: true, message: "Nhập số lượng trong kho" }]}
          >
            <InputComponent
              value={stateProduct.countInStock}
              onChange={handleOnchange}
              name="countInStock"
            />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: "Nhập giá" }]}>
            <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <InputComponent
              value={stateProduct.description}
              onChange={handleOnchange}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Discount (%)"
            name="discount"
            rules={[
              { required: true, message: "Nhập giảm giá" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const discount = getFieldValue("discount");
                  if (!isNumeric(discount) || discount < 0 || discount > 99) {
                    return Promise.reject("discount must be in range 0 to 99");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputComponent
              value={stateProduct.discount}
              onChange={handleOnchange}
              name="discount"
            />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Chọn hình ảnh cho sản phẩm" }]}
          >
            <WrapperUploadFile
              beforeUpload={() => {
                return false;
              }}
              onChange={handleOnchangeAvatar}
              maxCount={1}
            >
              <Button>Select File</Button>
              {stateProduct?.image && (
                <img
                  src={stateProduct?.image}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "5px",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="product"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Chi tiết sản phẩm"
        open={isOpenDrawer}
        placemen="right"
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Form
          name="updateProduct"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          onFinish={onUpdateProduct}
          autoComplete="on"
          form={updateProductForm}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
          >
            <InputComponent
              value={stateProductDetails.name}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Nhập loại sản phẩm" }]}
          >
            <Select
              name="type"
              value={stateProductDetails.type}
              onChange={handleChangeSelectTypeDetail}
              options={renderOptions(typeProduct?.data?.data)}
            />
          </Form.Item>
          {stateProductDetails.type === "add_type" && (
            <Form.Item
              label="New type"
              name="newType"
              rules={[{ required: true, message: "Nhập loại sản phẩm" }]}
            >
              <InputComponent
                value={stateProductDetails.newType}
                onChange={handleOnchangeDetails}
                name="newType"
              />
            </Form.Item>
          )}
          <Form.Item
            label="Count inStock"
            name="countInStock"
            rules={[{ required: true, message: "Nhập số lượng trong kho" }]}
          >
            <InputComponent
              value={stateProductDetails.countInStock}
              onChange={handleOnchangeDetails}
              name="countInStock"
            />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: "Nhập giá" }]}>
            <InputComponent
              value={stateProductDetails.price}
              onChange={handleOnchangeDetails}
              name="price"
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <InputComponent
              value={stateProductDetails.description}
              onChange={handleOnchangeDetails}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: "Please input your rating!" }]}
          >
            <InputComponent
              value={stateProductDetails.rating}
              onChange={handleOnchangeDetails}
              name="rating"
              disabled
            />
          </Form.Item>
          <Form.Item
            label="Discount (%)"
            name="discount"
            rules={[
              { required: true, message: "Nhập giảm giá" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const discount = getFieldValue("discount");
                  if (!isNumeric(discount) || discount < 0 || discount > 99) {
                    return Promise.reject("discount must be in range 0 to 99");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputComponent
              value={stateProductDetails.discount}
              onChange={handleOnchangeDetails}
              name="discount"
            />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Chọn hình ảnh cho sản phẩm" }]}
          >
            <WrapperUploadFile
              beforeUpload={() => {
                return false;
              }}
              onChange={handleOnchangeAvatarDetails}
              maxCount={1}
            >
              <Button>Select File</Button>
              {stateProductDetails?.image && (
                <img
                  src={stateProductDetails?.image}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "5px",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="product"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <div>Bạn có chắc xóa sản phẩm này không?</div>
      </Modal>
    </div>
  );
};

export default ProductManagement;
