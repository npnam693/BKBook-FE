import React from "react";
import MomoIcon from "../../assets/imgs/momo.png";
import VnpayIcon from "../../assets/imgs/vnpay.jpg";
import Banking from "../../assets/imgs/banking.png";
import VisaIcon from "../../assets/imgs/visa.png";
import { Button } from "@mui/material";
import QRCode from "qrcode.react";
import { CircularProgress } from "@mui/material";
import axiosClient from "../../api/axiosClient";
import { UserState } from "../../Context/UserProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StepTwo = ({ setStep, orderData, setIdSelect }) => {
  const [isOnline, setIsOnline] = React.useState(true);
  const [payment, setPayment] = React.useState(false);
  const [uploading, setUploading] = React.useState(null);
  const [dataPayment, setDataPayment] = React.useState(null);
  const { userInfo } = UserState();
  // const intervalRef = React.useRef(null)
  // const timeoutRef = React.useRef(null)
  // const navigate = useNavigate()

  const getPayment = async () => {
    axiosClient
      .post("/api/orders/pay-order", orderData, config)
      .then((payment) => {
        setUploading(true);
        setDataPayment({
          payUrl: payment.data.payUrl,
          deepUrl: payment.data.deeplink,
        });
        setUploading(false);
      })
      .catch((err) => {
        toast.error("Thực hiện thanh toán không thành công.")
      });
  };


  const moneyPay = async () => {
    axiosClient
      .post("/api/orders/create-order", orderData, config)
      .then(() => {
        toast.success("Bạn đã đặt đơn hàng thành công.");
      })
      .catch(() => {
        toast.error("Bạn đã đặt đơn không thành công.");
      })
      .then(() => setIdSelect(null));
  };

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  if (!payment)
    return (
      <div>
        <p>Lựa chọn phương thức thanh toán</p>
        <div className="flex items-start justify-evenly gap-x-10 mt-4">
          <div
            className={`h-[90px] border-[1px] border-solid border-[#ccc px-4 py-2 hover:border-primary cursor-pointer relative ${
              isOnline && "border-solid border-[2px] border-primary"
            }`}
            onClick={() => setIsOnline(true)}>
            <div className="font-bold">Thanh toán trực tuyến</div>
            <div className="flex gap-x-4 ">
              <div className="w-12 h-12 border-solid border-[2px] border-black shadow-lg cursor-pointer :hover">
                <img src={MomoIcon} alt="momo" />
              </div>
              <div className="w-12 h-12 border-solid border-[2px] border-black shadow-lg relative">
                <img src={VnpayIcon} alt="VnpayIcon" />
                <div className="z-10 bg-black opacity-50 w-full h-full absolute top-0" />
              </div>
              <div className="w-12 h-12 border-solid border-[2px] border-black shadow-lg relative">
                <img src={Banking} alt="momo" />
                <div className="z-10 bg-black opacity-50 w-full h-full absolute top-0" />
              </div>

              <div className="w-12 h-12 border-solid border-[2px] border-black shadow-lg relative">
                <img src={VisaIcon} alt="momo" />
                <div className="z-10 bg-black opacity-50 w-full h-full absolute top-0" />
              </div>

              <div className={`absolute w-full h-full ${!isOnline && "bg-[rgba(0,0,0,0.5)]"} top-0 left-0`} />
            </div>
          </div>

          <div
            className={`${
              isOnline ? "bg-[rgba(0,0,0,0.5)]" : "border-solid border-[2px] border-primary"
            } font-bold h-[90px] border-[1px] border-solid border-[#ccc] px-4 py-2 hover:border-primary cursor-pointer`}
            onClick={() => setIsOnline(false)}>
            Thanh toán khi nhận hàng
          </div>
        </div>

        <div className="flex w-full justify-center mt-10">
          <Button
            variant="outlined"
            color="error"
            className="!font-semibold !w-32 !mr-10"
            onClick={() => setStep((prv) => prv - 1)}>
            Quay lại
          </Button>
          {isOnline ? (
            <Button variant="contained" className="!bg-primary !font-semibold" onClick={() => {setPayment(true); getPayment()}}>
              Tiếp tục
            </Button>
          ) : (
            <Button variant="contained" className="!bg-primary !font-semibold" onClick={moneyPay}>
              Hoàn tất đơn hàng
            </Button>
          )}
        </div>
      </div>
    );
  else
    return (
      <div className="">
        <div className="h-[460px] bg-slate-50 mt-5 rounded-2xl border-solid border-[1px] p-5">
          <p className="font-bold mb-3">Tiến hành thanh toán</p>
          <p>Quét mã QR hoặc nhấn nút bên dưới để đến trang thanh toán.</p>
          <div className="h-full flex items-center justify-center relative -top-7">
            {uploading === false ? (
              <div>
                <div className="flex flex-col items-center">
                  <QRCode
                    id="qrcode"
                    value={dataPayment.payUrl}
                    size={290}
                    level={"H"}
                    includeMargin={true}
                    className="border-[1px] border-solid boder-[#111] mb-5"
                  />
                  <Button
                    variant="contained"
                    className="!bg-primary"
                    onClick={() => {
                      window.open(dataPayment.payUrl, "_blank");
                    }}>
                    ĐẾN TRANG THANH TOÁN
                  </Button>
                </div>
              </div>
            ) :  (
              <div className="flex items-center justify-center flex-col gap-y-5">
                <CircularProgress className="!border-primary" size={50} />
                <p>Đang xử lý, vui lòng chờ...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default StepTwo;
