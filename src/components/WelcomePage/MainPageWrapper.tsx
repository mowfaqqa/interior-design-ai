const MainPageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  head: string;
}> = ({ children, className = "", head }) => {
  const xml: React.ReactElement = (
    <main
      className={"h-[calc(100dvh-7rem)] bg-[#242426] pt-[5.5rem] " + className}
    >
      <h2 className="mb-[4.9rem] font-semibold text-[2.4rem] leading-[120%] text-center tracking-[-0.02em] text-white fustat">
        {head}
      </h2>
      {children}
    </main>
  );
  return xml;
};

export default MainPageWrapper;
