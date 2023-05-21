import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logo, sun } from "../assets";
import { starterNavlinks, backerNavlinks } from "../constants";

import { Logger } from "../components";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick, WhiteTheme }) => (
  <div title={name} 
    className={`w-[48px] h-[48px] rounded-[10px] ${ isActive === name && WhiteTheme && "box-shadow-icon"} 
    ${ isActive === name && !WhiteTheme && "bg-[#2c2f32]" } flex justify-center items-center ${!disabled && "cursor-pointer" } ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? 
      ( <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" /> ) : 
      ( <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`} /> )
    }
  </div>
);

const Sidebar = ({ isStarter, WhiteTheme, setIsWhiteTheme }) => {
  const navigate = useNavigate();

  const [navlinks, setNavLinks] = useState([]);
  const [isLogging, setIsLogging] = useState(false);
  const [logger, setLogger] = useState({
    on: false,
    error: false,
    message: "",
  });
  const [isActive, setIsActive] = useState("dashboard");

  useEffect(() => {
    if (isStarter) setNavLinks(starterNavlinks);
    else setNavLinks(backerNavlinks);
  }, [isStarter]);

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      {isLogging && <Logger {...logger} />}
      <Link to="/">
        <Icon WhiteTheme={WhiteTheme} styles="w-[52px] h-[52px] bg-[#ffffff] box-shadow" imgUrl={logo} />
      </Link>

      <div className={`flex-1 flex flex-col justify-between items-center ${WhiteTheme ? "bg-[#ffffff] box-shadow " : "bg-[#1c1c24]"} rounded-[20px] w-[76px] py-4 mt-8`}>
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon 
              WhiteTheme={WhiteTheme}
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                setIsActive(link.name);

                if(link.name == 'logout') {
                  setLogger({ error: false, message: 'Logging Out', handleClick: () => { setIsLogging(false); navigate('/login')}})
                  setIsLogging(true)
                } else {
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        <Icon isActive={isActive} name="theme" WhiteTheme={WhiteTheme} styles="transparent" imgUrl={sun} handleClick = {() => { setIsWhiteTheme(!WhiteTheme)} }/>
      </div>
    </div>
  );
};

export default Sidebar;
