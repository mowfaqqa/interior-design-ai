"use client";
import { useState } from "react";
import CreateLayoutForm from "./CreateLayoutForm";

const CreateLayoutMainSection = () => {
  const [img, setImg] = useState<{ src: string; value: string }>({
    src: "",
    value: "",
  });
  const xml: React.ReactElement = (
    <main className="flex gap-[3.5rem] p-[3.5rem] bg-[#242426] h-[calc(100dvh-7rem)] relative max-lg:px-0 max-lg:justify-center max-lg:items-center max-lg:pb-[9rem] max-lg:min-h-[calc(100dvh-7rem)] max-lg:h-auto">
      <div className="w-[calc((100%-33.4rem)-3.5rem)] max-lg:hidden">
        <input type="file" id="file" className="hidden" />
        <div className="flex justify-center items-center w-full h-full bg-[#1E1E1E] border-dashed border-[0.1rem] border-[#444444]">
          <span className="font-semibold text-[1.8rem] leading-[120%] tracking-[-.02em] text-white">
            Votre rendu apparaitra ici
          </span>
        </div>
      </div>
      <CreateLayoutForm setImg={setImg} img={img} />
      <div className="absolute top-[-1.6rem] left-[12.2rem] w-[22rem] pt-[2.3rem] pb-[0.7rem] rounded-[0.8rem] bg-[#979797] border border-[#444444] text-center z-[1] max-lg:hidden">
        <span className="fustat text-[1.2rem] text-white font-semibold leading-[1.2rem]">
          Créateur de rendu
        </span>
      </div>
    </main>
  );
  return xml;
};

export default CreateLayoutMainSection;
