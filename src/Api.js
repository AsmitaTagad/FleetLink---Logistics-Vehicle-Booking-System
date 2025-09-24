import axios from "axios";
const Api = axios.create({
  baseURL: import.meta.env.API_URL ,
});
export default Api;
