import { Button, Table } from "antd";
import { IoMdAdd } from "react-icons/io";
import { RiSubtractFill } from "react-icons/ri";
import { useSelector } from "react-redux";

const OrderPage = () => {
  const carts = useSelector((state) => state.order.carts);

  const columns = [
    {
      title: "Sản phẩm",
      render: (text, record) => (
        <>
          <div className="table-order">
            <div className="table-order__image">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                  record.detail.thumbnail
                }`}
                alt={`${record.detail.mainText}`}
              />
            </div>
            <div>{record.detail.mainText}</div>
          </div>
        </>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: ["detail", "price"],
      render: (text) => (
        <div>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(text ?? 0)}
        </div>
      ),
    },
    {
      title: "số lượng",
      dataIndex: "quantity",
      render: (text, record) => (
        <div>
          <Button
          // className="book-detail__button--btn"
          // onClick={() => handleChangeButton("MINUS")}
          >
            <RiSubtractFill />
          </Button>
          <input
            // className="book-detail__input"
            value={text}
            // onChange={(e) => handleChangeInput(e.target.value)}
          />
          <Button
          // className="book-detail__button--btn"
          // onClick={() => handleChangeButton("PLUS")}
          >
            <IoMdAdd />
          </Button>
        </div>
      ),
    },
    {
      title: "số tiền",
      render: (text, record) => (
        <div>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(record.detail.price * record.quantity)}
        </div>
      ),
    },
    {
      title: "Thao tác",
      render: () => {
        return <>Xóa</>;
      },
    },
  ];
  return (
    <>
      <Table
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={carts}
      />
      ;
    </>
  );
};
export default OrderPage;
