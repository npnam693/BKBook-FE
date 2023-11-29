import axiosClient from "../../api/axiosClient.js";
import { useState, Fragment, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HeaderOnlyLogo from "../../layouts/components/Header/HeaderOnlyLogo";
import Footer from "../../layouts/components/Footer";
import styles from "./style.module.css";
import { UserState } from "../../Context/UserProvider";

import {
  Divider,
  TextField,
  Button,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useSnackbar } from "notistack";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";

const snackbarMessage = {
  lackInfo: {
    variant: "warning",
    message: "Bạn phải điền đầy đủ các thông tin cần thiết.",
  },
  wrongConfirmPass: {
    variant: "error",
    message: "Mật khẩu và mật khẩu xác thực không giống nhau",
  },
  notImg: {
    variant: "error",
    message: "Ảnh đại diện tải lên phải là một file ảnh.",
  },
  connectFail: {
    variant: "error",
    message: "Không kết nối được đến server.",
  },
};

function SignUpPage({ children }) {
  const { setUserInfo } = UserState();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  let navigate = useNavigate();
  const [isUpload, setUpload] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
    avatar: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  useEffect(() => {
    const getProvinces = async () => {
      const res = await fetch("https://provinces.open-api.vn/api/p/");
      const resJson = await res.json();
      setProvinces(await resJson);
    };
    const getDistricts = async () => {
      let res = await fetch(`https://provinces.open-api.vn/api/p/${values.province.split("//")[1]}?depth=2`);
      let resArray = await res.json();
      setDistricts(await resArray.districts);
    };
    const getWards = async () => {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${values.district.split("//")[1]}?depth=2`);
      let resArray = await res.json();
      setWards(await resArray.wards);
    };
    if (provinces.length === 0) getProvinces();
    if (values.province) getDistricts();
    if (values.district) getWards();

  }, [values.province, values.district, values.ward]);

  function uploadFile(imageUpload, progessRef) {
    setUpload(true);
    if (imageUpload == null) return;
    if (imageUpload.type !== "image/jpeg" && imageUpload.type !== "image/png" && imageUpload.type !== "image/webp") {
      showSnackbar("notImg");
      setUpload(false);
      return;
    }

    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);

    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setValues({ ...values, avatar: url });
        setUpload(false);
      });
    });
  }

  const handleSubmit = async (values) => {

    for (const key in values) {
      if (values[key] === "") {
        showSnackbar("lackInfo");
        return;
      }
    }

    if (values.confirmPassword !== values.password) {
      showSnackbar("wrongConfirmPass");
      return;
    }

    const { email, password, name, avatar, phoneNumber, address, province, district, ward } = values;
    try {
      const { data } = await axiosClient.post("/api/users", {
        email,
        password,
        name,
        avatar,
        phoneNumber,
        address,
        province: province,
        district: district,
        ward: ward,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
      navigate("/");
    } catch (error) {
      showSnackbarMessage(error.response.data.message);
    }
  };

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const showSnackbar = useCallback(
    (detail) => {
      enqueueSnackbar(snackbarMessage[detail].message, {
        variant: snackbarMessage[detail].variant,

        action: (key) => (
          <Fragment>
            <Button style={{ fontSize: "12px", fontWeight: "600" }} size="small" onClick={() => closeSnackbar(key)}>
              Dismiss
            </Button>
          </Fragment>
        ),
      });
    },
    [enqueueSnackbar, closeSnackbar]
  );
  const showSnackbarMessage = useCallback(
    (message) => {
      enqueueSnackbar(message, {
        variant: "warning",
        action: (key) => (
          <Fragment>
            <Button style={{ fontSize: "12px", fontWeight: "600" }} size="small" onClick={() => closeSnackbar(key)}>
              Dismiss
            </Button>
          </Fragment>
        ),
      });
    },
    [enqueueSnackbar, closeSnackbar]
  );
  return (
    <>
      <HeaderOnlyLogo />

      <div className={styles.inner}>
        <p style={{ fontSize: 16, color: "black", marginBottom: 15 }}>
          Chào mừng bạn đến với
          <span style={{ fontSize: 16, color: "#1488DB", fontWeight: 500 }}> BK</span>
          <span style={{ fontSize: 16, color: "#00A699" }}>Motel</span>.
        </p>

        <p style={{ fontSize: 20, fontWeight: 500, marginBottom: 15 }}>Đăng ký tài khoản mới</p>

        <Divider variant="middle" theme={theme} />
        <ThemeProvider theme={theme}>
          <p className="!text-left w-full font-semibold !text-[#333] mb-4">Thông tin tài khoản</p>
          <TextField
            name="email"
            label="Nhập Email / Tên đăng nhập"
            size="small"
            fullWidth
            color="bkmotel"
            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
          />

          <div className="flex gap-x-5 w-full !h-[40px]">
            <TextField
              name="password"
              label="Nhập mật khẩu"
              type="password"
              variant="outlined"
              color="bkmotel"
              className="flex-1"
              size="small"
              onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
            />

            <TextField
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              variant="outlined"
              color="bkmotel"
              size="small"
              className="flex-1"
              onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
            />
          </div>

          <Divider variant="middle" className="!py-1 !my-2" />
          <p className="!text-left w-full font-semibold !text-[#333] mb-4">Thông tin cá nhân</p>
          <TextField
            name="name"
            label="Họ và tên"
            variant="outlined"
            color="bkmotel"
            fullWidth
            size="small"
            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
          />

          <TextField
            name="phoneNumber"
            label="Số điện thoại"
            variant="outlined"
            color="bkmotel"
            size="small"
            fullWidth
            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
          />
          <p className="!text-left w-full font-semibold !text-[#333] mb-4">Địa chỉ liên hệ</p>

          <div className="grid grid-cols-3 gap-x-4 justify-between content-between w-full">
            <select id="province" name="province" onChange={(e) => setValues({ ...values, province: e.target.value })}>
              <option key={"0"} value="0" defaulvalue={0}>
                --Chọn Tỉnh/Thành phố--
              </option>
              {provinces.map((e) => (
                <option key={e.code} value={String(e.name) + "//" + e.code}>
                  {e.name}
                </option>
              ))}
            </select>

            <select id="district" name="district" onChange={(e) => setValues({ ...values, district: e.target.value })}>
              <option value="0" defaulvalue={0}>
                --Chọn Quận/Huyện--
              </option>
              {districts.map((e) => (
                <option key={e.code} value={String(e.name) + "//" + e.code}>
                  {e.name}
                </option>
              ))}
            </select>

            <select id="ward" name="ward" onChange={(e) => setValues({ ...values, ward: e.target.value })}>
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

          <TextField
            name="address"
            label="Địa chỉ nhà"
            variant="outlined"
            color="bkmotel"
            size="small"
            fullWidth
            className="!mt-4 "
            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
          />

          <div className={styles.fileArea}>
            <label for="images" className="text-base">
              Ảnh đại diện
            </label>
            <input
              className={styles.inputFile}
              type="file"
              name="images"
              id="images"
              required="required"
              multiple="multiple"
              onChange={(e) => uploadFile(e.target.files[0])}
            />
            <div className={styles.fileDummy}>
              <div className={styles.fileSuccess + " text-sm"}>Ảnh đại diện đã được chọn</div>
              <div className={styles.fileDefault + " text-sm"}>Click để chọn ảnh đại diện của bạn</div>
              {isUpload ? (
                <div>
                  <CircularProgress className={styles.iconProgess} />
                </div>
              ) : null}
            </div>
          </div>

          <Button
            style={{ marginLeft: "auto", marginTop: 10, width: 120 }}
            variant="contained"
            size="large"
            color="bkmotel"
            onClick={() => {
              handleSubmit(values);
            }}>
            ĐĂNG KÝ
          </Button>
        </ThemeProvider>
      </div>

      <Footer />
    </>
  );
}

export default SignUpPage;

const theme = createTheme({
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          fontSize: "12px",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          height: "42px",
          color: "white",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          width: "480px",
          marginBottom: "30px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "20px",
          fontSize: "16px",
        },
        input: {
          "&::placeholder": {
            color: "red",
          },
          color: "white", // if you also want to change the color of the input, this is the prop you'd use
        },
      },
    },

    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: "16px",
          fontFamily: "'Josefin Sans', sans-serif",
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        sx: {
          fontSize: "16px",
          fontFamily: "'Josefin Sans', sans-serif",
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        sx: {
          fontSize: "16px",
          fontFamily: "'Josefin Sans', sans-serif",
        },
      },
    },
  },

  palette: {
    bkmotel: {
      main: "#00A699",
    },
  },
});
