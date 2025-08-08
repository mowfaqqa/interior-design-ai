import CreateLayoutMainSection from "@/components/CreateLayout/CreateLayoutMainSection";
import PageNavbar from "@/components/WelcomePage/PageNavbar";

const createlayout: React.FC = () => {
  const xml: React.ReactElement = (
    <>
      <PageNavbar className="[&>nav]:!w-full [&>nav]:!max-w-full px-[12rem] relative z-[2]" />
      <CreateLayoutMainSection />
    </>
  );
  return xml;
};

export default createlayout;
