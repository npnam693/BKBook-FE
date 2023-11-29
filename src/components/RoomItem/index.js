import styles from "./style.module.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

import { memo } from "react";
import { UserState } from "../../Context/UserProvider";
import { GENRES_COLORS } from "../../const/book.js";
import { toast } from "react-toastify";


const getColorType = (type) => {
    if (type === 3) return "bg-red-500"
    if (type === 2) return "bg-purple-400"
    if (type === 1) return "bg-green-500"
    if (type === 0) return "bg-green-700"
}


function RoomItem({ data, hiddenAction, setIdSelect }) {
  const { userInfo} = UserState();

  const config = userInfo
    ? {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    : {};


  const formatNameAddress = (name) => {
    if (name.substring(0, 9) === "Thành phố") return name.substring(10);
    if (name.substring(0, 4) === "Tỉnh") return name.substring(5);
    return name;
  };

  const handleClickBuy = (e) => {
    e.preventDefault();
    console.log(userInfo)
    if (data.seller === userInfo._id) {
      toast.error("Đây là sách bạn đăng bán.")
      return
    }
    if (!userInfo) {
      toast.error("Bạn phải đăng nhập mới có thể mua hàng.")
      return
    }
    setIdSelect(data._id)
  }

  return (
    <Link to={`/detail/${data._id}`} className={styles.wrapper + ' relative group'} onClick={(e) => hiddenAction && e.preventDefault()}>
      <img className={styles.img} src={data.image[0]} alt="Avatar"/>
        <span className="bg-red-600 rounded-md shadow-xl px-2 py-1 font-bold text-yellow-300 text-sm absolute top-6 -left-2 z-10">-30%</span>
        {
        !hiddenAction && 
        <div className="absolute hidden group-hover:bg-[#cccc] group-hover:block w-[calc(100%-20px)] h-[230px] top-[10px] rounded-[10px]">
            <div className="w-full h-full flex items-center justify-center flex-col">
                <Button className="!bg-primary !capitalize !px-4 !py-1 !font-semibold text-sm !text-white !mb-1 hover:!opacity-60" onClick={handleClickBuy}>Mua ngay</Button>
                <Button className="!bg-primary !capitalize !px-4 !py-1 !font-semibold text-sm !text-white  hover:!opacity-60">Xem chi tiết</Button>
            </div>
        </div>
        }

        <div className={styles.content }>
            <div className="flex">
                <span className={`${GENRES_COLORS[data.genre]} p-1 text-xs font-bold rounded-lg mr-2 text-[#333]`}>{data.genre}</span>
                <span className={`p-1 text-xs text-white font-bold rounded-lg mr-1  ${getColorType(3)}`}>Loại {data.condition + 1}</span>
            </div>
            
            <div className="-mb-2 mt-1">
                <p className="text-base font-bold capitalize">{data.name}</p>
                <p className="text-sm">{formatNameAddress(data.province)}, {formatNameAddress(data.district)}</p>
                <p > 
                    <span className="font-bold text-primary">{data.price.toLocaleString("vi", { style: "currency", currency: "VND"})}</span>
                    <span className="line-through text-sm font-semibold ml-3">{data.originalPrice.toLocaleString("vi", { style: "currency", currency: "VND"})}</span>
                </p>
            </div>
        </div>
    </Link>
  );
}

export default memo(RoomItem);
