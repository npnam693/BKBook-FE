import styles from "./style.module.css";
import { StarFill, GeoAlt, House, HouseDoor, Ticket } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient.js";
import { UserState } from "../../Context/UserProvider";
import Skeleton from "@mui/material/Skeleton";
import { Button } from "@mui/material";

import { ImageList, ImageListItem } from "@mui/material";
import { GENRES_COLORS } from "../../const/book.js";
import { getColorType } from "../../components/RoomItem/index.js";
import Buying from "../Buying/index.js";

export const getColorTypeText = (type) => {
  if (type === 3) return "!text-red-500";
  if (type === 2) return "!text-purple-400";
  if (type === 1) return "!text-green-500";
  if (type === 0) return "!text-green-700";
};

function DetailPage() {
  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf("/") + 1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const { userInfo } = UserState();
  const [reload, setReload] = useState(true);
  const [idSelect, setIdSelect] = useState(null);

  const config = userInfo
    ? {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    : {};

  useEffect(() => {
    axiosClient
      .get(`/api/books/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [reload]);

  const renderImg = () => {
    if (data.image.length === 1) {
      return (
        <ImageListItem key={data.image[0]}>
          <img
            src={data.image[0]}
            alt={"Room"}
            style={{
              borderRadius: 20,
              objectFit: "contain",
              height: 730,
              border: "1px solid #ccc",
            }}
          />
        </ImageListItem>
      );
    } else if (data.image.length === 2) {
      return (
        <ImageList sx={{ width: "100%", height: 640 }} cols={2}  gap={20} >
          {data.image.map((item) => (
            <ImageListItem key={item}>
              <img src={item} alt={"itemle"} loading="lazy" style={{ borderRadius: 15, objectFit: "cover" }} />
            </ImageListItem>
          ))}
        </ImageList>
      );
    } else if (data.image.length === 3) {
      return (
        <ImageList sx={{ width: "100%"}} cols={3} gap={20} className="">
          {data.image.map((item) => (
            <ImageListItem key={item}>
              <img src={item} alt={"itemle"} loading="lazy" style={{ borderRadius: 15, objectFit: "cover" }} />
            </ImageListItem>
          ))}
        </ImageList>
      );
    } else if (data.image.length === 4) {
      return (
        <div style={{ display: "flex" }}>
          <img
            src={data.image[0]}
            alt={"itemle"}
            loading="lazy"
            style={{
              borderRadius: 15,
              objectFit: "cover",
              width: "33%",
              height: 700,
              marginRight: 20,
            }}
          />

          <ImageList sx={{ width: "33%", height: 700 }} cols={1} rowHeight={"50%"} gap={20}>
            {data.image.slice(2).map((item, index) => (
              <ImageListItem key={item}>
                <img
                  src={item}
                  alt={"itemle"}
                  loading="lazy"
                  style={{ borderRadius: 15, objectFit: "cover", height: 290, width: "100%"}}
                />
              </ImageListItem>
            ))}
          </ImageList>

          <img
            src={data.image[1]}
            alt={"itemle"}
            loading="lazy"
            style={{
              borderRadius: 15,
              objectFit: "cover",
              width: "33%",
              height: 700,
              marginLeft: 20,
            }}
          />
        </div>
      );
    } else if (data.image.length >= 5) {
      return (
        <div style={{ display: "flex" }}>
          <img
            src={data.image[0]}
            alt={"itemle"}
            loading="lazy"
            style={{
              borderRadius: 15,
              objectFit: "cover",
              width: "50%",
              height: 800,
              marginRight: 20,
            }}
          />

          <ImageList sx={{ width: "50%", height: 800 }} cols={2} gap={20}>
            {data.image.slice(1).map((item, index) => (
              <ImageListItem key={item}>
                <img
                  src={item}
                  alt={"itemle"}
                  loading="lazy"
                  style={{
                    borderRadius: 15,
                    objectFit: "cover",
                    height: "310px",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      {loading ? (
        <div className={styles.inner}>
          <Skeleton animation="wave" height={50} width="70%" style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={50} width="70%" style={{ marginBottom: 6 }} />
          <Skeleton sx={{ height: 480, width: "100%" }} animation="wave" variant="rectangular" />
          <Skeleton animation="wave" height={50} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={50} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={50} style={{ marginBottom: 6 }} />
        </div>
      ) : (
        <div className={styles.inner}>
          <div className={styles.titleContainer}>
            <div>
              <h1 className={styles.titleContent}>{data.name}</h1>
              <div className={styles.introContainer}>
                <div className={styles.rating + " !flex !items-center !justify-between"}>
                  <div>
                    <span className={`${GENRES_COLORS[data.genre]} p-1 text-xs font-bold rounded-lg mr-2 text-[#333]`}>
                      {data.genre}
                    </span>
                    <span className={`p-1 text-xs text-white font-bold rounded-lg mr-1  ${getColorType(3)}`}>
                      Loại {data.condition + 1}
                    </span>
                  </div>
                  <p className="!mb-0 !ml-4 text-primary">{`${data.ward.split("//")[0]}, ${
                    data.district.split("//")[0]
                  }, ${data.province.split("//")[0]}`}</p>
                </div>
              </div>
            </div>
          </div>
          {renderImg()}

          <div className={styles.infoContainer + " !flex !w-full flex-row"}>
            <div className={styles.infoRoom  + " min-w-[unset] !w-9/12"}>
              <div className={styles.infoTitleWrapper}>
                <House color="#000000" size={30} />
                <p className={styles.infoTitle}>Thông tin sách</p>
              </div>
              <div className={styles.createAt}>
                <span>Được đăng vào </span>
                <span className={styles.dateCreate}>{Date(data.createdAt).toString()}</span>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.infoRoomContent}>
                <div className={styles.highlightContainer}>
                  <div className={styles.highlight1}>
                    <div className={styles.highlightTitle}>
                      <span className={styles.highlightTitleContent + " font-normal"}>Tình trạng</span>
                    </div>

                    <p className={"font-semibold" + " " + getColorTypeText(3)}>Loại {data.condition + 1}</p>
                  </div>
                  <div className={styles.highlight2}>
                    <div className={styles.highlightTitle}>
                      <span className={styles.highlightTitleContent + " font-normal"}>Thể loại</span>
                    </div>

                    <p className={`font-semibold `}>{data.genre}</p>
                  </div>
                  <div className={styles.highlight3}>
                    <div className={styles.highlightTitle}>
                      <span className={styles.highlightTitleContent + " font-normal"}>Khu vực</span>
                    </div>
                    <p className="font-semibold text-slate-500">{data.province.split("//")[0]}</p>
                  </div>
                </div>
                <div className={styles.descriptionRoom}>
                  {data.desc.split("\n").map((item) => (
                    <p>{item}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.infoContact + " !basis-3/12 !h-full !flex !items-center !justify-center !flex-col gap-y-5"}>
              <div className={styles.costContainer + " !justify-end"}>
                <div>
                  <p></p>
                </div>

                <p className="!flex !flex-col relative">
                  <span className="bg-red-600 rounded-md shadow-xl px-2 py-1 font-bold text-yellow-300 text-sm absolute top-6 -left-2 z-10">
                    -{100 - data.price/data.originalPrice*100}%
                  </span>

                  <span className="text-right font-bold text-primary text-3xl">
                    {data.price.toLocaleString("vi", { style: "currency", currency: "VND" })}
                  </span>
                  <span className="text-right line-through text-sm font-semibold">
                    {data.originalPrice.toLocaleString("vi", { style: "currency", currency: "VND" })}
                  </span>
                </p>
              </div>
              <Button className="!bg-primary !font-bold !px-[60px] !py-[10px]" variant="contained" onClick={() => setIdSelect(data._id)}>
                Mua ngay
              </Button>
            </div>
          </div>
          {idSelect !== null && <Buying _id={idSelect} setIdSelect={setIdSelect}/>}
        </div>
      )}
    </div>
  );
} 

export default DetailPage;
