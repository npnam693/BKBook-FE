import React from "react";
import { Modal } from "@mui/material";
import axiosClient from "../../api/axiosClient";
import RoomItem from "../../components/RoomItem";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { UserState } from "../../Context/UserProvider";

const dataSteps = ["Thông tin giao hàng", "Thanh toán đơn hàng"];

const Buying = ({ _id, setIdSelect }) => {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState();
  const { userInfo } = UserState();

  const [orderData, setOrderData] = React.useState({
    book: _id,
    buyer: userInfo._id,
    deliveryFee: 19000,
    shippingName: "Giao Hàng Tiết Kiệm",
    shippingCode: "",
    address: userInfo.address,
    province: userInfo.province,
    district: userInfo.district,
    ward: userInfo.ward,
    phone: userInfo.phone,
    name: userInfo.name,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const { data } = await axiosClient.get(`/api/books/${_id}`);
      setData(data);
    };
    fetchData();
  }, []);

  const getStep = () => {
    switch (step) {
      case 0:
        return <StepOne setStep={setStep} orderData={orderData} setOrderData={setOrderData} />;
      case 1: return <StepTwo setStep={setStep} />;
      default:
        return <></>;
    }
  };


  return (
    <Modal open={true} className="flex items-center justify-center ">
      {
        <div className="w-[1200px] h-[680px] bg-white rounded-lg p-10 flex flex-row items-start gap-x-10 relative">
          <div className="flex flex-col justify-start basis-4/12 border-r-[1px] border-solid border-[#ccc] items-center">
            <p className="font-bold mb-5 text-lg w-full">Thanh toán đơn hàng</p>
            {data && <RoomItem data={data} hiddenAction={true} />}

            <div className="w-10/12  border-b-[1px] border-solid border-[#ccc] mr-4">
              <p className="flex justify-between">Giá sản phẩm: <span>{data?.price.toLocaleString("vi", { style: "currency", currency: "VND" })}</span></p>
              <p className="mb-2 flex justify-between">Phí vận chuyển: <span>19.000đ</span> </p>
            </div>
            <div className="w-10/12 mr-4 mt-3">
              <p className="mb-2 flex justify-between">Tổng cộng: <span className="font-bold text-blue-500">{(19000 + data?.price).toLocaleString("vi", { style: "currency", currency: "VND" })}</span> </p>
            </div>
          </div>

          <section className="basis-8/12">
            <div className="flex mb-10">
              {dataSteps.map((dataStep, index) => (
                <div key={index} className="flex items-center">
                  <span
                    className={`title-step relative flex font-bold text-lg items-center justify-center bg-gray-400 w-10 h-10 rounded-[100%] ${
                      step === index && "bg-primary text-white shadow-2xl active"
                    }`}>
                    {index + 1}
                  </span>
                  <span className={`ml-3 mr-4 ${step === index ? "font-semibold" : ""}`}>{dataStep}</span>
                  <div className={`h-[2px] bg-gray-400 w-10 mr-4 ${index === dataSteps.length - 1 && "hidden"} "`} />
                </div>
              ))}
            </div>

            <div className="mt-5">{getStep()}</div>
          </section>

          <div className="font-bold absolute right-4 top-4 text-xl hover:text-primary cursor-pointer" onClick={() => setIdSelect(null)}>X</div>
        </div>
      }
    </Modal>
  );
};

export default Buying;
