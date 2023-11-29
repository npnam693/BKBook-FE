import React, { useState } from "react";
import { UserState } from "../../Context/UserProvider";
import { Button } from "@mui/material";
const StepOne = ({ setStep, orderData, setOrderData, setIdSelect }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { userInfo } = UserState();

  React.useEffect(() => {
    const getProvinces = async () => {
      const res = await fetch("https://provinces.open-api.vn/api/p/");
      const resJson = await res.json();
      setProvinces(await resJson);
    };
    const getDistricts = async () => {
      let res = await fetch(`https://provinces.open-api.vn/api/p/${orderData.province.split("//")[1]}?depth=2`);
      let resArray = await res.json();
      setDistricts(await resArray.districts);
    };
    const getWards = async () => {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${orderData.district.split("//")[1]}?depth=2`);
      let resArray = await res.json();
      setWards(await resArray.wards);
    };
    if (provinces.length === 0) getProvinces();
    if (orderData.province) getDistricts();
    if (orderData.district) getWards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData.province, orderData.district, orderData.ward]);

  const handleSubmit = () => {
    setStep((prv) => prv + 1);
  };

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
          onChange={(e) => setOrderData({ ...orderData, province: e.target.value })}>
          <option key={"0"} value={orderData.province}>
            {orderData.province && orderData.province === userInfo.province
              ? orderData.province.split("//")[0]
              : "--Chọn Tỉnh/Thành phố--"}
          </option>
          {provinces.map(
            (e) =>
              String(e.code) !== orderData.province.split("//")[1] && (
                <option key={e.code} value={String(e.name) + "//" + e.code}>
                  {e.name}
                </option>
              )
          )}
        </select>

        <select
          id="district"
          name="district"
          onChange={(e) => setOrderData({ ...orderData, district: e.target.value })}>
          <option value={orderData.district}>
            {orderData.district && orderData.district === userInfo.district
              ? orderData.district.split("//")[0]
              : "--Chọn Quận/Huyện--"}
          </option>
          {districts.map(
            (e) =>
              String(e.code) !== orderData.district.split("//")[1] && (
                <option key={e.code} value={String(e.name) + "//" + e.code}>
                  {e.name}
                </option>
              )
          )}
        </select>

        <select id="ward" name="ward" onChange={(e) => setOrderData({ ...orderData, ward: e.target.value })}>
          <option value={orderData.ward} defaulvalue={orderData.ward}>
            {orderData.ward && orderData.ward === userInfo.ward ? orderData.ward.split("//")[0] : "--Chọn Xã/Phường--"}
          </option>
          {wards.map((e) => (
            <option key={e.code} value={String(e.name) + "//" + e.code}>
              {e.name}
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
