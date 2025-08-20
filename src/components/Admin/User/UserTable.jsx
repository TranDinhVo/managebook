import {
  Button,
  Col,
  Form,
  Input,
  message,
  notification,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import {
  callListUserAPI,
  deleteUserAPI,
  editUserAPI,
} from "../../../services/api.service";
import { IoReload } from "react-icons/io5";
import { CiImport } from "react-icons/ci";
import { CiExport } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import InputSearch from "./InputSearch";
import UserDetail from "./UserDetail";
import UserModalCreate from "./UserModalCreate";
import UserImport from "./data/UserImport";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import "../../../assets/styles/userTable.scss";
const UserTable = () => {
  const [pageSize, setPageSize] = useState(5);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(100);
  const [userData, setUserData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const [sortQuery, setSortQuery] = useState("");
  const [filter, setFilter] = useState("");

  const [userDetail, setUserDetail] = useState();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [form] = Form.useForm();
  const [editUserId, setEditUserId] = useState("");
  const isEditing = (record) => record._id === editUserId;
  const edit = (record) => {
    form.setFieldsValue(Object.assign({ fullName: "", phone: "" }, record));
    setEditUserId(record._id);
  };
  const [isModalImportOpen, setIsModalImportOpen] = useState(false);
  const fetchUser = async () => {
    setLoadingTable(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callListUserAPI(query);

    if (res && res.data) {
      setCurrent(+res.data.meta.current);
      setPageSize(+res.data.meta.pageSize);
      setTotal(res.data.meta.total);
      setUserData(res.data.result);
    }
    setLoadingTable(false);
  };

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, sortQuery, filter]);

  const handleOnChangePagi = (pagination, filters, sorter, extra) => {
    if (
      pagination &&
      pagination.pageSize &&
      +pagination.pageSize !== +pageSize
    ) {
      setPageSize(+pagination.pageSize);
      setCurrent(1);
    }

    if (pagination && pagination.current && +pagination.current !== +current) {
      setCurrent(+pagination.current);
    }
    // console.log(">>>", pagination, filters, sorter, extra);
    if (sorter && sorter.order) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      if (q) setSortQuery(q);
    }
  };
  const handleExport = () => {
    if (userData.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(userData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportUser.xlsx");
    }
  };
  const renderTitle = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <span style={{ fontSize: "20px" }}>Bảng Danh sách người dùng</span>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "10px",
            }}
          >
            <Button type="primary" onClick={() => handleExport()}>
              <CiExport />
              Export
            </Button>
            <Button type="primary" onClick={() => setIsModalImportOpen(true)}>
              <CiImport /> Import
            </Button>
            <Button type="primary" onClick={() => setIsCreateOpen(true)}>
              <IoMdAdd />
              Thêm mới
            </Button>
            <Button
              type="ghost"
              onClick={() => {
                setFilter(""), setSortQuery("");
              }}
            >
              <IoReload />
            </Button>
          </div>
        </div>
      </>
    );
  };
  const handleDeleteUser = async (id) => {
    const res = await deleteUserAPI(id);
    if (res && res.data) {
      notification.success({
        message: "Xóa Người Dùng",
        description: "Thành công!",
      });
      await fetchUser();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: JSON.stringify(res.message),
      });
    }
  };

  const EditableCell = (_a) => {
    var {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = _a;
    // restProps = __rest(_a, [
    //   "editing",
    //   "dataIndex",
    //   "title",
    //   "inputType",
    //   "record",
    //   "index",
    //   "children",
    // ]);
    const inputNode = <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const columns = [
    {
      title: "STT",
      key: "STT",
      render: (_, __, index) => <>{(current - 1) * pageSize + (index + 1)}</>,
    },
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      render: (text, record) => (
        <a
          href="#"
          onClick={() => {
            setUserDetail(record);
            setIsDetailOpen(true);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Họ Tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
      editable: true,
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
      sorter: true,
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },

    {
      title: "Hành động",
      key: "action",
      render: (record) => {
        const editable = isEditing(record);
        return (
          <>
            <Space>
              {editable ? (
                <span>
                  <Typography.Link
                    onClick={() => save(record.key)}
                    style={{ marginInlineEnd: 8 }}
                  >
                    Lưu
                  </Typography.Link>
                  <Popconfirm
                    title="Chắc chắn hủy?"
                    onConfirm={() => setEditUserId("")}
                  >
                    <a>Hủy</a>
                  </Popconfirm>
                </span>
              ) : (
                <>
                  <Popconfirm
                    title="Xóa"
                    description="Có chắc chắn là xóa?"
                    onConfirm={() => handleDeleteUser(record._id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <DeleteOutlined style={{ color: "red" }} />
                  </Popconfirm>
                  <Typography.Link
                    disabled={editUserId !== ""}
                    onClick={() => edit(record)}
                  >
                    <EditOutlined style={{ color: "rgba(244, 190, 29, 1)" }} />
                  </Typography.Link>
                </>
              )}
            </Space>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return Object.assign(Object.assign({}, col), {
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    });
  });
  const save = async (key) => {
    const row = await form.validateFields();
    const { fullName, phone } = row;
    const res = await editUserAPI(editUserId, fullName, phone);
    if (res && res.data) {
      message.success("Cập nhật thành công");
      fetchUser();
      setEditUserId("");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: JSON.stringify(res.message),
      });
    }
  };
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch setFilter={setFilter} />
        </Col>
        <Col span={24}>
          <Form form={form} component={false}>
            <Table
              title={renderTitle}
              // columns={columns}
              columns={mergedColumns}
              components={{
                body: { cell: EditableCell },
              }}
              rowClassName="editable-row"
              dataSource={userData}
              rowKey={"_id"}
              onChange={handleOnChangePagi}
              loading={loadingTable}
              pagination={{
                total: total,
                current: current,
                pageSize: pageSize,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} trên ${total} rows`,
              }}
            />
          </Form>
        </Col>
      </Row>

      <UserDetail
        userDetail={userDetail}
        setUserDetail={setUserDetail}
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
      />
      <UserModalCreate
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        fetchUser={fetchUser}
      />
      <UserImport
        isModalImportOpen={isModalImportOpen}
        setIsModalImportOpen={setIsModalImportOpen}
        fetchUser={fetchUser}
      />
    </>
  );
};

export default UserTable;
