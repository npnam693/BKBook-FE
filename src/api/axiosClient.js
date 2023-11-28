import axios from "axios";


const axiosClient = axios.create({
  // baseURL: 'https://bkmotel-api.onrender.com',
  baseURL: 'http://localhost:5000',
});



export default axiosClient;
