import { useState } from "react";

const InputField: React.FC<{
  id: string;
  label?: string;
  className?: string;
  placeholder: string;
  type: string;
}> = ({ id, label, className, type, placeholder }) => {
  //SELECT & FILE STATES
  let selectValue, setSelectValue, file, setFile: any;
  if (type === "select") [selectValue, setSelectValue] = useState("");
  if (type === "file") [file, setFile] = useState("");
  const xml = (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-[0.8rem] text-white text-[1.6rem] leading-[140%] inline-block"
      >
        {label}
      </label>
      {/* INPUT */}
      {type !== "select" && type !== "textarea" && type !== "file" && (
        <input
          className="px-[1.6rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] w-full h-[4rem] text-[1.6rem] leading-[100%] text-white placeholder:text-white/40"
          type={type}
          placeholder={placeholder}
          id={id}
        />
      )}
      {/* SELECT */}
      {type === "select" && (
        <div
          tabIndex={1}
          className="bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] w-full h-[4rem] px-[1.6rem] focus:outline-white focus:outline-1 relative"
        >
          <select
            className="w-full h-full text-[1.6rem] leading-[100%] text-white outline-0"
            onFocus={(e) => {
              e.target.parentElement?.focus();
            }}
          ></select>
          {!selectValue && (
            <span className="absolute text-[1.6rem] leading-[100%] text-white/40 left-[1.6rem] top-[50%] t-y-50">
              {placeholder}
            </span>
          )}
        </div>
      )}
      {/* TEXTAREA */}
      {type === "textarea" && (
        <textarea
          className="px-[1.6rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] w-full text-[1.6rem] leading-[140%] text-white placeholder:text-white/40 h-[8.9rem] py-[1.2rem]"
          placeholder={placeholder}
          id={id}
        ></textarea>
      )}
      {/* FILE */}
      {type === "file" && (
        <div className="px-[1.6rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] w-full h-[4rem] text-[1.6rem] leading-[100%] text-white/40 py-[1.2rem] flex items-center">
          <label htmlFor={id} className="flex-grow inline-block">
            {file ? file : placeholder}
          </label>
          <img
            src="/upload.png"
            alt="upload"
            className="w-[1.6rem] h-[1.6rem] inline-block"
          />
          <input
            type={type}
            className="hidden"
            id={id}
            onChange={(e) => {
              const val: string = e.target.value.split("\\")[2];
              setFile(val);
            }}
          />
        </div>
      )}
    </div>
  );
  return xml;
};

export default InputField;
