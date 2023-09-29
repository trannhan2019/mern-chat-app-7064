import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { GetCurrentUser, GetAllUsers } from "../apicalls/users";
import { GetAllChats } from "../apicalls/chats";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllUsers, setUser, setAllChats } from "../redux/userSlice";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userReducer);

  const getCurrentUser = async () => {
    try {
      dispatch(showLoader());
      const response = await GetCurrentUser();
      const allUsersResponse = await GetAllUsers();
      const allChatsResponse = await GetAllChats();

      dispatch(hideLoader());
      if (response.success) {
        dispatch(setUser(response.data));
        dispatch(setAllUsers(allUsersResponse.data));
        dispatch(setAllChats(allChatsResponse.data));
      } else {
        toast.error(response.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-100 p-2">
      {/* header */}
      <div className="flex justify-between p-5 bg-primary rounded">
        <div className="flex items-center gap-1">
          <i className="ri-message-3-line text-2xl text-white"></i>
          <h1
            className="text-white text-2xl uppercase font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            SHEYCHAT
          </h1>
        </div>
        <div className="flex gap-2 text-md items-center bg-white p-2 rounded">
          {user?.profilePic && (
            <img
              src={user?.profilePic}
              alt="profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          {!user?.profilePic && (
            <i className="ri-shield-user-line text-primary"></i>
          )}
          <h1
            className="underline text-primary cursor-pointer"
            onClick={() => {
              navigate("/profile");
            }}
          >
            {user?.name}
          </h1>
          <i
            className="ri-logout-circle-r-line ml-5 text-xl cursor-pointer text-primary"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          ></i>
        </div>
      </div>
      {/* header */}
      {/* content (pages) */}
      <div className="py-5">{children}</div>
    </div>
  );
};

export default ProtectedRoute;
