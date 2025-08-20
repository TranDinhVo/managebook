import { Divider, Form, Input, message, Modal, notification } from "antd";
import { useState } from "react";
import { createUserAPI } from "../../../services/api.service";

const UserModalCreate = (props) => {
  const { isCreateOpen, setIsCreateOpen, fetchUser } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const { fullName, phone, email, password } = values;
    setIsSubmit(true);
    const res = await createUserAPI(fullName, email, password, phone);
    setIsSubmit(false);
    if (res?.data?._id) {
      message.success("Tạo mới người dùng thành công!");
      form.resetFields();
      setIsCreateOpen(false);
      await fetchUser();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  return (
    <>
      <Modal
        title="Thêm người dùng mới"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isCreateOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsCreateOpen(false)}
        okText="Tạo mới"
        cancelText="Hủy"
        confirmLoading={isSubmit}
      >
        <Form
          form={form}
          style={{
            maxWidth: 800,
            margin: " 0 auto",
            background: "#fff",
            borderRadius: "12px",
          }}
          //   initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Divider />
          <Form.Item
            label="Tên hiển thị"
            labelCol={{ span: 24 }}
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            labelCol={{ span: 24 }}
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Email"
            labelCol={{ span: 24 }}
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            labelCol={{ span: 24 }}
            name="phone"
            rules={[
              {
                required: true,
                pattern: new RegExp(/\d+/g),
                message: "Vui lòng nhập Số điện thoại!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UserModalCreate;
