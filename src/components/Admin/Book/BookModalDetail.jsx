import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
const BookModalDetail = (props) => {
  const { bookDetail, setBookDetail, isDetailBookOpen, setIsDetailBookOpen } =
    props;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name);
    setPreviewOpen(true);
  };
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    if (bookDetail) {
      let imgThumbnail = {},
        imgSlider = [];
      if (bookDetail.thumbnail) {
        imgThumbnail = {
          uid: uuid4(),
          name: bookDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            bookDetail.thumbnail
          }`,
        };
      }
      if (bookDetail.slider && bookDetail.slider.length > 0) {
        bookDetail.slider.map((item) => {
          imgSlider.push({
            uid: uuid4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [bookDetail]);
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => {
          setBookDetail(null);
          setIsDetailBookOpen(false);
        }}
        open={isDetailBookOpen}
        width="40vw"
      >
        <Descriptions title="Thông tin sách" column={2} bordered>
          <Descriptions.Item label="Id">{bookDetail?._id}</Descriptions.Item>
          <Descriptions.Item label="Tên sách">
            {bookDetail?.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {bookDetail?.author}
          </Descriptions.Item>
          <Descriptions.Item label="Giá">
            {Intl.NumberFormat("vi-Vn", {
              style: "currency",
              currency: "VND",
            }).format(bookDetail?.price)}
          </Descriptions.Item>
          <Descriptions.Item label="Sô Lượng">
            {bookDetail?.quantity}
          </Descriptions.Item>
          <Descriptions.Item label="Đã bán">
            {bookDetail?.sold}
          </Descriptions.Item>

          <Descriptions.Item label="Thẻ loại" span={2}>
            <Badge status="processing" text={bookDetail?.category} />
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {moment(bookDetail?.createAt).format(`DD-MM-YYYY hh:mm:ss`)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày Update">
            {moment(bookDetail?.updateAt).format(`DD-MM-YYYY hh:mm:ss`)}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">Ảnh sách</Divider>
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList} // cố định ảnh
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        ></Upload>

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
          <img
            src={previewImage}
            alt={previewTitle}
            style={{ width: "100%" }}
          />
        </Modal>
      </Drawer>
    </>
  );
};
export default BookModalDetail;
