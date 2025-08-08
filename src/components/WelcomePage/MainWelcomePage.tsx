import Link from "next/link";
import ScreenScale from "../ScreenScale";

const MainWelcomePage: React.FC = () => {
  const xml: React.ReactElement = (
    <main className="h-[calc(100dvh-7rem)] bg-[#242426] pt-[5.5rem] max-lg:pt-[2.5rem]">
      <h2 className="mb-[4.1rem] font-semibold text-[2.4rem] leading-[120%] text-center tracking-[-0.02em] text-white fustat max-lg:mb-[1.7rem]">
        Bienvenue
      </h2>
      {/* ITEMS */}
      <ScreenScale className="!w-[105.2rem] flex gap-[2.5rem] h-[33.4rem] max-lg:w-[83.6094527363182%] max-lg:flex-col max-lg:h-[unset] max-lg:gap-[1.5rem]">
        {/* UPLOAD */}
        <div className="flex-[1_0_0] max-lg:flex-auto max-lg:h-[23.1rem]">
          <input type="file" name="file" id="upload" className="hidden" />
          <label
            htmlFor="upload"
            className="flex flex-col justify-center items-center rounded-[0.8rem] bg-[linear-gradient(270deg,_#444444_0%,_#2F2F2F_100%)] border-dashed border-[0.1rem] border-[#00EEFF] h-full"
          >
            <span className="text-[#B3B3B3] fustat text-[1.2rem] mb-[0.8rem] font-semibold text-center">
              Démarrer un projet rapidement
            </span>
            <span className="fustat text-[1.8rem] text-white font-bold text-center">
              Importer une photo <br /> de votre pièce
            </span>
          </label>
        </div>
        {/*  */}
        <div className="flex-[1_0_0] flex flex-col gap-[2.5rem] max-lg:gap-[1.5rem] max-lg:h-[17.5rem] max-lg:flex-auto">
          <article
            className={`flex-[1_0_0] rounded-[0.8rem] bg-[linear-gradient(270deg,_#444444_0%,_#2F2F2F_100%)] relative flex justify-center items-center text-center`}
          >
            <span className="fustat font-bold text-[1.8rem] text-white text-center">
              Nouveau projet
            </span>
            <Link
              href="/newproject"
              className="absolute top-0 left-0 inline-block w-full h-full"
            ></Link>
          </article>
          <article
            className={`flex-[1_0_0] rounded-[0.8rem] bg-[linear-gradient(270deg,_#444444_0%,_#2F2F2F_100%)] flex justify-center items-center text-center`}
          >
            <span className="fustat font-bold text-[1.8rem] text-white text-center">
              Mes projets
            </span>
          </article>
        </div>
        {/*  */}
        <article className="flex-[1_0_0] flex flex-col justify-center items-center rounded-[0.8rem] bg-[linear-gradient(270deg,_#444444_0%,_#2F2F2F_100%)] max-lg:flex-auto max-lg:h-[8rem]">
          <span className="fustat font-bold text-[1.8rem] text-center text-white">
            Comment ça marche ?
          </span>
        </article>
      </ScreenScale>
    </main>
  );
  return xml;
};

export default MainWelcomePage;
