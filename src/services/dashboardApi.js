import axios from "axios";

export const fetchDashboard = async () => {
    // import.meta.env.VITE_API_BASE_URL
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/overview`);
  return res.data;
};
