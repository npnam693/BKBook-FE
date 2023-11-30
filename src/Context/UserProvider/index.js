import React, { createContext, useContext, useState, useEffect} from "react";
import axiosClient from '../../api/axiosClient.js';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")))

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"))
      setUserInfo(user)
      console.log('blo')
      if(user){
        const config = {
          headers: {
              Authorization: `Bearer ${user.token}`
          }
        }
      }
    }, [])



    return (
      <UserContext.Provider
        value={{
            userInfo,
            setUserInfo,
        }}
      >
        {children}
      </UserContext.Provider>
    );
};

export const UserState = () => {
    return useContext(UserContext);
};

export default UserProvider;