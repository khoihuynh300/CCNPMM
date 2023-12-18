import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Divider, Drawer, Form, Input, Modal, Select, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { WrapperUploadFile } from "./style";
import { getBase64, isNumeric } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as productService from "../../services/productService";
import * as categoryService from "../../services/categoryService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const renderOptions = (categories) => {
  let results = [];
  if (categories) {
    results = categories?.map((category) => {
      return {
        value: category._id,
        label: category.name,
      };
    });
  }
  return results;
};

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
    category: "",
    countInStock: "",
    discount: "",
  });
  const [stateProduct, setStateProduct] = useState(initial());
  const [stateProductDetails, setStateProductDetails] = useState(initial());
  const [stateCategoryName, setStateCategoryName] = useState("");

  const [createProductForm] = Form.useForm();
  const [updateProductForm] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const { name, price, description, image, category, countInStock, discount } = data;
    const res = productService.createProduct(
      {
        name,
        price,
        description,
        image,
        category,
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

  const mutationCategory = useMutationHooks((name) => {
    const res = categoryService.createCategory(name, user?.access_token);
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
        category: res?.data?.category?._id,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
      });
    }
  };

  const getAllCategory = async () => {
    const res = await categoryService.getAllCategory();
    return res;
  };
  const queryProduct = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  const categories = useQuery({ queryKey: ["categories"], queryFn: getAllCategory });
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
          display: "flex",
          gap: "4px",
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 40,
            height: 30,
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const renderCategoryFilter = () => {
    let filter = []
    categories?.data?.data?.forEach(category => {
      filter = [...filter, {
        text: category.name,
        value: category.name,
      }]
    });
    return filter;
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (text) => `${text.toLocaleString()}đ`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Còn lại",
      dataIndex: "countInStock",
      sorter: (a, b) => a.countInStock - b.countInStock,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      filters: renderCategoryFilter(),
      onFilter: (value, record) => record.category === value,
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
      category: "",
      countInStock: "",
      discount: "",
    });
    createProductForm.resetFields();
  };

  const onFinish = () => {
    mutation.mutate(stateProduct, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const onFinishCategory = () => {
    mutationCategory.mutate(stateCategoryName, {
      onSettled: () => {
        categories.refetch();
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
      category: value,
    });
  };

  const handleChangeSelectTypeDetail = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      category: value,
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
    return { ...item, key: item._id, category: item.category?.name };
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
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateProductDetails },
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

  const filterOptionCategory = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
          >
            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Nhập danh mục sản phẩm" }]}
          >
            <Select
              name="category"
              value={stateProduct.category}
              onChange={handleChangeSelect}
              options={renderOptions(categories?.data?.data)}
              showSearch
              filterOption={filterOptionCategory}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider
                    style={{
                      margin: "8px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <Input
                      placeholder="Nhập tên danh mục mới"
                      value={stateCategoryName}
                      onChange={(e) => {
                        setStateCategoryName(e.target.value);
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={onFinishCategory}>
                      Thêm category
                    </Button>
                  </Space>
                </>
              )}
            />
          </Form.Item>
          <Form.Item
            label="còn lại"
            name="countInStock"
            rules={[{ required: true, message: "Nhập số lượng trong kho" }]}
          >
            <InputComponent
              value={stateProduct.countInStock}
              onChange={handleOnchange}
              name="countInStock"
            />
          </Form.Item>
          <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Nhập giá" }]}>
            <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <InputComponent
              value={stateProduct.description}
              onChange={handleOnchange}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Giảm giá (%)"
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
            label="Ảnh"
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
            label="Tên sản phẩm"
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
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Nhập danh mục sản phẩm" }]}
          >
            <Select
              name="category"
              value={stateProductDetails.category}
              onChange={handleChangeSelectTypeDetail}
              options={renderOptions(categories?.data?.data)}
              showSearch
              filterOption={filterOptionCategory}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider
                    style={{
                      margin: "8px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <Input
                      placeholder="Nhập tên danh mục mới"
                      value={stateCategoryName}
                      onChange={(e) => {
                        setStateCategoryName(e.target.value);
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={onFinishCategory}>
                      Thêm category
                    </Button>
                  </Space>
                </>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Còn lại"
            name="countInStock"
            rules={[{ required: true, message: "Nhập số lượng trong kho" }]}
          >
            <InputComponent
              value={stateProductDetails.countInStock}
              onChange={handleOnchangeDetails}
              name="countInStock"
            />
          </Form.Item>
          <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Nhập giá" }]}>
            <InputComponent
              value={stateProductDetails.price}
              onChange={handleOnchangeDetails}
              name="price"
            />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <InputComponent
              value={stateProductDetails.description}
              onChange={handleOnchangeDetails}
              name="description"
            />
          </Form.Item>
          {/* <Form.Item
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
          </Form.Item> */}
          <Form.Item
            label="Giảm giá (%)"
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
            label="Ảnh"
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
