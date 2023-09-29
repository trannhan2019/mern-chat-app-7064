import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoginUser } from "../../apicalls/users";
import { toast } from "react-hot-toast";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      dispatch(showLoader());
      const response = await LoginUser(user);
      dispatch(hideLoader());
      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="h-screen bg-primary flex items-center justify-center">
      <div className="bg-white shadow-md p-5 flex flex-col gap-5 w-96">
        <div className="flex gap-2">
          <i className="ri-message-3-line text-2xl text-primary"></i>
          <h1 className="text-2xl uppercase font-semibold text-primary">
            Appchat Login
          </h1>
        </div>
        <hr />

        <input
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Enter your email"
        />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter your password"
        />

        <button
          className={
            user.email && user.password ? "contained-btn" : "disabled-btn"
          }
          onClick={login}
        >
          LOGIN
        </button>

        <Link to="/register" className="underline">
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
