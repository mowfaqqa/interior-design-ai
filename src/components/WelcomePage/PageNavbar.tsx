import Link from "next/link";
import ScreenScale from "../ScreenScale";

const PageNavbar: React.FC<{ className?: string }> = ({ className = "" }) => {
  const xml: React.ReactElement = (
    <header
      className={
        "bg-[linear-gradient(90deg,_#2F2F2F_0%,_#444444_100%)] " + className
      }
    >
      <ScreenScale
        className="!w-[127.2rem] flex justify-between items-center "
        type="nav"
      >
        {/* IMAGE */}
        <div className="relative my-[1.5rem]">
          <img
            src="/logo-white.png"
            alt=""
            className="w-[21rem] h-[4rem] inline-block"
          />
          <Link href="/" className="absolute top-0 left-0 w-full h-full"></Link>
        </div>

        {/* LINKS */}
        <ul className="flex">
          <li className="relative mr-[6.91rem]">
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
          <li className="relative mr-[6.426rem]">
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
          <li className="relative mr-[6.99rem]">
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
      </ScreenScale>
    </header>
  );
  return xml;
};

export default PageNavbar;
