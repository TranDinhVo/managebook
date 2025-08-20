import { Button, Col, Input, InputNumber, Rate, Row } from "antd";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "../../assets/styles/viewDetail.scss";
import ModalGallery from "./ModalGallery";
import { useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RiSubtractFill } from "react-icons/ri";
import BookLoader from "./BookLoader";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { doAddBookAction } from "../../redux/order/orderSlice";
const ViewDetail = (props) => {
  const { dataBook } = props;
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [quantityInput, setQuantityInput] = useState(1);
  const refGallery = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = dataBook?.items ?? [];

  const dispatch = useDispatch();

  const handleClickImage = (index) => {
    setIsOpenModalGallery(true);
    // setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    setCurrentIndex(index);
  };

  const handleChangeButton = (type) => {
    if (type === "MINUS") {
      setQuantityInput(+quantityInput - 1 <= 0 ? 1 : +quantityInput - 1);
    } else if (type === "PLUS") {
      if (+quantityInput + 1 > dataBook.quantity) return;
      setQuantityInput(+quantityInput + 1);
    }
  };
  const handleChangeInput = (e) => {
    if (!isNaN(e)) {
      if (+e > 0 && +e <= +dataBook.quantity) setQuantityInput(+e);
    }
  };
  const handleAddToCart = (quantity, book) => {
    dispatch(doAddBookAction({ quantity, detail: book, _id: book._id }));
  };
  return (
    <>
      {dataBook && dataBook._id ? (
        <Row gutter={[20, 20]} className="book-detail">
          <Col xs={0} sm={12} md={10} lg={10}>
            <ImageGallery
              ref={refGallery}
              items={images}
              showNav={false}
              showPlayButton={false}
              showFullscreenButton={false}
              slideOnThumbnailOver={true}
              onThumbnailClick={(e, index) => {
                handleClickImage(index);
              }}
            />
          </Col>
          <Col xs={24} sm={0} md={0} lg={0}>
            <ImageGallery
              ref={refGallery}
              items={images}
              showPlayButton={false}
              showFullscreenButton={false}
              startIndex={currentIndex}
              showThumbnails={false}
              showIndex={true}
            />
          </Col>
          <Col xs={24} sm={12} md={14} lg={14}>
            <div className="book-detail__right">
              <div className="book-detail__author">
                <span>Tác giả: </span>
                <span>{dataBook?.author}</span>
              </div>
              <h2 className="book-detail__text">{dataBook?.mainText}</h2>
              <div className="book-detail__rate">
                <Rate
                  value={5}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 10 }}
                />
                <span>Đã bán {dataBook?.sold}</span>
              </div>
              <div className="book-detail__price">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(dataBook?.price ?? 0)}
              </div>
              <div className="book-detail__ship">
                <span>Vận chuyển</span> <span>Vận chuyển miễn phí</span>
              </div>
              <div className="book-detail__quantity">
                <span>Số lượng</span>
                <div>
                  <Button
                    className="book-detail__button--btn"
                    onClick={() => handleChangeButton("MINUS")}
                  >
                    <RiSubtractFill />
                  </Button>
                  <input
                    className="book-detail__input"
                    value={quantityInput}
                    onChange={(e) => handleChangeInput(e.target.value)}
                  />
                  <Button
                    className="book-detail__button--btn"
                    onClick={() => handleChangeButton("PLUS")}
                  >
                    <IoMdAdd />
                  </Button>
                </div>
                <span className="book-detail__quantity--sp">
                  {dataBook?.quantity} sản phẩm có sẳn
                </span>
              </div>
              <div className="book-detail__button">
                <button
                  className="book-detail__button--btn1"
                  onClick={() => handleAddToCart(quantityInput, dataBook)}
                >
                  Thêm vào giỏ hàng
                </button>
                <button className="book-detail__button--btn2">Mua ngay</button>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <BookLoader />
      )}
      <ModalGallery
        isOpenModalGallery={isOpenModalGallery}
        setIsOpenModalGallery={setIsOpenModalGallery}
        images={images}
        currentIndex={currentIndex}
        // refGallery={refGallery}
        title={dataBook?.mainText}
      />
    </>
  );
};
export default ViewDetail;
