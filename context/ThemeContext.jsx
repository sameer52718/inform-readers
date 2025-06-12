import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { useDispatch } from "react-redux";
import { setConfig } from "@/store/config";

export const ConfigContextProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get("/common/config");
        if (!data.error) {
          dispatch(setConfig(data.data));
        }
      } catch (error) {
        handleError(error);
      }
    };
    getData();
  }, []);

  return children;
};
