/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  useCreateRoom,
  useUploadRoomImage,
  useGenerateDesign,
} from "@/lib/hooks/api";
import { CreateRoomDto, RoomType, GenerateDesignDto } from "@/types/api";
import { toast } from "react-hot-toast"; // You'll need to install this: npm install react-hot-toast

interface CreateLayoutFormProps {
  setImg: React.Dispatch<React.SetStateAction<{ src: string; value: string }>>;
  img: { src: string; value: string };
  selectedProjectId?: string; // Project ID passed from parent
}

const CreateLayoutForm: React.FC<CreateLayoutFormProps> = ({
  setImg,
  img,
  selectedProjectId,
}) => {
  const [formData, setFormData] = useState<Partial<CreateRoomDto>>({
    projectId: selectedProjectId || "",
    type: RoomType.LIVING_ROOM,
    length: 0,
    width: 0,
    height: 0,
    materials: [],
    ambientColor: "",
    freePrompt: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // React Query hooks
  const createRoomMutation = useCreateRoom();
  const uploadImageMutation = useUploadRoomImage();
  const generateDesignMutation = useGenerateDesign();

  // Update formData when selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId) {
      setFormData((prev) => ({
        ...prev,
        projectId: selectedProjectId,
      }));
      console.log("Updated formData with projectId:", selectedProjectId);
    }
  }, [selectedProjectId]);

  // Debug: Log formData changes
  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  // Handle file selection
  function chooseFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImg({ src: url, value: file.name });
      setSelectedFile(file);
    }
  }

  // Handle form field changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle materials input (convert comma-separated string to array)
  const handleMaterialsChange = (value: string) => {
    const materials = value
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
    handleInputChange("materials", materials);
  };

  // Validate form data
  const validateForm = (): boolean => {
    console.log("Validating form with projectId:", formData.projectId);

    if (!formData.projectId) {
      toast.error(
        "Veuillez sélectionner un projet. Assurez-vous d'avoir suivi le processus complet de création de projet."
      );
      return false;
    }
    if (!formData.type) {
      toast.error("Veuillez sélectionner le type de pièce");
      return false;
    }
    if (!formData.length || formData.length <= 0) {
      toast.error("Veuillez renseigner une longueur valide pour la pièce");
      return false;
    }
    if (!formData.width || formData.width <= 0) {
      toast.error("Veuillez renseigner une largeur valide pour la pièce");
      return false;
    }
    if (!formData.height || formData.height <= 0) {
      toast.error("Veuillez renseigner une hauteur valide pour la pièce");
      return false;
    }
    if (!formData.materials || formData.materials.length === 0) {
      toast.error("Veuillez spécifier au moins un matériau");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted with data:", formData);

    if (!validateForm()) return;

    setIsGenerating(true);

    try {
      // Step 1: Create the room
      console.log("Creating room with data:", formData);
      const room = await createRoomMutation.mutateAsync(
        formData as CreateRoomDto
      );
      toast.success("Pièce créée avec succès!");
      console.log("Room created:", room);

      // Step 2: Upload image if selected
      let imageUrl = "";
      if (selectedFile && room.id) {
        console.log("Uploading image for room:", room.id);
        const uploadResult = await uploadImageMutation.mutateAsync({
          file: selectedFile,
          roomId: room.id,
        });
        imageUrl = uploadResult.url;
        toast.success("Image uploadée avec succès!");
        console.log("Image uploaded:", uploadResult);
      }

      // Step 3: Generate AI design
      const designData: GenerateDesignDto = {
        roomId: room.id,
        customPrompt: formData.freePrompt,
        aiProvider: "replicate", // Default to replicate
      };

      console.log("Generating design with data:", designData);
      const design = await generateDesignMutation.mutateAsync(designData);
      toast.success(
        "Génération du rendu initiée! Cela peut prendre quelques minutes."
      );
      console.log("Design generated:", design);

      // Reset form
      setFormData({
        projectId: selectedProjectId || "",
        type: RoomType.LIVING_ROOM,
        length: 0,
        width: 0,
        height: 0,
        materials: [],
        ambientColor: "",
        freePrompt: "",
      });
      setImg({ src: "", value: "" });
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Error creating layout:", error);

      // More detailed error handling
      let errorMessage = "Erreur lors de la création du rendu";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Display project info for debugging
  const showProjectInfo = () => {
    if (!selectedProjectId) {
      return (
        <div className="mb-[1.5rem] p-[1rem] bg-red-500/20 border border-red-500 rounded-[0.8rem]">
          <p className="text-red-400 text-[1.4rem]">
            ⚠️ Aucun projet sélectionné. Veuillez revenir en arrière et suivre
            le processus de création de projet.
          </p>
        </div>
      );
    }

    return (
      <div className="mb-[1.5rem] p-[1rem] bg-green-500/20 border border-green-500 rounded-[0.8rem]">
        <p className="text-green-400 text-[1.4rem]">
          ✓ Projet ID: {selectedProjectId}
        </p>
      </div>
    );
  };

  return (
    <form className="w-[33.4rem]" onSubmit={handleSubmit}>
      <h2 className="fustat font-semibold text-[2.4rem] leading-[120%] tracking-[-0.02em] text-white mb-[1.4rem]">
        Créez votre aménagement
      </h2>

      {/* PROJECT INFO DEBUG */}
      {showProjectInfo()}

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
          className="bg-[#1E1E1E] border-dashed border-[0.1rem] border-[#444444] rounded-[0.8rem] h-[15.7rem] flex justify-center items-center text-center font-[Inter] text-[1.6rem] text-white/40 gap-[1rem] cursor-pointer hover:border-[#666666] transition-colors"
        >
          {!img?.value ? (
            <>
              <span>Choisissez un ou des fichiers</span>
              <Image src="/upload.png" alt="upload" width={16} height={16} />
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-white">{img.value}</span>
              <span className="text-sm text-green-400">
                Fichier sélectionné
              </span>
            </div>
          )}
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

      {/* ROOM TYPE */}
      <div className="mb-[1.5rem]">
        <label className="font-[Inter] text-[1.6rem] leading-[140%] text-white inline-block mb-[0.8rem]">
          Sélectionnez le type de pièce
        </label>
        <select
          className="w-full px-[1.6rem] py-[1rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] text-[1.6rem] text-white"
          value={formData.type}
          onChange={(e) =>
            handleInputChange("type", e.target.value as RoomType)
          }
          required
        >
          <option value={RoomType.LIVING_ROOM}>Salon</option>
          <option value={RoomType.BEDROOM}>Chambre</option>
          <option value={RoomType.KITCHEN}>Cuisine</option>
          <option value={RoomType.BATHROOM}>Salle de bain</option>
          <option value={RoomType.OFFICE}>Bureau</option>
          <option value={RoomType.DINING_ROOM}>Salle à manger</option>
          <option value={RoomType.BALCONY}>Balcon</option>
          <option value={RoomType.STUDY}>Bureau d&apos;étude</option>
          <option value={RoomType.HALLWAY}>Couloir</option>
          <option value={RoomType.OTHER}>Autre</option>
        </select>
      </div>

      {/* DIMENSIONS */}
      <div className="mb-[1.5rem]">
        <label className="mb-[0.8rem] text-white text-[1.6rem] leading-[140%] inline-block">
          Dimensions de la pièce en mètre
        </label>
        <div className="flex gap-[0.9rem]">
          <input
            type="number"
            step="0.1"
            min="0.1"
            className="px-[1.6rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] w-[calc(100%/3)] h-[4rem] text-[1.6rem] leading-[100%] text-white placeholder:text-white/40"
            placeholder="Long."
            value={formData.length || ""}
            onChange={(e) =>
              handleInputChange("length", parseFloat(e.target.value) || 0)
            }
            required
          />
          <input
            type="number"
            step="0.1"
            min="0.1"
            className="px-[1.6rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] w-[calc(100%/3)] h-[4rem] text-[1.6rem] leading-[100%] text-white placeholder:text-white/40"
            placeholder="Large."
            value={formData.width || ""}
            onChange={(e) =>
              handleInputChange("width", parseFloat(e.target.value) || 0)
            }
            required
          />
          <input
            type="number"
            step="0.1"
            min="0.1"
            className="px-[1.6rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] w-[calc(100%/3)] h-[4rem] text-[1.6rem] leading-[100%] text-white placeholder:text-white/40"
            placeholder="Haut."
            value={formData.height || ""}
            onChange={(e) =>
              handleInputChange("height", parseFloat(e.target.value) || 0)
            }
            required
          />
        </div>
      </div>

      {/* MATERIALS */}
      <div className="mb-[1.5rem]">
        <label className="font-[Inter] text-[1.6rem] leading-[140%] text-white inline-block mb-[0.8rem]">
          Matériaux souhaités
        </label>
        <input
          type="text"
          className="w-full px-[1.6rem] py-[1rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] text-[1.6rem] text-white placeholder:text-white/40"
          placeholder="bois, marbre, acier (séparés par des virgules)"
          onChange={(e) => handleMaterialsChange(e.target.value)}
          required
        />
      </div>

      {/* AMBIENT COLOR */}
      <div className="mb-[1.5rem]">
        <label className="font-[Inter] text-[1.6rem] leading-[140%] text-white inline-block mb-[0.8rem]">
          Couleur d&apos;ambiance
        </label>
        <input
          type="text"
          className="w-full px-[1.6rem] py-[1rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] text-[1.6rem] text-white placeholder:text-white/40"
          placeholder="blanc chaud, bleu doux, etc."
          value={formData.ambientColor || ""}
          onChange={(e) => handleInputChange("ambientColor", e.target.value)}
        />
      </div>

      {/* FREE PROMPT */}
      <div className="mb-[1.5rem]">
        <label className="font-[Inter] text-[1.6rem] leading-[140%] text-white inline-block mb-[0.8rem]">
          Prompt libre
        </label>
        <textarea
          className="w-full px-[1.6rem] py-[1rem] bg-[#1E1E1E] border border-[#444444] rounded-[0.8rem] text-[1.6rem] text-white placeholder:text-white/40 min-h-[8rem] resize-vertical"
          placeholder="Décrivez plus en détail ce que vous souhaitez..."
          value={formData.freePrompt || ""}
          onChange={(e) => handleInputChange("freePrompt", e.target.value)}
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="flex justify-center items-center py-[1.5rem] border-none disabled:opacity-50 disabled:cursor-not-allowed w-full bg-[#f5f5f5] rounded-[0.8rem] text-[#1E1E1E] font-semibold text-[1.6rem] hover:bg-[#e5e5e5] transition-colors"
        disabled={
          isGenerating ||
          createRoomMutation.isPending ||
          uploadImageMutation.isPending ||
          generateDesignMutation.isPending ||
          !selectedProjectId
        }
      >
        <Image
          src="/btn-stars.png"
          alt=""
          width={21}
          height={20}
          className="brightness-0 w-[2.1rem] h-[2rem] mr-2"
        />
        {isGenerating ? "Génération en cours..." : "Générez votre rendu"}
      </button>

      {!selectedProjectId && (
        <p className="text-red-400 text-[1.4rem] mt-[1rem] text-center">
          Veuillez suivre le processus de création de projet depuis le début
        </p>
      )}
    </form>
  );
};

export default CreateLayoutForm;
