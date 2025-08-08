const AuthSubmitButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  img?: string;
}> = ({ children, className, img }) => {
  const xml: React.ReactElement = (
    <button
      type="submit"
      className={
        "block w-full p-[1.2rem] gap-[0.8rem] bg-[#f5f5f5] border border-[#f5f5f5] rounded-[0.8rem] font-['Inter'] text-[1.6rem] leading-[1] text-[#1E1E1E] " +
        className
      }
    >
      {children}
      {img && <img src={img} alt={img.split(".")[0]} />}
    </button>
  );
  return xml;
};

export default AuthSubmitButton;
