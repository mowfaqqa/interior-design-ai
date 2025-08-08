import ScreenScale from "../ScreenScale";
import MainPageWrapper from "../WelcomePage/MainPageWrapper";
import OptionBox from "../WelcomePage/OptionBox";

const MainChooseProjectPage: React.FC = () => {
  const xml: React.ReactElement = (
    <MainPageWrapper head="Choisissez un type de projet">
      <ScreenScale className="!w-[69.3rem] flex gap-[2.5rem] h-[33.4rem] max-lg:flex-col max-lg:h-[17.5rem] max-lg:gap-[1.5rem]">
        <OptionBox>
          <span className="fustat font-bold text-[1.8rem] text-white text-center">
            Résidentiel
          </span>
        </OptionBox>
        <OptionBox>
          <span className="fustat font-bold text-[1.8rem] text-white text-center">
            Bureaux
          </span>
        </OptionBox>
      </ScreenScale>
    </MainPageWrapper>
  );
  return xml;
};

export default MainChooseProjectPage;
