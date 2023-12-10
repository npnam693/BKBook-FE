import React, { useEffect, useState } from "react";
import MomoIcon from "../../assets/imgs/momo.png";
import VnpayIcon from "../../assets/imgs/vnpay.jpg";
import Banking from "../../assets/imgs/banking.png";
import VisaIcon from "../../assets/imgs/visa.png";
import { Button } from "@mui/material";
import { UserState } from "../../Context/UserProvider";
import { toast } from "react-toastify";
import { bkBookApi } from "../../api/axiosClient";
const StepTwo = ({ setStep }) => {
  const { userInfo } = UserState();
  const [data, setData] = useState({
    province: userInfo.province,
    district: userInfo.district,
    ward: userInfo.ward,
    address: userInfo.address,
    momo: userInfo.phoneNumbe,
    nameMomo: userInfo.name,
    name: userInfo.name,
    phone: userInfo.phoneNumber,
    verified: false,
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const getProvinces = async () => {
      const res = await bkBookApi.getProvinces();
      setProvinces(res.data.data);
    };
    const getDistricts = async () => {
      const res = await bkBookApi.getDistricts(data.province.split("//")[1]);
      setDistricts(res.data.data);
    };

    const getWards = async () => {
      const res = await bkBookApi.getWards(data.district.split("//")[1]);
      setWards(res.data.data);
    };

    if (provinces.length === 0) getProvinces();
    if (data.province) getDistricts();
    if (data.district) getWards();
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
      toast.warn("Vui lòng điền đầy đủ các thông tin cần thiết");
    } else {
      localStorage.setItem(
        "newBook-step2",
        JSON.stringify({
          ...data,
          done: true,
          province: data.province,
          district: data.district,
          ward: data.ward,
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
              defaultValue={data.phone}
            />
            <span className="mb-2 ml-2 text-[#333]">Số điện thoại momo</span>
          </div>

          <div className="flex flex-col-reverse group mb-5 basis-1/2">
            <input
              placeholder="Nhập tên người dùng momo "
              id=""
              onChange={(e) => setData({ ...data, nameMomo: e.target.value })}
              defaultValue={data.name}
            />
            <span className="mb-2 ml-2 text-[#333]">Tên người dùng Momo</span>
          </div>
        </div>


        <p className="font-bold mb-5 mt-5">Thông tin vận chuyển</p>

        <div className="flex gap-x-5">
          <div className="flex flex-col-reverse group mb-5 basis-1/2">
            <input
              placeholder="Nhập số điện thoại liên hệ "
              id=""
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              defaultValue={data.phone}
            />
            <span className="mb-2 ml-2 text-[#333]">Số điện thoại</span>
          </div>

          <div className="flex flex-col-reverse group mb-5 basis-1/2">
            <input
              placeholder="Nhập họ và tên "
              id=""
              onChange={(e) => setData({ ...data, name: e.target.value })}
              defaultValue={data.name}
            />
            <span className="mb-2 ml-2 text-[#333]">Họ và tên</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-4 justify-between content-between w-full">
          <select
            id="province"
            name="province"
            onChange={(e) => {
              setWards([]);
              setData({ ...data, province: e.target.value, district: "", ward: "" });
            }}
            value={data.province}>
            <option key={""} value="">
              --Chọn Tỉnh/Thành phố--
            </option>
            {provinces.map((item) => (
              item.NameExtension &&
              <option key={item.ProvinceID} value={item.NameExtension[0] + "//" + item.ProvinceID}>
                {item.NameExtension[0]}
              </option>
            ))}
          </select>
          <select
            id="district"
            name="district"
            onChange={(e) => setData({ ...data, district: e.target.value, ward: "" })}
            value={data.district}>
            <option key={""} value="">
              --Chọn Quận/Huyện--
            </option>
            {districts.map((item) => (
              item.NameExtension &&
              <option key={item.DistrictID} value={item.NameExtension[0] + "//" + item.DistrictID}>
                {item.NameExtension[0]}
              </option>
            ))}
          </select>

          <select id="ward" name="ward" onChange={(e) => setData({ ...data, ward: e.target.value })} value={data.ward}>
            <option key={""} value="">
              --Chọn Xã/Phường--
            </option>
            {wards.map((item) => (
              item.NameExtension &&
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
            onChange={(e) => setData({ ...data, address: e.target.value })}
            defaultValue={data.address}
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
          <p>
            Để nhận tiền sau khi đơn hàng được bán thành công trên hệ thống của chúng tôi qua ví điện tử Momo, bạn cần
            cung cấp số tài khoản Momo của mình cho chúng tôi.
          </p>
          <p>
            Lưu ý rằng việc cập nhật thông tin số tài khoản Momo là rất quan trọng để chúng tôi có thể chuyển khoản tiền
            cho bạn sau khi đơn hàng được bán thành công. Hãy đảm bảo rằng thông tin bạn cung cấp là chính xác và hoàn
            toàn phù hợp để tránh trục trặc trong quá trình thanh toán.
          </p>

          <p>
            Để đảm bảo shipper có thể lấy đơn hàng của bạn sau khi bán thành công, bạn cũng cần cung cấp thông tin địa
            chỉ và thông tin liên lạc chính xác.
          </p>
        </div>
      </div>
    </>
  );
};

export default StepTwo;
