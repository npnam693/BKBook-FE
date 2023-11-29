import React from "react";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";
import { UserState } from "../../Context/UserProvider";
import { GENRES_COLORS } from "../../const/book";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
const getStatus = {
  preparing: "Đang chuẩn bị hàng",
  prepared: "Đang chờ lấy hàng",
  delivering: "Đang vận chuyển",
  delivered: "Đã giao hàng",
  completed: "Đã thanh toán",
};

const getColorType = (type) => {
  if (type === 3) return "bg-red-500";
  if (type === 2) return "bg-purple-400";
  if (type === 1) return "bg-green-500";
  if (type === 0) return "bg-green-700";
};

const MySell = () => {
  const { userInfo } = UserState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  const [data, setData] = React.useState([]);

  const fetchData = () => {
    axiosClient
      .get("/api/orders/myOrder", config)
      .then((orders) => setData(orders.data.filter((order) => order.buyer !== userInfo._id)))
      .catch(() => toast.error("Có lỗi xảy ra."));
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  const finalizePrepare = async (id) => {
    axiosClient
      .put(`/api/orders/update/${id}`, {}, config)
      .then(() => {
        toast.success("Cập nhât trạng thái đơn hàng thành công");
        fetchData();
      })
      .catch((err) => {
        toast.error("Có lỗi xảy ra");
      });
  };
  return (
    <div className="w-layoutWith mx-auto">
      <h2 className="font-bold text-xl mb-5">Các đơn hàng bán sách</h2>

      <table className="w-full">
        <thead>
          <td className="w-[30%] font-semibold text-[#666] text-lg pb-4">Sản phẩm</td>
          <td className="w-[20%] font-semibold text-[#666] text-lg pb-4">Trạng thái</td>
          <td className="w-[20%] font-semibold text-[#666] text-lg pb-4">Vận chuyển</td>
          <td className="w-[15%] font-semibold text-[#666] text-lg pb-4">Thanh toán</td>
          <td className="w-[15%] font-semibold text-[#666] text-lg pb-4">Hành động</td>
        </thead>

        <tbody>
          {data.map((order, index) => (
            <>
              <tr className="border-solid border-t-2 border-blue-100 !pt-4">
                <p className="font-bold text-primary pt-4">#{order._id}</p>
              </tr>
              <tr className="p-2 border-b-2 border-solid  border-blue-100">
                <td className="flex gap-x-4 py-4">
                  <img
                    src={order.book.image[0]}
                    alt="book"
                    className="w-32 h-32 rounded-sm border-[1px] border-solid border-[#ccc] "
                  />
                  <div className="flex flex-col justify-between">
                    <p>
                      <span className="font-bold">{order.book.name}</span> - {order.book.author}
                    </p>
                    <div className="flex flex-col">
                      <span
                        className={`${
                          GENRES_COLORS[order.book.genre]
                        } p-1 text-xs font-bold rounded-lg mr-2 text-[#333] mb-2`}>
                        {order.book.genre}
                      </span>
                      <span className={`p-1 text-xs text-white font-bold rounded-lg mr-1  ${getColorType(3)}`}>
                        Loại {order.book.condition + 1}
                      </span>
                    </div>
                  </div>
                </td>
                <td>{getStatus[order.status]}</td>
                <td>
                  <p>Giao hàng tiết kiệm</p>
                  <p>MVĐ: VN8123DX13123</p>
                  <p>{Number(order.deliveryFee).toLocaleString("vi", { style: "currency", currency: "VND" })}</p>
                </td>
                <td>
                  <p>Momo</p>
                  <p>SDT: {order.book.phone}</p>
                  <p>SDT: {order.book.phone}</p>
                </td>
                <td>
                  {order.status === "preparing" ? (
                    <Button className="!bg-primary !font-bold" variant="contained" onClick={() => finalizePrepare(order._id)}>
                      Chuẩn bị hoàn tất
                    </Button>
                  ) : (
                    <Link className="text-primary font-bold underline" to={`/detail/${order._id}`}>Thông tin chi tiết</Link>
                  )}
                </td>
              </tr>
              <tr className="p-2"></tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MySell;
