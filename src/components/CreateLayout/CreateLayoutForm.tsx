import Image from "next/image";
import AuthSubmitButton from "../AuthForm/AuthSubmitButton";
import InputField from "../AuthForm/InputField";

const CreateLayoutForm: React.FC<{
  setImg: React.Dispatch<React.SetStateAction<{ src: string; value: string }>>;
  img: { src: string; value: string };
}> = ({ setImg, img }) => {
  // CHOOSE FILE
  function chooseFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImg({ src: url, value: file.name });
    }
  }

  const xml: React.ReactElement = (
     <form className="w-[33.4rem] max-lg:w-[83.60945273631842%]">
      <h2 className="fustat font-semibold text-[2.4rem] leading-[120%] tracking-[-0.02em] text-white mb-[1.4rem] max-lg:text-center max-lg:mb-[1.2rem]">
        Créez votre aménagement
      </h2>
      {/* UPLOAD SECTION */}
      <div className="mb-[1.5rem]">
        <label
          htmlFor="upload"
          className="font-[Inter] text-[1.6rem] leading-[140%] text-white inline-block mb-[0.8rem]"
        >
          Importez une ou des photos de la pièce
        </label>
        <label
          htmlFor="upload"
          className="bg-[#1E1E1E] border-dashed border-[0.1rem] border-[#444444] rounded-[0.8rem] h-[15.7rem] flex justify-center items-center  text-center font-[Inter] text-[1.6rem] text-white/40 gap-[1rem]"
        >
          {!img?.value && (
            <>
              <span className="">Choisissez un ou des fichiers</span>
              <Image src="/upload.png" alt="upload" width={16} height={16} />
            </>
          )}
          {img?.value && img.value}
        </label>
        <input
          type="file"
          name="upload"
          id="upload"
          className="hidden invisible"
          onChange={chooseFile}
          accept="image/*"
        />
      </div>
      {/*  */}
      <InputField
        type="select"
        label="Sélectionnez le type de pièce"
        id="piece"
        placeholder="Type de la pièce"
        className="mb-[1.5rem]"
      />
      {/* DIMENSIONS */}
      <div className="mb-[1.5rem]">
        <label
          htmlFor="dimension"
          className="mb-[0.8rem] text-white text-[1.6rem] leading-[140%] inline-block"
        >
          Dimensions de la pièce en mètre
        </label>
        {/* SIZES */}
        <div className="flex gap-[0.9rem]">
          <input
            type="number"
            className="px-[1.6rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] w-[calc(100%/3)] h-[4rem] text-[1.6rem] leading-[100%] text-white placeholder:text-white/40"
            placeholder="Long."
            id="length"
          />
          <input
            type="number"
            className="px-[1.6rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] w-[calc(100%/3)] h-[4rem] text-[1.6rem] leading-[100%] text-white placeholder:text-white/40"
            placeholder="Large."
            id="width"
          />
          <input
            type="number"
            className="px-[1.6rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] w-[calc(100%/3)] h-[4rem] text-[1.6rem] leading-[100%] text-white placeholder:text-white/40"
            placeholder="Haut."
            id="height"
          />
        </div>
      </div>
      {/*  */}
      <InputField
        label="Matériaux souhaités"
        id="fill__"
        type="select"
        placeholder="Matériaux souhaités"
        className="mb-[1.5rem]"
      />
      {/*   */}
      <InputField
        label="Couleur d’ambiance"
        id="fill__"
        type="text"
        placeholder="Couleur d’ambiance"
        className="mb-[1.5rem]"
      />
      {/*  */}
      <InputField
        label="Prompt libre"
        id="fill__"
        type="textarea"
        placeholder="Décrivez plus en détail ce que vous souhaitez..."
        className="mb-[1.5rem]"
      />
      {/* SUBMIT */}
      <AuthSubmitButton
        img="/btn-stars.png"
        className="flex justify-center items-center [&>img]:brightness-0 py-[1.5rem] border-none [&>img]:w-[2.1rem] [&>img]:h-[2rem]"
      >
        Générez votre rendu
      </AuthSubmitButton>
    </form>
  );
  return xml;
};

export default CreateLayoutForm;
