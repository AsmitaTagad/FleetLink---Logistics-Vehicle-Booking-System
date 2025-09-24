import { useDispatch } from "react-redux";
import { getUserByToken } from "./slicer/authSlicer";
import { useEffect } from "react";

const API =()=>{
    const dispatch = useDispatch();

useEffect(() => {
  dispatch(getUserByToken());
}, [dispatch]);
    return null
}


export default API;