import { useLocation } from "react-router";
import ViewDetail from "../../components/Book/ViewDetail";
import { useEffect, useState } from "react";
import { getBookAPI } from "../../services/api.service";

const BookPage = () => {
  const [dataBook, setDataBook] = useState();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get(`id`);

  const fetchBook = async (id) => {
    const res = await getBookAPI(id);
    if (res.data) {
      let raw = res.data;
      raw.items = getImages(raw);
      setTimeout(() => {
        setDataBook(raw);
      }, 1000);
    }
  };
  useEffect(() => {
    fetchBook(id);
  }, [id]);
  const getImages = (raw) => {
    const dataB = raw;
    let images = [];
    if (dataB.thumbnail) {
      images.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          dataB.thumbnail
        }`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          dataB.thumbnail
        }`,
        originalClass: "image-gallery",
        thumbnailClass: "thumbnail-gallery",
      });
    }
    if (dataB.slider && dataB.slider.length > 0) {
      dataB.slider.map((item) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          originalClass: "image-gallery",
          thumbnailClass: "thumbnail-gallery",
        });
      });
    }
    return images;
  };
  return (
    <>
      <ViewDetail dataBook={dataBook} />
    </>
  );
};
export default BookPage;
