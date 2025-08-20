import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Spin,
  Tabs,
} from "antd";
import {
  callListBookAPI,
  callListCategoryAPI,
} from "../../services/api.service";
import { useEffect, useState } from "react";
import { FilterTwoTone } from "@ant-design/icons";
import { IoReload } from "react-icons/io5";
import "../../assets/styles/home.scss";
import { useNavigate } from "react-router";
const Home = () => {
  const [listCategory, setListCategory] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [bookData, setBookData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-sold");

  const [form] = Form.useForm();

  const navigate = useNavigate();
  const fetchCategory = async () => {
    const res = await callListCategoryAPI();
    if (res && res.data) {
      const cate = res.data.map((item) => {
        return { label: item, value: item };
      });
      setListCategory(cate);
    }
  };
  const fetchBook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callListBookAPI(query);
    if (res && res.data) {
      setCurrent(+res.data.meta.current);
      setPageSize(+res.data.meta.pageSize);
      setTotal(res.data.meta.total);
      setBookData(res.data.result);
    }
    setIsLoading(false);
  };
  useState(() => {
    fetchCategory();
  }, []);
  useEffect(() => {
    fetchBook();
  }, [current, pageSize, sortQuery, filter]);
  const onChange = (checkedValues, values) => {
    if (checkedValues && checkedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        setFilter("");
      }
    }
  };
  const onFinish = (values) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  };
  const items = [
    {
      key: "sort=-sold",
      label: "Phổ biến",
      children: <></>,
    },
    {
      key: "sort=-updatedAt",
      label: "Hàng mới",
      children: <></>,
    },
    {
      key: "sort=price",
      label: "Giá từ thấp đến cao",
      children: <></>,
    },
    {
      key: "sort=-price",
      label: "Giá từ cao đến thấp",
      children: <></>,
    },
  ];
  const onChangeTabs = (key) => {
    setSortQuery(key);
  };
  const onChangPagi = (p, s) => {
    if (s && +s !== +pageSize) {
      setPageSize(+s);
      setCurrent(1);
    }
    if (p && +p !== +current) {
      setCurrent(+p);
    }
  };
  const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");

    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );

    return str;
  };
  const convertSlug = (str) => {
    str = removeVietnameseTones(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };
  const handleRedirectBook = (book) => {
    const slug = convertSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`);
  };
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col
          xs={0}
          sm={8}
          md={6}
          lg={4}
          style={{ border: "2px solid red", padding: "10px 20px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px 10px",
            }}
          >
            <span>
              <FilterTwoTone /> Bộ lọc tìm kiếm
            </span>
            <IoReload
              style={{ cursor: "pointer" }}
              onClick={() => {
                form.resetFields();
                setFilter("");
              }}
            />
          </div>
          <Form
            form={form}
            layout="vertical"
            onValuesChange={(checkedValues, values) =>
              onChange(checkedValues, values)
            }
            onFinish={onFinish}
          >
            <Form.Item name="category" label="Danh mục sản phẩm" labelCol={24}>
              <Checkbox.Group
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "10%",
                }}
                options={listCategory}
                // onChange={onChange}
              />
            </Form.Item>
            <Divider />
            <Form.Item label="Khoản giá " name="price" labelCol={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 10px",
                }}
              >
                <Form.Item name={["range", "from"]}>
                  <InputNumber
                    name="form"
                    min={0}
                    placeholder="đ từ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <span>-</span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber
                    name="to"
                    min={0}
                    placeholder="đ đên"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </div>
              <div>
                <Button
                  onClick={() => form.submit()}
                  type="primary"
                  style={{ width: "100%" }}
                >
                  Áp dụng
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>

        <Col
          xs={24}
          sm={16}
          md={18}
          lg={20}
          style={{ border: "2px solid #000" }}
        >
          <Spin spinning={isLoading} tip="Loading...">
            <div>
              <Row gutter={[20, 20]}>
                <Col>
                  <Tabs items={items} onChange={onChangeTabs} />
                </Col>
              </Row>
              <Row gutter={[20, 20]} className="book-list">
                {bookData.map((item) => {
                  return (
                    <Col xs={12} sm={12} md={6} lg={6} key={`book-${item._id}`}>
                      <div
                        className="book-item"
                        onClick={() => handleRedirectBook(item)}
                      >
                        <div className="book-item__wrapper">
                          <div className="book-item__thumbnail">
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/images/book/${item.thumbnail}`}
                            />
                          </div>
                          <div className="book-item__text">{item.mainText}</div>
                          <div className="book-item__price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price)}
                          </div>
                          <div className="book-item__rating">
                            <Rate
                              value={5}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 10 }}
                            />
                            <span className="book-item__sold">
                              Đã bán {item.sold}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
              <Divider />
              <Row
                gutter={[20, 20]}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Col>
                  <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onChange={onChangPagi}
                    responsive
                  />
                </Col>
              </Row>
            </div>
          </Spin>
        </Col>
      </Row>
    </>
  );
};
export default Home;
