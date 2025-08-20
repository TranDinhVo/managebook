import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
  Upload,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  callListCategoryAPI,
  callUploadBookImg,
  createBookAPI,
} from "../../../services/api.service";

const BookModalCreate = (props) => {
  const { isModalOpenCreate, setIsModalOpenCreate, fetchBook } = props;
  const [isSubmit, setIsSubmit] = useState(false);

  const [listCategory, setListCategory] = useState([]);
  const [form] = Form.useForm();

  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);

  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await callListCategoryAPI();
      if (res && res.data) {
        const cate = res.data.map((item) => {
          return { label: item, value: item };
        });
        setListCategory(cate);
      }
    };
    fetchCategory();
  }, []);
  const onFinish = async (value) => {
    if (dataThumbnail.length === 0) {
      notification.error({
        message: "Lỗi thumbnail",
        description: "Vui lòng upload ảnh thumbnail",
      });
      return;
    }

    const slider = dataSlider.map((item) => item.name);
    const { mainText, author, price, sold, quantity, category } = value;
    setIsSubmit(true);
    const res = await createBookAPI(
      dataThumbnail[0].name,
      slider,
      mainText,
      author,
      price,
      sold,
      quantity,
      category
    );
    if (res && res.data) {
      message.success("Tạo mới sách thành công!");
      form.resetFields();
      setDataSlider([]);
      setDataThumbnail({});
      setIsModalOpenCreate(false);
      await fetchBook();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info, type) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoadingThumbnail(false);
      });
    }
  };
  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataThumbnail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra khi upload file");
    }
  };
  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra khi upload file");
    }
  };

  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((item) => item.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };
  const handlePreview = async (file) => {
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewTitle(
        file.name || file.url.subString(file.url.lastIndexOf("/" + 1))
      );
      setPreviewOpen(true);
    });
  };
  return (
    <>
      <Modal
        title="Thêm người dùng mới"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpenCreate}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpenCreate(false)}
        okText="Tạo mới"
        cancelText="Hủy"
        confirmLoading={isSubmit}
        width={800}
      >
        <Form
          form={form}
          style={{
            maxWidth: 800,
            margin: " 0 auto",
            background: "#fff",
            borderRadius: "12px",
          }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Divider />
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item
                label="Tên sách"
                labelCol={{ span: 24 }}
                name="mainText"
                rules={[{ required: true, message: "Vui lòng nhập tên sách!" }]}
              >
                <Input placeholder="Nhập tên sách" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item
                label="Tên tác giả"
                labelCol={{ span: 24 }}
                name="author"
                rules={[{ required: true, message: "Vui lòng nhập tác giả!" }]}
              >
                <Input placeholder="Nhập tên tác giả" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[29, 20]}>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item
                label="Giá tiền"
                labelCol={{ span: 24 }}
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
              >
                <InputNumber
                  placeholder="Nhập giá tiền"
                  min={1}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item
                label="Thể loại"
                labelCol={{ span: 24 }}
                name="category"
                rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
              >
                <Select
                  // defaultValue={null}
                  showSearch
                  allowClear
                  placeholder="Chọn thể loại"
                  options={listCategory}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item
                label="Sô lượng"
                labelCol={{ span: 24 }}
                name="quantity"
                rules={[{ required: true, message: "Vui lòng nhập sô lượng!" }]}
              >
                <InputNumber
                  min={1}
                  placeholder="Nhập số lượng"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item
                label="Đã bán"
                labelCol={{ span: 24 }}
                name="sold"
                rules={[{ required: true, message: "Vui lòng nhập đã bán!" }]}
              >
                <InputNumber
                  min={0}
                  placeholder="Nhập sách đã bán"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[29, 20]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item
                labelCol={24}
                label="Ảnh Thumbnail"
                name="thumbnail"
                valuePropName="fileList"
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                >
                  <div>
                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: "10px" }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item
                labelCol={24}
                label="Ảnh Slider"
                name="slider"
                valuePropName="fileList"
              >
                <Upload
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  multiple
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "slider")}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: "10px" }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => {
          setPreviewImage(null);
          setPreviewTitle("");
          setPreviewOpen(false);
        }}
      >
        <img src={previewImage} alt={previewTitle} style={{ width: "100%" }} />
      </Modal>
    </>
  );
};
export default BookModalCreate;
