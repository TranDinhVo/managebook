import { Col, Row, Skeleton } from "antd";

const BookLoader = () => {
  return (
    <>
      <Row gutter={[20, 20]} className="book-detail">
        <Col xs={0} sm={12} md={10} lg={10}>
          <Skeleton.Input
            active={true}
            block={true}
            style={{ width: "100%", height: 350 }}
          />
          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 20,
              overflow: "hidden",
              justifyContent: "center",
            }}
          >
            <Skeleton.Image active={true} />
            <Skeleton.Image active={true} />
            <Skeleton.Image active={true} />
          </div>
        </Col>
        <Col xs={24} sm={0} md={0} lg={0}></Col>
        <Col xs={24} sm={12} md={14} lg={14}>
          <Skeleton paragraph={{ rows: 3 }} active={true} />
          <br /> <br />\ <Skeleton paragraph={{ rows: 2 }} active={true} />{" "}
          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 20,
              overflow: "hidden",
            }}
          >
            <Skeleton.Button active={true} style={{ width: 100 }} />
            <Skeleton.Button active={true} style={{ width: 100 }} />
          </div>
        </Col>
      </Row>
    </>
  );
};
export default BookLoader;
