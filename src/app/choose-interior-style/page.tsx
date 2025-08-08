"use client";
import InteriorStyleCard from "@/components/InteriorStyle/InteriorStyleCard";
import ScreenScale from "@/components/ScreenScale";
import MainPageWrapper from "@/components/WelcomePage/MainPageWrapper";
import PageNavbar from "@/components/WelcomePage/PageNavbar";
import { useState } from "react";

const chooseinteriorstyle: React.FC = () => {
  const [selected, setSelected] = useState<string>("");
  // SELECT A STYLE
  const selectStyle = (style: string): void => {
    setSelected(style);
  };
  const xml: React.ReactElement = (
    <>
      <PageNavbar />
      <MainPageWrapper head="Choisissez un style d’intérieur">
        <ScreenScale className="!grid grid-cols-5 !w-[98.4rem] gap-[2.1rem] max-lg:grid-cols-3 max-lg:gap-[1rem] max-lg:!w-[83.60945273631842%] max-lg:max-w-[unset]">
          <InteriorStyleCard
            src="/Art déco.png"
            style="Art déco"
            onClick={selectStyle}
            selected={selected}
          />
          <InteriorStyleCard
            src="/Boho.png"
            style="Bohème"
            onClick={selectStyle}
            selected={selected}
          />
          <InteriorStyleCard
            src="/Bord de mer.png"
            style="Bord de mer"
            onClick={selectStyle}
            selected={selected}
          />
          <InteriorStyleCard
            src="/Charme.png"
            style="Rustique"
            onClick={selectStyle}
            selected={selected}
          />
          <InteriorStyleCard
            src="/Contemporaine_.png"
            style="Contemporain"
            onClick={selectStyle}
            selected={selected}
          />
          <InteriorStyleCard
            src="/Ethnique.png"
            style="Ethnique"
            onClick={selectStyle}
            selected={selected}
          />
          <InteriorStyleCard
            src="/Industrielle.png"
            style="Industriel"
            onClick={selectStyle}
            selected={selected}
          />
          <InteriorStyleCard
            src="/Scandinave.png"
            style="Scandinave"
            onClick={selectStyle}
            selected={selected}
          />
          <InteriorStyleCard
            src="/Vintage.png"
            style="Vintage"
            onClick={selectStyle}
            selected={selected}
          />
          <InteriorStyleCard
            src="/minimaliste 1.png"
            style="Minimaliste"
            onClick={selectStyle}
            selected={selected}
          />
        </ScreenScale>
      </MainPageWrapper>
    </>
  );
  return xml;
};

export default chooseinteriorstyle;
