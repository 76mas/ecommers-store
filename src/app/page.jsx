"use client";
import Container from "./components/container";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import backgroud from "/imgs/background.jpg";
export default function Home() {
  const navgation = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navgation.push("/home");
    }
  }, []);

  const [step, setStep] = useState(0);
  const [next, setNext] = useState(false);
  const Steps = [
    {
      title: "Choose Products",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
      img: "/imgs/steps/step1.svg",
    },
    {
      title: "Get Your Order",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
      img: "/imgs/steps/step2.svg",
    },

    {
      title: "Make Payment",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
      img: "/imgs/steps/step3.svg",
    },
  ];

  return (
    <>
      <div className="flex justify-center min-h-[100vh] w-full h-full">
        {/* get started   */}

        {!next ? (
          <>
            {" "}
            <div className="background flex min-h-[100vh] justify-center items-end   w-full h-full">
              <div className="w-full bg-gradient-to-t from-[#00000086] via-[#000000ac] to-transparent flex justify-center p-[43px] h-full">
                <Container>
                  <div className="w-full  h-full flex flex-col gap-[35px] items-end">
                    <div className="flex w-full  flex-col items-center ">
                      <h1 className="text-white w-full  text-[35px] text-center">
                        You want <br /> Authentic, here <br /> you go!
                      </h1>

                      <p className="text-[#F2F2F2]   text-[15px] ">
                        Find it here, buy it now!
                      </p>
                    </div>

                    <div
                      onClick={() => setNext(true)}
                      className="w-full h-[75px] rounded-2xl bg-[#f83758] flex justify-center items-center text-white"
                    >
                      <h1 className="text-[30px]">Get started</h1>
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="flex min-h-[100vh] justify-center items-center w-full bg-white">
              <div className="w-full h-full flex flex-col justify-between items-center p-4">
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="w-full h-[250px] flex justify-center mb-6">
                    <img
                      src={Steps[step].img}
                      // src="/imgs/steps/step1.svg"
                      alt="s1"
                      className="object-contain w-full "
                    />
                  </div>

                  <div className="text-center px-6">
                    <h1 className="text-[20px] font-[800] text-[#000] mb-2">
                      {Steps[step].title}
                    </h1>
                    <p className="text-[#A8A8A9] text-[14px]">
                      {Steps[step].description}
                    </p>
                  </div>
                </div>

                <div className="w-full flex justify-center items-center pb-6">
                  <Container>
                    <div className="w-full flex justify-between items-center pb-6">
                      <button
                        onClick={() => {
                          setStep(step - 1);
                        }}
                        className={`text-[18px] font-bold text-[#A8A8A9]  ${
                          step === 0 && "z-[-222]"
                        }`}
                      >
                        prev
                      </button>

                      <div className="flex gap-[4px] items-center">
                        <div
                          className={`w-[8px] h-[8px]   ${
                            step === 0
                              ? "bg-[#17223B] w-[30px] "
                              : "bg-[#17223B]/20 "
                          } rounded-full`}
                        ></div>
                        <div
                          className={`w-[8px] h-[8px] ${
                            step === 1
                              ? "bg-[#17223B] w-[30px] "
                              : "bg-[#17223B]/20 "
                          }  rounded-full`}
                        ></div>
                        <div
                          className={`w-[8px] h-[8px] ${
                            step === 2
                              ? "bg-[#17223B] w-[30px] "
                              : "bg-[#17223B]/20 "
                          }  rounded-full`}
                        ></div>
                      </div>

                      <button
                        onClick={() => {
                          if (step === 2) {
                            navgation.push("/login");
                          }
                          if (step !== 2) {
                            setStep(step + 1);
                          }
                        }}
                        className="text-[18px] font-bold text-red-500"
                      >
                        {step === 2 ? "Get started" : "next"}
                      </button>
                    </div>
                  </Container>
                </div>
              </div>
            </div>
          </>
        )}

        {/* first step */}
      </div>
    </>
  );
}
