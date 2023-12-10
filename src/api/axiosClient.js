import axios from "axios";


const axiosClient = axios.create({
  // baseURL: 'https://bkbook-api.onrender.com',
  baseURL: 'https://ecommerce-api-pvxw.onrender.com/',
  // baseURL: 'http://localhost:5000',
});

class BKBookApi {
  getProvinces = () => {
    return axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
      headers: { token : "914368f7-8f98-11ee-b1d4-92b443b7a897"}
    })
  }
  getDistricts = (provinceId) => {
    return axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district', {
      params: {province_id: provinceId},
      headers: { token : "914368f7-8f98-11ee-b1d4-92b443b7a897"}
    })
  }
  getWards = (districtId) => {
    return axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
      params: {district_id: districtId},
      headers: { token : "914368f7-8f98-11ee-b1d4-92b443b7a897"}
    })
  }
  countShippingFee = (
    from_district,
    from_ward,
    to_district,
    to_ward,
  ) => {
    console.log(from_district,
      from_ward,
      to_district,
      to_ward,)
    return axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
      params: {
        "from_district_id": Number(from_district),
        "from_ward_code": String(from_ward),
        "service_id":53320,
        "service_type_id":null,
        "to_district_id": Number(to_district),
        "to_ward_code": String(to_ward),
        "height":10,
        "length":10,
        "weight":200,
        "width":10,
        "insurance_value":10000,
        "cod_failed_amount":2000,
        "coupon": null,
      },
      headers: { token : "914368f7-8f98-11ee-b1d4-92b443b7a897"}
    })
  }
}

export const bkBookApi = new BKBookApi();


export default axiosClient;
