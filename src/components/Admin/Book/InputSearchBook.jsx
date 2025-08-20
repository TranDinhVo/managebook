import { Button, Col, Form, Input, InputNumber, Row, Space } from "antd";
import { useState } from "react";

const InputSearchBook = (props) => {
  const { setFilter } = props;
  const [loadingSearch, setLoadingSearch] = useState(false);
  const onFinish = (values) => {
    setLoadingSearch(true);
    let query = "";
    if (values && values.mainText) {
      query += `&mainText=/${values.mainText}/i`;
    }
    if (values && values.category) {
      query += `&category=/${values.category}/i`;
    }
    if (values && values.author) {
      query += `&author=/${values.author}/i`;
    }
    if (values && values.price) {
      query += `&price=${values.price}`;
    }
    setFilter(query);
    setLoadingSearch(false);
  };
  return (
    <>
      <Form
        name="inputSearchBook"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item label="Tên Sách" name="mainText">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item label="Thể loại" name="category">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item label="Tác giả" name="author">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item label="Giá tiền" name="price">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\D/g, "")}
                addonAfter="đ"
                controls={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20, 20]}>
          <Col xs={8} sm={12} md={16} lg={20}></Col>
          <Col xs={16} sm={12} md={8} lg={4} style={{ marginLeft: "auto" }}>
            <Form.Item label={null}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loadingSearch}
                >
                  Tìm kiếm
                </Button>
                <Button htmlType="reset">Xóa</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default InputSearchBook;
