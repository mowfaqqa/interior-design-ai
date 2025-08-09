import React from "react";
import AuthFormNavbar from "./AuthFormNavbar";
import Image from "next/image";

const AuthFormWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const xml: React.ReactElement = (
    <>
      <AuthFormNavbar />
      <section
        className={
          "flex justify-center items-center h-[calc(100dvh-5.9rem)] backdrop-blur-[5rem] frame-showcase blur-bg bg-cover bg-no-repeat relative " +
          className
        }
      >
        <Image
          src="/FrameShowcase.png"
          alt=""
          fill
          className="blur-[2rem]"
          priority={false}
          quality={75}
        />
        {children}
      </section>
    </>
  );
  return xml;
};

export default AuthFormWrapper;
