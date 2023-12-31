import { Table } from "antd";
import React, { useState } from "react";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data: dataSource = [],
    isLoading = false,
    columns = [],
    handleDeleteMany,
    enableCheckbox = true
  } = props;
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };
  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };

  return (
    <>
      { enableCheckbox && !!rowSelectedKeys.length && (
        <div
          style={{
            background: "#1d1ddd",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Xóa đã chọn
        </div>
      )}
      <Table
        rowSelection={enableCheckbox && {
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </>
  );
};

export default TableComponent;
