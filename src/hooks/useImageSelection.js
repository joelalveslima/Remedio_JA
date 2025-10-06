import { useState } from "react";
import { OCRUtils } from "../utils/ocrUtils";

/**
 * Hook personalizado para gerenciar seleção de imagem com modal moderno
 */
export const useImageSelection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Mostra o modal de seleção de origem
   */
  const showImageSelector = () => {
    setIsModalVisible(true);
  };

  /**
   * Fecha o modal
   */
  const hideImageSelector = () => {
    setIsModalVisible(false);
  };

  /**
   * Lida com seleção da câmera
   */
  const handleCameraPress = async () => {
    try {
      setIsProcessing(true);
      const image = await OCRUtils.captureImage();

      if (image) {
        setSelectedImage(image);
        return image;
      }
      return null;
    } catch (error) {
      console.error("Erro ao capturar imagem:", error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Lida com seleção da galeria
   */
  const handleGalleryPress = async () => {
    try {
      setIsProcessing(true);
      const image = await OCRUtils.pickImageFromGallery();

      if (image) {
        setSelectedImage(image);
        return image;
      }
      return null;
    } catch (error) {
      console.error("Erro ao selecionar da galeria:", error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Processa a imagem selecionada com OCR
   */
  const processSelectedImage = async (image) => {
    if (!image) return null;

    try {
      setIsProcessing(true);
      const result = await OCRUtils.processImageWithOCR(
        image.uri,
        image.base64
      );
      return result;
    } catch (error) {
      console.error("Erro no processamento OCR:", error);
      return {
        success: false,
        error: "Erro no processamento da imagem",
        details: error.message,
      };
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Fluxo completo: mostrar modal → selecionar → processar
   */
  const selectAndProcessImage = () => {
    return new Promise((resolve) => {
      // Armazenar resolve para uso nos callbacks
      const handleCameraSelection = async () => {
        const image = await handleCameraPress();
        if (image) {
          const result = await processSelectedImage(image);
          resolve(result);
        } else {
          resolve(null);
        }
      };

      const handleGallerySelection = async () => {
        const image = await handleGalleryPress();
        if (image) {
          const result = await processSelectedImage(image);
          resolve(result);
        } else {
          resolve(null);
        }
      };

      const handleCancel = () => {
        resolve(null);
      };

      // Retornar funções e estado para uso no componente
      setIsModalVisible(true);

      // As funções serão chamadas pelo modal
      window._imageSelectionCallbacks = {
        camera: handleCameraSelection,
        gallery: handleGallerySelection,
        cancel: handleCancel,
      };
    });
  };

  return {
    // Estado
    isModalVisible,
    selectedImage,
    isProcessing,

    // Ações
    showImageSelector,
    hideImageSelector,
    handleCameraPress,
    handleGalleryPress,
    processSelectedImage,
    selectAndProcessImage,
  };
};

export default useImageSelection;
