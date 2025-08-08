import Link from "next/link";
import React from "react";
import AuthFormNavbar from "./AuthFormNavbar";

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
        <img
          src="/FrameShowcase.png"
          className="absolute w-full h-full top-0 left-0 blur-[2rem]"
        />
        {children}
      </section>
    </>
  );
  return xml;
};

export default AuthFormWrapper;
