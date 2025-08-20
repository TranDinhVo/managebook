import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment";
const UserDetail = (props) => {
  const { userDetail, setUserDetail, isDetailOpen, setIsDetailOpen } = props;
  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => {
          setUserDetail(null);
          setIsDetailOpen(false);
        }}
        open={isDetailOpen}
        width="40vw"
      >
        <Descriptions title="Thông tin người dùng" column={2} bordered>
          <Descriptions.Item label="Id">{userDetail?._id}</Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">
            {userDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {userDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {userDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={2}>
            <Badge status="processing" text={userDetail?.role} />
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {moment(userDetail?.createAt).format(`DD-MM-YYYY hh:mm:ss`)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày Update">
            {moment(userDetail?.updateAt).format(`DD-MM-YYYY hh:mm:ss`)}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default UserDetail;
