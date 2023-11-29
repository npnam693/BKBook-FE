import { useState, useEffect, useCallback, } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { UserState } from "../../Context/UserProvider";
import axiosClient from '../../api/axiosClient.js';
import RoomItem from "../../components/RoomItem/index.js";
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          width: "100%",
          marginBottom: "30px",
          marginTop: "30px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "15px",
          fontSize: "12px",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          height: "42px",
          color: "white",
        },
      },
    },
  },
  palette: {
    bkmotel: {
      main: "#00A699",
    },
    defaultBtn: {
      main: "#ccc",
    },
  },
});

function MyUploadPage() {
  const { userInfo } = UserState();
  const [myBooks, setMyBooks] = useState([]);
  const navigate = useNavigate()

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };


  useEffect(() => {
    axiosClient.get('/api/books/me', config).then(data => setMyBooks(data.data))
  }, []);
  

  return (
    <div className="w-layoutWith mx-auto">
      <h2 className="font-bold text-xl mb-5">Các tin đã đăng bán</h2>

      <div className="flex flex-wrap">
        {myBooks.map(book =>
          ( book.isSelling && <div onClick={() => navigate(`/detail/${book._id}`)}>
            <RoomItem data={book} hiddenAction={true} />
          </div>)
        )}
      </div>
    </div>
  );
}

export default MyUploadPage;
