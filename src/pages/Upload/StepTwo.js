import React, { useEffect, useState } from "react";
import MomoIcon from "../../assets/imgs/momo.png";
import VnpayIcon from "../../assets/imgs/vnpay.jpg";
import Banking from "../../assets/imgs/banking.png";
import VisaIcon from "../../assets/imgs/visa.png";
import { Button } from "@mui/material";
const StepTwo = ({ setStep }) => {
  const [data, setData] = useState({
    province: "",
    district: "",
    ward: "",
    address: "",
    momo: "",
    nameMomo: "",
    name: "",
    phone: "",
    verified: false,
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const getProvinces = async () => {
      const res = await fetch("https://provinces.open-api.vn/api/p/");
      const resJson = await res.json();
      setProvinces(await resJson);
    };
    const getDistricts = async () => {
      let res = await fetch(`https://provinces.open-api.vn/api/p/${data.province.split("//")[1]}?depth=2`);
      let resArray = await res.json();
      setDistricts(await resArray.districts);
    };
    const getWards = async () => {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${data.district.split("//")[1]}?depth=2`);
      let resArray = await res.json();
      setWards(await resArray.wards);
    };
    if (provinces.length === 0) getProvinces();
    if (data.province) getDistricts();
    if (data.district) getWards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.province, data.district, data.ward]);

  const handleSubmit = () => {
    if (
      data.province === "" ||
      data.district === "" ||
      data.ward === "" ||
      data.address === "" ||
      data.momo === "" ||
      data.nameMomo === "" ||
      data.phone === "" ||
      data.name === ""
    ) {
      console.log("hâh");
    } else {
      console.log(data);
      localStorage.setItem(
        "newBook-step2",
        JSON.stringify({
          ...data,
          done: true,
          province: data.province.split("//")[0],
          district: data.district.split("//")[0],
          ward: data.ward.split("//")[0],
        })
      );
      setStep((step) => step + 1);
    }
  };
  return (
    <>
      <div className="w-8/12 h-auto bg-slate-50 mt-5 rounded-2xl border-solid border-[1px] p-5">
        <p className="font-bold mb-5">Thông tin thanh toán</p>

        <div className="flex gap-x-4 mt-2 mb-5">
          <div className="w-12 h-12 border-solid border-[3px] border-primary shadow-lg cursor-pointer :hover">
            <img src={MomoIcon} alt="momo" />
          </div>
          <div className="w-12 h-12 border-solid border-[2px] border-black shadow-lg relative cursor-not-allowed">
            <img src={VnpayIcon} alt="VnpayIcon" />
            <div className="z-10 bg-black opacity-50 w-full h-full absolute top-0" />
          </div>
          <div className="w-12 h-12 border-solid border-[2px] border-black shadow-lg relative cursor-not-allowed">
            <img src={Banking} alt="momo" />
            <div className="z-10 bg-black opacity-50 w-full h-full absolute top-0" />
          </div>

          <div className="w-12 h-12 border-solid border-[2px] border-black shadow-lg relative cursor-not-allowed">
            <img src={VisaIcon} alt="momo" />
            <div className="z-10 bg-black opacity-50 w-full h-full absolute top-0" />
          </div>
        </div>

        <div className="flex gap-x-5">
          <div className="flex flex-col-reverse group mb-5 basis-1/2">
            <input
              placeholder="Nhập số điện thoại liên kết "
              id=""
              onChange={(e) => setData({ ...data, momo: e.target.value })}
            />
            <span className="mb-2 ml-2 text-[#333]">Số điện thoại momo</span>
          </div>

          <div className="flex flex-col-reverse group mb-5 basis-1/2">
            <input
              placeholder="Nhập tên người dùng momo "
              id=""
              onChange={(e) => setData({ ...data, nameMomo: e.target.value })}
            />
            <span className="mb-2 ml-2 text-[#333]">Tên người dùng Momo</span>
          </div>
        </div>

        <div className="flex gap-x-5 justify-end">
          <Button variant="contained" className="h-full !bg-primary ">
            Xác thực OTP
          </Button>

          <div className="flex flex-row-reverse mb-5 items-end">
            <input
              placeholder="Nhập mã xác nhận"
              id=""
              minLength={6}
              maxLength={6}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <span className="mb-2 ml-2 text-[#333] mr-5">Mã xác nhận:</span>
          </div>
        </div>

        <p className="font-bold mb-5 mt-5">Thông tin vận chuyển</p>

        <div className="flex gap-x-5">
          <div className="flex flex-col-reverse group mb-5 basis-1/2">
            <input
              placeholder="Nhập số điện thoại liên hệ "
              id=""
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
            <span className="mb-2 ml-2 text-[#333]">Số điện thoại</span>
          </div>

          <div className="flex flex-col-reverse group mb-5 basis-1/2">
            <input placeholder="Nhập họ và tên " id="" onChange={(e) => setData({ ...data, name: e.target.value })} />
            <span className="mb-2 ml-2 text-[#333]">Họ và tên</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-4 justify-between content-between w-full">
          <select id="province" name="province" onChange={(e) => setData({ ...data, province: e.target.value })}>
            <option key={"0"} value="0" defaulvalue={0}>
              --Chọn Tỉnh/Thành phố--
            </option>
            {provinces.map((e) => (
              <option key={e.code} value={String(e.name) + "//" + e.code}>
                {e.name}
              </option>
            ))}
          </select>

          <select id="district" name="district" onChange={(e) => setData({ ...data, district: e.target.value })}>
            <option value="0" defaulvalue={0}>
              --Chọn Quận/Huyện--
            </option>
            {districts.map((e) => (
              <option key={e.code} value={String(e.name) + "//" + e.code}>
                {e.name}
              </option>
            ))}
          </select>

          <select id="ward" name="ward" onChange={(e) => setData({ ...data, ward: e.target.value })}>
            <option value="0" defaulvalue={0}>
              --Chọn Xã/Phường--
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
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
          <span className="mb-2 ml-2 text-[#333]">Địa chỉ nhà</span>
        </div>
      </div>

      <div className="w-5/12 h-full">
        <div className=" bg-slate-50 mt-5 rounded-2xl flex border-solid border-[1px] p-5 justify-evenly w-full">
          <Button variant="outlined" color="error" className="!font-semibold !w-32">
            Quay lại
          </Button>
          <Button variant="contained" className="!bg-primary !font-semibold" onClick={handleSubmit}>
            Hoàn thành
          </Button>
        </div>
        <div className=" bg-slate-50 mt-5 rounded-2xl border-solid border-[1px] p-5">
          <p>Hướng dẫn:</p>
        </div>
      </div>
    </>
  );
};

export default StepTwo;
