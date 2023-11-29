import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import QRCode from "qrcode.react";
import axiosClient from "../../api/axiosClient";
import { UserState } from "../../Context/UserProvider";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { storage } from "../../firebase";
import {CircularProgress} from "@mui/material";
import { useNavigate } from "react-router-dom";
const optionsFee = [2000, 5000, 10000, 20000];
const StepThree = () => {
  const [feePublish, setFeePublish] = useState(2000);
  const [dataBook, setDataBook] = useState(null);
  const { userInfo } = UserState();
  const [uploading, setUploading] = useState(null);
  const [dataPayment, setDataPayment] = useState(null);
  const intervalRef = React.useRef(null)
  const timeoutRef = React.useRef(null)
  const navigate = useNavigate()
  const getRate = (isAll) => {
    const base = isAll ? 75000 : 55000;
    const result = base / feePublish;
    console.log(result, feePublish);
    if (feePublish === 0) return 0;
    else if (result < 0.001) return 0.001;
    else return result;
  };

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  useEffect(() => {
    const data = {
      step1: JSON.parse(localStorage.getItem("newBook-step1")),
      step2: JSON.parse(localStorage.getItem("newBook-step2")),
    };
    setDataBook(data);
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
      timeoutRef.current && clearTimeout(timeoutRef.current);
    }
  }, []);

  const uploadFile = async (imageUpload) => {
    const imageRef = ref(storage, `images/${v4()}`);
    const snapshot = await uploadString(imageRef, imageUpload, "data_url");
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  const getAllImage = async () => {
    return Promise.all(
      Array(dataBook.step1.urlImgs.length)
        .fill(0)
        .map(async (_, index) => uploadFile(dataBook.step1.urlImgs[index]))
    );
  };

  const handleConfirm = async () => {
    setUploading(true)
    const imgLinks = await getAllImage();
    const { data } = await axiosClient.post(
      "/api/books",
      {
        name: dataBook.step1.name,
        genre: dataBook.step1.genre,
        author: dataBook.step1.author,
        desc: dataBook.step1.desc,
        image: imgLinks,
        originalPrice: dataBook.step1.originalPrice,
        price: dataBook.step1.price,
        condition: 1,
        publishFee: feePublish,
        address: dataBook.step2.address,
        province: dataBook.step2.province.split('//')[1],
        district: dataBook.step2.district.split('//')[1],
        ward: dataBook.step2.ward.split('//')[1],
        phone: dataBook.step2.phone
      },
      config
    );
    setDataPayment({
      payUrl: data.payment.payUrl,
      deepUrl: data.payment.deeplink,
      id: data.book._id
    })

    setUploading(false)
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(async () => {
        axiosClient.get(`/api/books/${data.book._id}`).then(book => {
          if (book.data.isSelling) {
            alert("Thanh toán thành công, sách của bạn đã được đăng bán.")
            navigate('/')
            clearInterval(intervalRef.current)
            clearTimeout(timeoutRef.current)
          }
        }).catch(err => {
          alert("Thanh toán không thành công. Tin đăng của bạn đã bị huỷ.")   
          navigate('/')
          clearInterval(intervalRef.current)
          clearTimeout(timeoutRef.current)
        })
      }, [5000])
    }, [5000])
  };

  return (
    <>
      <div className="w-7/12 h-auto">
        <div className=" bg-slate-50 mt-5 rounded-2xl border-solid border-[1px] p-5">
          <p className="font-bold">Thông tin giá đấu thầu</p>
          <p className="mb-4 mt-1 text-[#333]">* Mức giá đấu thầu tối thiểu 2.000đ và tối đa 500.000đ </p>
          <div className="flex gap-x-5 mb-5">
            {optionsFee.map((fee, index) => (
              <span
                key={index}
                onClick={() => setFeePublish(fee)}
                className={`border-[1px] border-solid border-[#999] rounded-sm font-bold w-24 py-2 flex
                items-center justify-center hover:border-primary cursor-pointer 
                ${feePublish === fee && "bg-primary text-white shadow-2xl"}`}>
                {fee.toLocaleString("vi", { style: "currency", currency: "VND" })}
              </span>
            ))}
          </div>

          <div className="flex gap-x-5">
            <div className="flex flex-col-reverse group mb-5 basis-1/2">
              <input
                placeholder="Nhập mức đấu thầu mong muốn"
                value={feePublish}
                onChange={(e) => setFeePublish(Number(e.target.value))}
                type="number"
                step={1000}
                min={0}
              />
              <span className="mb-2 ml-2 text-[#333]">Mức giá đấu thầu</span>
            </div>
          </div>

          <div className="">
            <p>
              Mức giá đấu thầu của bạn:{" "}
              <span className="font-bold text-primary">
                {Number(feePublish).toLocaleString("vi", { style: "currency", currency: "VND" })}
              </span>
            </p>
            <p>
              Đạt top <span className="font-bold text-red-500">{getRate(true).toFixed(2)}%</span> sản phẩm ưu tiên xuất
              hiện trên <span className="font-bold">toàn sàn.</span>
            </p>
            <p>
              Đạt top <span className="font-bold text-red-500">{getRate(false).toFixed(2)}%</span> sản phẩm ưu tiên xuất
              hiện với thể loại <span className="font-bold">Trinh thám</span>.
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="contained" className="!bg-primary !mt-4 !ml-auto" onClick={handleConfirm} disabled={uploading === false}>
              Xác nhận
            </Button>
          </div>
        </div>
        <div className="bg-slate-50 mt-5 rounded-2xl border-solid border-[1px] p-5">
          <p className="font-bold mb-5 ">Tổng quan tin đăng</p>
          {dataBook !== null && (
            <>
              <div className="mb-2 min-w-[300px]">
                <p className="font-semibold ">
                  Sách:{" "}
                  <span>
                    {dataBook.step1.name} - {dataBook.step1.author}
                  </span>
                </p>
                <p className="font-semibold ">
                  Giá bìa: <span>{dataBook.step1.originalPrice}</span>.
                </p>
                <p>
                  Giá bán: <span>{dataBook.step1.price}</span>.
                </p>
                <p className="font-semibold ">
                  Tình trạng: <span>{dataBook.step1.condition}</span>.
                </p>
                <p>
                  Thể loại: <span>{dataBook.step1.genre}</span>
                </p>
              </div>

              <div className="mb-2 min-w-[300px]">
                <p className="font-semibold ">
                  Họ và tên: <span>{dataBook.step2.name}</span>
                </p>
                <p className="font-semibold ">
                  Địa chỉ:{" "}
                  <span>
                    {dataBook.step2.address} - {dataBook.step2.ward}, {dataBook.step2.district},{" "}
                    {dataBook.step2.province}
                  </span>
                </p>
                <p className="font-semibold ">
                  Số điện thoại: <span>{dataBook.step2.phone}</span>
                </p>
              </div>

              <div>
                <p className="font-semibold ">
                  Số điện thoại Momo: <span>{dataBook.step2.momo}</span>
                </p>
                <p className="font-semibold ">
                  Tên người dùng Momo: <span>{dataBook.step2.nameMomo}</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-5/12">
        <div className="h-[480px] bg-slate-50 mt-5 rounded-2xl border-solid border-[1px] p-5">
          <p className="font-bold mb-3">Tiến hành thanh toán</p>
          <p>Quét mã QR hoặc nhấn nút bên dưới để đến trang thanh toán.</p>
          
            <div className="h-full flex items-center justify-center">
            {
              uploading === false ?
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
                  <Button variant="contained" className="!bg-primary" 
                    onClick={() => {window.open(dataPayment.payUrl,'_blank')}}
                  >
                    ĐẾN TRANG THANH TOÁN
                  </Button>
                </div>
              </div>
               :
              uploading === null ? 
              <div >
                <p>Nhấn "Xác nhận" để lấy thông tin thanh toán.</p>
              </div> : 
              <div className="flex items-center justify-center flex-col gap-y-5">
                <CircularProgress className="!border-primary" size={50}/>
                <p>Đang xử lý, vui lòng chờ...</p>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default StepThree;
