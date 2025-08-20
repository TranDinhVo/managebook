import { Drawer, Modal, notification, Table } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import * as XLSX from "xlsx";
import { useState } from "react";
import { callBulkCreateUser } from "../../../../services/api.service";
import templateFile from "./templateFile.xlsx?url";
const { Dragger } = Upload;

const UserImport = (props) => {
  const { isModalImportOpen, setIsModalImportOpen, fetchUser } = props;
  const [dataExcel, setDataExcel] = useState([]);
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 2000);
  };

  const propsUploads = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (info.fileList && info.fileList.length < 1) {
        setDataExcel([]);
      }
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e) {
            var data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, {
              header: ["fullName", "email", "phone"],
              range: 1,
            });
            if (json && json.length > 0) setDataExcel(json);
          };
        }

        message.success(`${info.file.name} Tệp tải lên thành công.`);
      } else if (status === "error") {
        message.error(`${info.file.name} Tệp tải lên thất bại!.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const handleSubmit = async () => {
    const data = dataExcel.map((item) => {
      item.password = "123456";
      return item;
    });
    const res = await callBulkCreateUser(data);
    if (res && res.data) {
      notification.success({
        description: `Thành công:  ${res.data.countSuccess}, Thất bại: ${res.data.countError}`,
        message: "Tải lên thành công!",
      });
      setDataExcel([]);
      setIsModalImportOpen(false);
      fetchUser();
    } else {
      notification.error({
        description: res.message,
        message: "Đã xảy ra lỗi!",
      });
    }
  };

  return (
    <>
      <Modal
        title="Import dữ liệu người dùng"
        closable={{ "aria-label": "Custom Close Button" }}
        width="45vw"
        open={isModalImportOpen}
        onOk={handleSubmit}
        okText="Import dữ liệu"
        cancelText="Hủy"
        onCancel={() => {
          setIsModalImportOpen(false);
          setDataExcel([]);
        }}
      >
        <Dragger {...propsUploads}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấp hoặc kéo tệp vào khu vực này để tải lên
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ tải lên một tệp. Chỉ chấp nhận .csv .xlx .xlsx . or &nbsp;{" "}
            <a
              onClick={(e) => e.stopPropagation()} // Ngăn chỉ download không làm gì nữa
              href={templateFile}
              download
            >
              Tải xuống mẫu tệp
            </a>
          </p>
        </Dragger>
        <Drawer />
        <Table
          title={() => <>Dữ liệu upload</>}
          columns={[
            {
              title: "Họ Tên",
              dataIndex: "fullName",
              key: "fullName",
            },
            {
              title: "Email",
              dataIndex: "email",
              key: "email",
            },
            {
              title: "Số Điện Thoại",
              dataIndex: "phone",
              key: "phone",
            },
          ]}
          dataSource={dataExcel}
          style={{ marginTop: "20px" }}
        />
      </Modal>
    </>
  );
};
export default UserImport;
