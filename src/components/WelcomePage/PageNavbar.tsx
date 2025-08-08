import Link from "next/link";
import ScreenScale from "../ScreenScale";

const PageNavbar: React.FC<{ className?: string }> = ({ className = "" }) => {
  const xml: React.ReactElement = (
    <header
      className={
        "bg-[linear-gradient(90deg,_#2F2F2F_0%,_#444444_100%)] max-lg:bg-[#242426] " +
        className
      }
    >
      <ScreenScale
        className="!w-[127.2rem] flex justify-between items-center max-lg:justify-center max-lg:items-center max-lg:max-w-full max-lg:bg-[#242426]"
        type="nav"
      >
        {/* IMAGE */}
        <div className="relative my-[1.5rem] max-lg:w-full max-lg:m-0 max-lg:py-[1rem]">
          <img
            src="/logo-white.png"
            alt=""
            className="w-[21rem] h-[4rem] block max-lg:w-[83.60945273631842%] max-lg:mx-auto max-lg:h-[6.4rem] max-lg:max-w-[33.611rem]"
          />
          <Link
            href="/"
            className="absolute top-0 left-0 w-full h-full max-lg:block max-lg:w-[83.60945273631842%] max-lg:left-[50%] max-lg:translate-x-[-50%]"
          ></Link>
        </div>

        {/* LINKS */}
        <ul className="flex max-lg:hidden">
          <li className="relative mr-[6.91rem] max-lg:text-center max-lg:m-0">
            <img
              src="/home.png"
              alt="home"
              className="w-[1.955rem] h-[2.2rem]"
            />
            <Link
              href="/"
              className="absolute z-[1] w-full h-full top-0 left-0"
            ></Link>
          </li>
          <li className="relative mr-[6.426rem] max-lg:m-0">
            <img
              src="/tag.png"
              alt="home"
              className="w-[2.271rem] h-[2.3rem]"
            />
            <Link
              href="/"
              className="absolute z-[1] w-full h-full top-0 left-0"
            ></Link>
          </li>
          <li className="relative mr-[6.99rem] max-lg:m-0">
            <img
              src="/cart.png"
              alt="home"
              className="w-[2.379rem] h-[2.3rem]"
            />
            <Link
              href="/"
              className="absolute z-[1] w-full h-full top-0 left-0"
            ></Link>
          </li>
          <li className="relative">
            <img
              src="/user-dark.png"
              alt="home"
              className="w-[2.469rem] h-[2.5rem]"
            />
            <Link
              href="/"
              className="absolute z-[1] w-full h-full top-0 left-0"
            ></Link>
          </li>
        </ul>

        {/* LINKS FOR MOBILE */}
        <div className="max-lg:block hidden bl max-lg:fixed max-lg:bottom-0 max-lg:left-0 w-full max-lg:bg-blend-overlay max-lg:backdrop-blur-[2.5rem]">
          <ul className="flex mx-auto w-[74.06467661691542%] max-lg:justify-between max-lg:h-[8rem] max-lg:items-center ">
            <li className="relative mr-[6.91rem] max-lg:text-center max-lg:m-0">
              <img
                src="/home.png"
                alt="home"
                className="w-[1.955rem] h-[2.2rem] max-lg:w-[1.98rem] block"
              />
              <Link
                href="/"
                className="absolute z-[1] w-full h-full top-0 left-0"
              ></Link>
            </li>
            <li className="relative mr-[6.426rem] max-lg:m-0">
              <img
                src="/tag.png"
                alt="home"
                className="w-[2.271rem] h-[2.3rem] max-lg:w-[2.3rem] block"
              />
              <Link
                href="/"
                className="absolute z-[1] w-full h-full top-0 left-0"
              ></Link>
            </li>
            <li className="relative mr-[6.99rem] max-lg:m-0">
              <img
                src="/cart.png"
                alt="home"
                className="w-[2.379rem] h-[2.3rem] max-lg:w-[2.41rem] block"
              />
              <Link
                href="/"
                className="absolute z-[1] w-full h-full top-0 left-0"
              ></Link>
            </li>
            <li className="relative">
              <img
                src="/user-dark.png"
                alt="home"
                className="w-[2.469rem] h-[2.5rem] max-lg:w-[2.5rem] block"
              />
              <Link
                href="/"
                className="absolute z-[1] w-full h-full top-0 left-0"
              ></Link>
            </li>
          </ul>
        </div>
      </ScreenScale>
    </header>
  );
  return xml;
};

export default PageNavbar;
