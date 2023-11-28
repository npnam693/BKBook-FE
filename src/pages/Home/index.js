import styles from "./style.module.css";
import RoomItem from "../../components/RoomItem";
import SkeletonItem from "../../components/RoomItem/skeleton";
import axiosClient from "../../api/axiosClient.js";
import { useEffect, useState } from "react";
import Buying from "../Buying/index.js";

function HomePage() {
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(0);
  const [loading, setLoading] = useState(true);
  const [maxItem, setMaxItem] = useState(false);
  const [idSelect, setIdSelect] = useState("65659c280a6d604a2536c042");
  console.log(maxItem);
  window.onscroll = function (ev) {
    if (maxItem) return;
    else {
      if (window.innerHeight + window.scrollY + 30 >= document.body.scrollHeight) {
        setPaging(paging + 1);
        setLoading(true);
      }
    }
  };

  useEffect(() => {
    axiosClient
      .get("api/books/", { params: { num: 12 + 8 * paging } })
      .then((res) => {
        // console.log(res.data)
        setLoading(true);
        if (data.length === res.data.length) {
          setMaxItem(true);
        } else setData(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [paging]);

  const renderItem = () => {
    if (data === undefined) {
      return Array(12 + 8 * paging)
        .fill(1)
        .map((el, i) => <SkeletonItem key={i} />);
    } else {
      return Array(12 + 8 * paging)
        .fill(1)
        .map((e1, i) => {
          if (i < data.length) return <RoomItem key={i} data={data[i]} />;
          else if (i >= data.length && !maxItem) return <SkeletonItem key={i} />;
          return <></>;
        });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.itemList}>{renderItem()}{renderItem()}{renderItem()}</div>
      </div>
      {idSelect !== null && <Buying _id={idSelect} setIdSelect={setIdSelect}/>}
    </div>
  );
}

export default HomePage;
