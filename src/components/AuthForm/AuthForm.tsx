import React from "react";
import InputField from "./InputField";
import AuthSubmitButton from "./AuthSubmitButton";
import Link from "next/link";
type formType = string;

const AuthForm: React.FC<{ type: formType }> = (type) => {
  const signup: React.ReactElement = (
    <>
      <h2 className="text-[2.4rem] font-[600] leading-[120%] tracking-[-0.02em] text-white mb-[0.4rem]">
        C’est facile !
      </h2>
      <h3 className="leading-[140%] text-white/70 text-[1.6rem] mb-[2.4rem]">
        Remplissez ce formulaire
      </h3>
      <InputField
        type="text"
        label="Prénom et nom"
        id="name"
        placeholder="Prénom et nom"
        className="mb-[2.4rem]"
      />
      <InputField
        type="email"
        label="Adresse e-mail"
        id="email"
        placeholder="Adresse électronique"
        className="mb-[2.4rem]"
      />
      <InputField
        type="select"
        label="Vous êtes "
        id="Vous êtes "
        placeholder="Particulier ou Entreprise"
        className="mb-[2.4rem]"
      />
      <InputField
        type="text"
        label="Organisation "
        id="Vous êtes "
        placeholder="Adresse électronique"
        className="mb-[3.6rem]"
      />
      {/* TERMS AND CONDITIONS */}
      <div className="flex gap-[1.2rem] items-center">
        <input
          type="checkbox"
          name="terms"
          id="terms"
          className="w-[1.6rem] aspect-square rounded-[0.4rem] accent-[white]"
        />
        <label
          htmlFor="terms"
          className="text-[1.6rem] leading-[140%] text-white font-[Inter] inline-block"
        >
          J’accepte les conditions et
          <br /> termes d’utilisation
        </label>
      </div>
      <p className="pl-[2.8rem] text-[1.6rem] leading-[140%] underline text-[rgba(255,255,255,0.7)] font-[inter] mb-[2.4rem]">
        Lire nos C&Ts
      </p>
      {/* SUBMIT */}
      <AuthSubmitButton>S’inscrire</AuthSubmitButton>
    </>
  );

  // CONST SIGN IN
  const signin = (
    <>
      <InputField
        type="email"
        label="Adresse e-mail"
        id="email"
        placeholder="Adresse électronique"
        className="mb-[2.4rem]"
      />
      <InputField
        type="password"
        label="Mot de passe"
        id="password"
        placeholder="Mot de passe"
        className="mb-[2.4rem]"
      />
      <AuthSubmitButton className="mb-[2.4rem]">Se connecter</AuthSubmitButton>
      <Link
        href="/auth/signup"
        className="font-[inter] text-[1.6rem] leading-[1.4] underline text-white"
      >
        Mot de passe oublié ?
      </Link>
    </>
  );
  const xml: React.ReactElement = (
    <form className="p-[2.4rem] bg-[rgba(0,0,0,0.7)] border border-[#444444] backdrop-blur-[7px] rounded-[0.8rem] w-[32rem] max-w-[95%]">
      {type.type === "signup" && signup}
      {type.type === "signin" && signin}
    </form>
  );
  return xml;
};

export default AuthForm;
