import Container from "./container";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

const Header = () => {
  return (
    <>
      <div className="w-full    z-10  h-[100px] flex justify-center">
        <Container>
          <div className="w-full h-full flex  rounded-b-2xl px-2 justify-between items-center">
            <div className="w-[42px] h-[42px] bg-[#F2F2F2] rounded-full flex justify-center items-center">
              <HiOutlineMenuAlt2 />
            </div>

            <div>
              <img src="/imgs/logo.svg" alt="logo" />
            </div>

            <div className="flex items-center w-[42px] h-[42px] rounded-full overflow-hidden">
              <img src="/imgs/avatar.jpg" alt="avatar" />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
