import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as categoryService from "../../services/categoryService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const CategoryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const user = useSelector((state) => state?.user);

  const initial = () => ({
    name: "",
    slug: "",
  });
  const [stateCategory, setStateCategory] = useState(initial());
  const [stateCategoryDetails, setStateCategoryDetails] = useState(initial());

  const [createCategoryForm] = Form.useForm();
  const [updateCategoryForm] = Form.useForm();

  const mutation = useMutationHooks((name) => {
    const res = categoryService.createCategory(name, user?.access_token);
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, name, token } = data;
    const res = categoryService.updateCategory(id, name, token);
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = categoryService.deleteCategory(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = categoryService.deleteManyCategory(ids, token);
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

  const getAllCategory = async () => {
    const res = await categoryService.getAllCategory();
    return res;
  };

  const getDetailCategory = async (rowSelected) => {
    const res = await categoryService.getCategoryDetail(rowSelected);
    if (res?.data) {
      setStateCategoryDetails({
        name: res?.data?.name,
        slug: res?.data?.slug,
      });
    }
  };

  const queryCategory = useQuery({ queryKey: ["categories"], queryFn: getAllCategory });
  const { isPending: isLoadingCategory, data: categories } = queryCategory;

  useEffect(() => {
    if (rowSelected && isModalUpdateOpen) {
      getDetailCategory(rowSelected);
    }
  }, [rowSelected, isModalUpdateOpen]);

  useEffect(() => {
    updateCategoryForm.setFieldsValue(stateCategoryDetails);
  }, [updateCategoryForm, stateCategoryDetails]);

  useEffect(() => {
    if (isSuccess) {
      if (data?.status === "OK") {
        message.success("Tạo danh mục thành công");
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
        message.success("Cập nhật danh mục thành công");
        handleCancelUpdate();
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
      message.success("Đã xóa danh mục");
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
          onClick={handleDetailsCategory}
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "slug",
      dataIndex: "slug",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateCategory({
      name: "",
      slug: "",
    });
    createCategoryForm.resetFields();
  };

  const handleCancelUpdate = () => {
    setIsModalUpdateOpen(false);
    setStateCategoryDetails({
      name: "",
      slug: "",
    });
    updateCategoryForm.resetFields();
  };

  const onFinish = () => {
    mutation.mutate(stateCategory.name, {
      onSettled: () => {
        queryCategory.refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStateCategory({
      ...stateCategory,
      [e.target.name]: e.target.value,
    });
  };

  const dataTable = categories?.data.map((item) => {
    return { ...item, key: item._id };
  });

  const handleDetailsCategory = () => {
    setIsModalUpdateOpen(true);
  };

  const handleOnchangeDetails = (e) => {
    setStateCategoryDetails({
      ...stateCategoryDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateCategory = () => {
    mutationUpdate.mutate(
      { id: rowSelected, name: stateCategoryDetails.name, token: user?.access_token },
      {
        onSettled: () => {
          queryCategory.refetch();
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteCategory = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryCategory.refetch();
        },
      }
    );
  };

  const handleDeleteManyCategories = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryCategory.refetch();
        },
      }
    );
  };

  return (
    <div>
      <h2>Quản lý danh mục</h2>
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
          handleDeleteMany={handleDeleteManyCategories}
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
        title="Tạo danh mục"
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
          form={createCategoryForm}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Nhập tên danh mục" }]}
          >
            <InputComponent value={stateCategory.name} onChange={handleOnchange} name="name" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        forceRender
        title="Cập nhật danh mục"
        open={isModalUpdateOpen}
        onCancel={handleCancelUpdate}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onUpdateCategory}
          autoComplete="on"
          form={updateCategoryForm}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Nhập tên danh mục" }]}
          >
            <InputComponent
              value={stateCategoryDetails.name}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item label="Slug" name="slug">
            <InputComponent
              style={{ background: "white", color: "#333" }}
              value={stateCategoryDetails.slug}
              name="slug"
              disabled
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xóa danh mục"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteCategory}
      >
        <div>Bạn có chắc xóa danh mục này không?</div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
