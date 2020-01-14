import axios from "axios";

export default axios.create({
  baseURL: "https://www.outpostr.com",
  timeout: 1000,
});
