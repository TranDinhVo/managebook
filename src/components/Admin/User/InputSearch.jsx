import { Button, Col, Form, Input, Row, Space } from "antd";
import { useState } from "react";

const InputSearch = (props) => {
  const { setFilter } = props;
  const [loadingSearch, setLoadingSearch] = useState(false);
  const onFinish = (values) => {
    setLoadingSearch(true);
    let query = "";
    if (values && values.fullName) {
      query += `&fullName=/${values.fullName}/i`;
    }
    if (values && values.email) {
      query += `&email=/${values.email}/i`;
    }
    if (values && values.phone) {
      query += `&phone=/${values.phone}/i`;
    }
    setFilter(query);
    setLoadingSearch(false);
  };
  return (
    <>
      <Form
        name="inputSearch"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Form.Item label="Tên" name="fullName">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Form.Item label="Số điện thoại" name="phone">
              <Input />
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
export default InputSearch;
