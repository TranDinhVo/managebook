import { Button, Col, notification, Popconfirm, Row, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { CiExport } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { callListBookAPI, deleteBookAPI } from "../../../services/api.service";
import moment from "moment";
import InputSearchBook from "./InputSearchBook";
import BookModalDetail from "./BookModalDetail";
import BookModalCreate from "./BookModalCreate";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import BookModalUpdate from "./BookModalUpdate";
import * as XLSX from "xlsx";
const BookTable = () => {
  const [pageSize, setPageSize] = useState(5);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(100);
  const [bookData, setBookData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [bookDetail, setBookDetail] = useState();
  const [isDetailBookOpen, setIsDetailBookOpen] = useState(false);

  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);

  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [bookUpdate, setBookUpdate] = useState({});
  const fetchBook = async () => {
    setLoadingTable(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callListBookAPI(query);

    if (res && res.data) {
      setCurrent(+res.data.meta.current);
      setPageSize(+res.data.meta.pageSize);
      setTotal(res.data.meta.total);
      setBookData(res.data.result);
    }
    setLoadingTable(false);
  };
  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filter, sortQuery]);
  const handleExport = () => {
    if (bookData.length > 0) {
      const dataExport = bookData.map((item) => {
        return {
          "Tên sách": item.mainText,
          "Thể loại": item.category,
          "Tên tác giả": item.author,
          Giá: item.price,
          "Sô lượng": item.quantity,
          "Sô sách đã bán": item.sold,
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(dataExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportBook.xlsx");
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
          <span style={{ fontSize: "20px" }}>Bảng Danh sách Sách</span>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "10px",
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                handleExport();
              }}
            >
              <CiExport />
              Export
            </Button>
            <Button type="primary" onClick={() => setIsModalOpenCreate(true)}>
              <IoMdAdd />
              Thêm mới
            </Button>
            <Button
              type="ghost"
              onClick={() => {
                // setFilter(""), setSortQuery("");
              }}
            >
              <IoReload />
            </Button>
          </div>
        </div>
      </>
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
          // href="#"
          onClick={() => {
            setBookDetail(record);
            setIsDetailBookOpen(true);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Tên Sách",
      dataIndex: "mainText",
      key: "mainText",
      sorter: true,
      editable: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      key: "category",
      sorter: true,
      editable: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      sorter: true,
      editable: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (text) => {
        if (text)
          return new Intl.NumberFormat("vi-Vn", {
            style: "currency",
            currency: "VND",
          }).format(text);
      },
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => {
        return <>{moment(text).format("DD-MM-YYYY hh:mm:ss")}</>;
      },
      sorter: true,
      editable: true,
    },
    {
      title: "Hành động",
      key: "action",
      render: (record) => {
        return (
          <Space>
            <Popconfirm
              title="Xóa"
              description="Có chắc chắn là xóa?"
              onConfirm={() => handleDeleteBook(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <DeleteOutlined style={{ color: "red" }} />
            </Popconfirm>
            <EditOutlined
              style={{ color: "rgba(244, 190, 29, 1)" }}
              onClick={() => {
                setBookUpdate(record);
                setIsModalOpenUpdate(true);
              }}
            />
          </Space>
        );
      },
    },
  ];
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
  const handleDeleteBook = async (id) => {
    const res = await deleteBookAPI(id);
    if (res && res.data) {
      notification.success({
        message: "Xóa Sách",
        description: "Thành công!",
      });
      await fetchBook();
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
          <InputSearchBook setFilter={setFilter} />
        </Col>
        <Col span={24}>
          {/* <Form form={form} component={false}> */}
          <Table
            title={renderTitle}
            columns={columns}
            //   columns={mergedColumns}
            //   components={{
            //     body: { cell: EditableCell },
            //   }}
            //   rowClassName="editable-row"
            dataSource={bookData}
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
          {/* </Form> */}
        </Col>
      </Row>
      <BookModalDetail
        bookDetail={bookDetail}
        setBookDetail={setBookDetail}
        isDetailBookOpen={isDetailBookOpen}
        setIsDetailBookOpen={setIsDetailBookOpen}
      />
      <BookModalCreate
        isModalOpenCreate={isModalOpenCreate}
        setIsModalOpenCreate={setIsModalOpenCreate}
        fetchBook={fetchBook}
      />
      <BookModalUpdate
        isModalOpenUpdate={isModalOpenUpdate}
        setIsModalOpenUpdate={setIsModalOpenUpdate}
        bookUpdate={bookUpdate}
        setBookUpdate={setBookUpdate}
        fetchBook={fetchBook}
      />
    </>
  );
};
export default BookTable;
