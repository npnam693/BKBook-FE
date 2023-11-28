import React, { useRef, useState } from "react";
import { CONDITIONS, GENRES } from "../../const/book";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
const StepOne = ({setStep}) => {
  const inputRef = useRef();

  const [data, setData] = useState({
    name: "",
    author: "",
    originalPrice: "",
    price: "",
    genre: "",
    condition: "",
    desc: "",
    images: [],
    urlImgs: [],
  });



  const handleSelectFile = async (e) => {
    if (data.images.length > 10) {
      toast.warn("Chỉ có thể đăng tối đa 10 hình ảnh!")
      return
    }
    const urlImgs = await Promise.all(
      Array(e.target.files.length)
        .fill(0)
        .map(async (_, index) => {
         return await getPromiseReader(e.target.files[index])}
        )
    );
    
    setData({ ...data, images: e.target.files ,urlImgs: [...data.urlImgs, ...urlImgs]});
  };

  const getPromiseReader = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    if (data.name === "" || data.author === "" || data.originalPrice === "" || data.price === "" || 
      data.genre === "" || data.condition === "" || data.urlImgs.length === 0
    ) {
      toast.warn("Vui lòng điền đủ các thông tin cần thiết")
      return
    }
    else {
      localStorage.setItem('newBook-step1', JSON.stringify( {...data, done: true}))
      setStep(step => step + 1)
    }
  }

  return (
    <>
      <div className="w-8/12 h-auto bg-slate-50 mt-5 rounded-2xl border-solid border-[1px] p-5">
        <div className="flex flex-col-reverse group mb-5">
          <input
            placeholder="Nhập tên sách muốn đăng tin"
            id=""
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <span className="mb-2 ml-2 text-[#333]">Tên sách</span>
        </div>

        <div className="flex flex-col-reverse  mb-5">
          <input placeholder="Nhập tên tác giả" id="" onChange={(e) => setData({ ...data, author: e.target.value })} />
          <span className=" mb-2 ml-2 text-[#333]">Tác giá</span>
        </div>
        <div className="flex w-full gap-x-5">
          <div className="flex flex-col-reverse basis-1/2 mb-5">
            <input
              placeholder="Giá sách gốc"
              id=""
              type="number"
              onChange={(e) => setData({ ...data, originalPrice: e.target.value })}
            />
            <span className=" mb-2 ml-2 text-[#333]">Giá gốc</span>
          </div>
          <div className="flex flex-col-reverse basis-1/2 mb-5">
            <input
              placeholder="Giá bán sách"
              id=""
              type="number"
              onChange={(e) => setData({ ...data, price: e.target.value })}
            />
            <span className=" mb-2 ml-2 text-[#333]">Giá bán</span>
          </div>
        </div>
        <div className="flex gap-x-5 mb-5">
          <div className="flex flex-col basis-1/2">
            <span className="mb-2 ml-2 text-[#333]">Thể loại</span>
            <select className="bg-transparent text-black" onChange={(e) => setData({ ...data, genre: e.target.value })}>
              <option value={0}>Chọn thể loại sách</option>
              {GENRES.map((genre, index) => (
                <option value={genre} key={index}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col ml-2 basis-1/2 gap-x-5">
            <span className="mb-2  text-[#333]">Tình trạng sách</span>
            <select
              className="bg-transparent text-black"
              onChange={(e) => setData({ ...data, condition: Number(e.target.value) })}>
              <option value={0}>Chọn tình trang sách</option>
              {CONDITIONS.map((condition, index) => (
                <option value={index} key={index}>
                  {condition.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          className="bg-transparent border-[1px] border-solid border-[#ccc] text-base w-full p-2 max-h-[200px]"
          placeholder="Nhập mô tả về sách (tuỳ chọn)"
          onChange={(e) => setData({ ...data, desc: e.target.value })}
        />

        <div onClick={() => inputRef.current.click()}>
          <span className="mb-2 ml-2 text-[#333]">
            Hình ảnh sách ({data.images !== undefined ? data.images.length : "0"}/10)
          </span>

          <div className="flex flex-wrap gap-x-5 gap-y-5">
            {data.urlImgs.map((image, index) => (
              <img src={image} width={32*4} height={32*4} alt="anhdep"  className="object-cover w-32 h-32 border-[1px] text-4xl border-solid border-[#ccc]"/>
            ))}
            <div className="w-32 h-32 border-[1px] text-4xl border-solid border-[#ccc] font-bold flex items-center justify-center cursor-pointer hover:bg-[#bbb]">
              +
            </div>
          </div>
        </div>
      </div>
      <div className="w-5/12 h-full">
        <div className=" bg-slate-50 mt-5 rounded-2xl border-solid border-[1px] p-5">
          <p>Hướng dẫn:</p>
        </div>

        <div className=" bg-slate-50 mt-5 rounded-2xl flex border-solid border-[1px] p-5 justify-evenly w-full">
          <Button variant="outlined" color="error" className="!font-semibold !w-32">Quay lại</Button>
          <Button variant="contained" className="!bg-primary !font-semibold" onClick={handleSubmit}>Hoàn thành</Button>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelectFile}
        ref={inputRef}
        className="absolute invisible"
      />
    </>
  );
};

export default StepOne;
