import { Col, Image, Modal, Row } from "antd";
import { useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ModalGallery = (props) => {
  const {
    isOpenModalGallery,
    setIsOpenModalGallery,
    images,
    currentIndex,
    title,
  } = props;
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const refGallery = useRef(null);
  return (
    <>
      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpenModalGallery}
        width={1000}
        onOk={() => {
          console.log("ok");
        }}
        footer={null}
        onCancel={() => setIsOpenModalGallery(false)}
      >
        <Row>
          <Col span={14}>
            <ImageGallery
              ref={refGallery}
              items={images}
              showNav={false}
              showThumbnails={false}
              showFullscreenButton={false}
              slideOnThumbnailOver={true}
              showPlayButton={false}
              startIndex={currentIndex}
              onSlide={(i) => setActiveIndex(i)}
            />
          </Col>
          <Col span={10} style={{ padding: "5px 20px" }}>
            <div>
              <h3 style={{ margin: "0" }}>{title}</h3>
              <div>
                <Row gutter={[20, 20]}>
                  {images?.map((item, i) => {
                    return (
                      <Col key={`img-${i}`} style={{ cursor: "pointer" }}>
                        <Image
                          src={item.thumbnail}
                          width={100}
                          height={100}
                          preview={false}
                          onClick={() => refGallery.current.slideToIndex(i)}
                        />
                        <div
                          className={activeIndex === i ? "active" : ""}
                        ></div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ModalGallery;
