"use client";

import { useState } from "react";
import Container from "../components/container";
import { FaUser } from "react-icons/fa";
import { FaLock, FaEye } from "react-icons/fa6";
import axios from "axios";
import { RiEyeOffFill } from "react-icons/ri";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [dontHaveAcount, setHaveAcount] = useState(false);

  const [userInfo, setUserInfo] = useState({
    username: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // login
  const handellogin = async () => {
    const postData = {
      username: userInfo.username,
      password: userInfo.password,
    };
    try {
      const response = await axios.post(
        "https://mahmod.puretik.info/api/user/login",
        postData
      );
      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.location.href = "/home";
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  // register
  const handelregister = async () => {
    if (userInfo.password !== userInfo.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const postData = {
      username: userInfo.username,
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
      password: userInfo.password,
      avatar: "avatar.png", // مؤقت
    };

    try {
      const response = await axios.post(
        "https://mahmod.puretik.info/api/user/register",
        postData
      );
      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.location.href = "/home";
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <>
      <div className="w-full h-full flex justify-center">
        <Container>
          <div className="w-full h-full flex flex-col justify-between items-center p-[20px] pt-[70px]">
            <div className="w-full h-full flex justify-start items-center">
              {dontHaveAcount ? (
                <h1 className="text-[36px] font-[800]">
                  Create an <br /> Account
                </h1>
              ) : (
                <h1 className="text-[36px] font-[800]">
                  Welcome <br /> Back!
                </h1>
              )}
            </div>

            {/* form */}
            <div className="w-full h-full mt-10 flex flex-col gap-[40px] items-center">
              {dontHaveAcount && (
                <>
                  {/* Full name */}
                  <div className="w-full h-[55px] flex border-[1px] border-[#a8a8a9] rounded-2xl items-center bg-[#f1f1f1] px-7">
                    <FaUser className="text-[24px] text-[#626262]" />
                    <input
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, name: e.target.value })
                      }
                      type="text"
                      className="w-full h-full"
                      placeholder="Full name"
                    />
                  </div>

                  {/* Phone */}
                  <div className="w-full h-[55px] flex border-[1px] border-[#a8a8a9] rounded-2xl items-center bg-[#f1f1f1] px-7">
                    <FaUser className="text-[24px] text-[#626262]" />
                    <input
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, phone: e.target.value })
                      }
                      type="text"
                      className="w-full h-full"
                      placeholder="Phone number"
                    />
                  </div>

                  {/* Email */}
                  <div className="w-full h-[55px] flex border-[1px] border-[#a8a8a9] rounded-2xl items-center bg-[#f1f1f1] px-7">
                    <FaUser className="text-[24px] text-[#626262]" />
                    <input
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, email: e.target.value })
                      }
                      type="email"
                      className="w-full h-full"
                      placeholder="Email"
                    />
                  </div>
                </>
              )}

              {/* Username */}
              <div className="w-full h-[55px] flex border-[1px] border-[#a8a8a9] rounded-2xl items-center bg-[#f1f1f1] px-7">
                <FaUser className="text-[24px] text-[#626262]" />
                <input
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, username: e.target.value })
                  }
                  type="text"
                  className="w-full h-full"
                  placeholder="Username"
                />
              </div>

              {/* Password */}
              <div className="w-full h-[55px] flex rounded-2xl items-center border-[1px] border-[#a8a8a9] bg-[#f1f1f1] px-7">
                <FaLock className="text-[24px] text-[#626262]" />
                <input
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, password: e.target.value })
                  }
                  type={showPassword ? "text" : "password"}
                  className="w-full h-full "
                  placeholder="Password"
                />

                {showPassword ? (
                  <RiEyeOffFill
                    className="text-[24px] text-[#626262]"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    className="text-[24px] text-[#626262]"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>

              {/* Confirm Password */}
              {dontHaveAcount && (
                <div className="w-full h-[55px] flex rounded-2xl items-center border-[1px] border-[#a8a8a9] bg-[#f1f1f1] px-7">
                  <FaLock className="text-[24px] text-[#626262]" />
                  <input
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        confirmPassword: e.target.value,
                      })
                    }
                    type={showPassword2 ? "text" : "password"}
                    className="w-full h-full"
                    placeholder="Confirm password"
                  />

                  {showPassword2 ? (
                    <RiEyeOffFill
                      className="text-[24px] text-[#626262]"
                      onClick={() => setShowPassword2(false)}
                    />
                  ) : (
                    <FaEye
                      className="text-[24px] text-[#626262]"
                      onClick={() => setShowPassword2(true)}
                    />
                  )}
                </div>
              )}

              {dontHaveAcount ? (
                <p>
                  By clicking the{" "}
                  <span className="text-[#F83758] cursor-pointer">
                    Register
                  </span>{" "}
                  button, you agree to the public offer
                </p>
              ) : (
                <p className="text-[13px] text-[#F83758] w-full font-[600] text-end">
                  Forgot Password?
                </p>
              )}
            </div>

            {/* switch login/register */}
            <div className="w-full h-full flex flex-col gap-[20px] items-center mt-[100px]">
              <div className="w-full ">
                <p className="w-full text-center">
                  {!dontHaveAcount
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <span
                    onClick={() => setHaveAcount(!dontHaveAcount)}
                    className="text-[#F83758] cursor-pointer"
                  >
                    {!dontHaveAcount ? " Sign up" : " Login"}
                  </span>
                </p>
              </div>

              <div className="w-full h-[55px] flex justify-center items-center">
                <button
                  onClick={() => {
                    if (dontHaveAcount) {
                      handelregister();
                    } else {
                      handellogin();
                    }
                  }}
                  className="w-full h-full bg-[#F83758] text-white rounded-2xl flex justify-center items-center"
                >
                  {dontHaveAcount ? "Register" : "Login"}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
