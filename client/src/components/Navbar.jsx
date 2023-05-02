import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useStateContext } from "../context";
import { CustomButton } from "./";
import { logo, menu, search, thirdweb } from "../assets";
import { starterNavlinks, backerNavlinks } from "../constants";
import { Logger } from "../components";

const Navbar = ({ isStarter}) => {
  const navigate = useNavigate();

  const [navlinks, setNavLinks] = useState([])
  const [isLogging, setIsLogging] = useState(false);
  const [logger, setLogger] = useState({
    on: false,
    error: false,
    message: "",
  });
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);

  useEffect(() => {
    if(isStarter)
      setNavLinks(starterNavlinks)
    else
      setNavLinks(backerNavlinks)
  }, [isStarter])

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[32px] gap-6">
      {isLogging && <Logger {...logger} />}
      <div className="lg:flex-1 md:flex-1 flex flex-row max-w-[432px] min-w-[200px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input
          id={"searchAddress"}
          type="text"
          placeholder="Search for user"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />

        <div
          onClick={() => {
            let searchAddress = (
              document.getElementById("searchAddress").value || ""
            ).trim();
            if (!searchAddress) return;
            if (!searchAddress.startsWith("0x"))
              searchAddress = "0x" + searchAddress;
            navigate(`/user/${searchAddress}`);
          }}
          className="w-[72px] h-full rounded-[20px] bg-[#116f41] flex justify-center items-center cursor-pointer"
        >
          <img
            src={search}
            alt="get starter details"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={"Create a project"}
          styles={"bg-[#116f41]"}
          handleClick={() => {
            navigate("create-project");
          }}
        />

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img
              src={thirdweb}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  if (link.name == "logout") {
                    setLogger({
                      error: false,
                      message: "Logging Out",
                      handleClick: () => {
                        setIsLogging(false);
                        navigate("/login");
                      },
                    });
                    setIsLogging(true);
                  } else {
                    navigate(link.link);
                  }
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#116f41]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={"Create new Project"}
              styles={"bg-[#116f41]"}
              handleClick={() => {
                navigate("create-project");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
