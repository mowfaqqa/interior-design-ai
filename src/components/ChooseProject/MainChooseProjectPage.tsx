import Link from "next/link";
import ScreenScale from "../ScreenScale";
import MainPageWrapper from "../WelcomePage/MainPageWrapper";
import OptionBox from "../WelcomePage/OptionBox";

const MainChooseProjectPage: React.FC = () => {
  const xml: React.ReactElement = (
    <MainPageWrapper head="Choisissez un type de projet">
      <ScreenScale className="!w-[69.3rem] flex gap-[2.5rem] h-[33.4rem] max-lg:flex-col max-lg:h-[17.5rem] max-lg:gap-[1.5rem]">
        <Link href={"/choose-interior-style"} passHref>
          <OptionBox>
            <span className="fustat font-bold text-[1.8rem] text-white text-center">
              Résidentiel
            </span>
          </OptionBox>
        </Link>
        <Link href={"/choose-commercial-style"} passHref>
          <OptionBox>
            <span className="fustat font-bold text-[1.8rem] text-white text-center">
              Bureaux
            </span>
          </OptionBox>
        </Link>
      </ScreenScale>
    </MainPageWrapper>
  );
  return xml;
};

export default MainChooseProjectPage;
