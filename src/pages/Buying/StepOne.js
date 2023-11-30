import React, { useState } from "react";
import { UserState } from "../../Context/UserProvider";
import { Button } from "@mui/material";
import { bkBookApi } from "../../api/axiosClient";
const StepOne = ({ setStep, orderData, setOrderData, setIdSelect }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { userInfo } = UserState();

  React.useEffect(() => {
    const getProvinces = async () => {
      const res = await bkBookApi.getProvinces();
      setProvinces(res.data.data);
    };
    const getDistricts = async () => {
      const res = await bkBookApi.getDistricts(orderData.province.split("//")[1]);
      setDistricts(res.data.data);
    };

    const getWards = async () => {
      const res = await bkBookApi.getWards(orderData.district.split("//")[1]);
      setWards(res.data.data);
    };

    if (provinces.length === 0) getProvinces();
    if (orderData.province) getDistricts();
    if (orderData.district) getWards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData.province, orderData.district, orderData.ward]);

  const handleSubmit = () => {
    setStep((prv) => prv + 1);
  };
  console.log(orderData)

  return (
    <div className="mt-5">
      <div className="flex flex-col-reverse group mb-5 ">
        <input
          placeholder="Nhập số điện thoại liên hệ "
          onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
          defaultValue={orderData.phone}
        />
        <span className="mb-2 ml-2 text-[#333]">Số điện thoại</span>
      </div>

      <div className="flex flex-col-reverse group mb-5 ">
        <input
          placeholder="Nhập họ và tên "
          id=""
          onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
          defaultValue={orderData.name}
        />
        <span className="mb-2 ml-2 text-[#333]">Họ và tên</span>
      </div>

      <div className="grid grid-cols-3 gap-x-4 justify-between content-between w-full">
      <select
            id="province"
            name="province"
            onChange={(e) => {
              setWards([]);
              setOrderData({ ...orderData, province: e.target.value, district: "", ward: "" });
            }}
            value={orderData.province}>
            <option key={""} value="">
              --Chọn Tỉnh/Thành phố--
            </option>
            {provinces.map((item) => (
              <option key={item.ProvinceID} value={item.NameExtension[0] + "//" + item.ProvinceID}>
                {item.NameExtension[0]}
              </option>
            ))}
          </select>
          <select
            id="district"
            name="district"
            onChange={(e) => setOrderData({ ...orderData, district: e.target.value, ward: "" })}
            value={orderData.district}>
            <option key={""} value="">
              --Chọn Quận/Huyện--
            </option>
            {districts.map((item) => (
              <option key={item.DistrictID} value={item.NameExtension[0] + "//" + item.DistrictID}>
                {item.NameExtension[0]}
              </option>
            ))}
          </select>

          <select id="ward" name="ward" onChange={(e) => setOrderData({ ...orderData, ward: e.target.value })} value={orderData.ward}>
            <option key={""} value="">
              --Chọn Xã/Phường--
            </option>
            {wards.map((item) => (
              <option key={item.WardCode} value={item.NameExtension[0] + "//" + item.WardCode}>
                {item.NameExtension[0]}
              </option>
            ))}
          </select>
      </div>

      <div className="flex flex-col-reverse group my-5">
        <input
          placeholder="Nhập số điện thoại liên kết "
          id=""
          onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
          defaultValue={orderData.address}
        />
        <span className="mb-2 ml-2 text-[#333]">Địa chỉ nhà</span>
      </div>

      <div className="w-full">
        <p className="mb-2">
          Thời gian ước tính: Từ <b>3 - 4 ngày</b> làm việc.
        </p>
        <p className="mb-2">Khung giờ giao hàng: Từ thứ 2 đến thứ 7 trong tuần, khung giờ hành chính từ 8h - 17h</p>
      </div>

      <div className=" bg-slate-50 mt-5 rounded-2xl flex border-solid border-[1px] p-5 justify-center gap-x-10 w-full">
        <Button variant="outlined" color="error" className="!font-semibold !w-32" onClick={() => setIdSelect(null)}>
          Huỷ bỏ
        </Button>
        <Button variant="contained" className="!bg-primary !font-semibold" onClick={handleSubmit}>
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};

export default StepOne;
