/**
 * Exemplos de uso das novas funcionalidades de OCR com galeria
 * Este arquivo demonstra como usar as funcionalidades atualizadas
 */

import { OCRUtils } from "../utils/ocrUtils";
import { OCRDataManager } from "../utils/ocrDataManager";

/**
 * Exemplo 1: Usar OCR com seleção automática (câmera ou galeria)
 */
export const exemploOCRCompleto = async () => {
  console.log("📸 Exemplo: OCR com seleção automática de origem...");

  try {
    // Usar a função principal que mostra opções para o usuário
    const result = await OCRUtils.scanMedicineFromImage();

    if (result.success) {
      console.log("✅ Medicamento detectado:", result.medicineName);
      console.log("🎯 Confiança:", Math.round(result.confidence * 100) + "%");
      console.log("📋 Termo de busca:", result.searchTerm);

      // Salvar resultado
      await OCRDataManager.saveOCRResult(result);

      return {
        success: true,
        medicamento: result.medicineName,
        confianca: result.confidence,
      };
    } else {
      console.log("❌ Erro no OCR:", result.error);
      return {
        success: false,
        erro: result.error,
      };
    }
  } catch (error) {
    console.error("❌ Erro no exemplo OCR:", error);
    return { success: false, erro: error.message };
  }
};

/**
 * Exemplo 2: Usar apenas câmera (comportamento antigo)
 */
export const exemploOCRCamera = async () => {
  console.log("📷 Exemplo: OCR apenas com câmera...");

  try {
    // Usar com parâmetro false para manter comportamento antigo
    const result = await OCRUtils.scanMedicineFromImage(false);

    if (result.success) {
      console.log("✅ Foto capturada e processada com sucesso!");
      return result;
    } else {
      console.log("❌ Falha na captura:", result.error);
      return result;
    }
  } catch (error) {
    console.error("❌ Erro no exemplo câmera:", error);
    return { success: false, erro: error.message };
  }
};

/**
 * Exemplo 3: Usar apenas galeria
 */
export const exemploOCRGaleria = async () => {
  console.log("🖼️ Exemplo: OCR apenas com galeria...");

  try {
    // Usar método específico da galeria
    const image = await OCRUtils.pickImageFromGallery();

    if (!image) {
      console.log("❌ Nenhuma imagem selecionada");
      return { success: false, erro: "Seleção cancelada" };
    }

    // Processar imagem selecionada
    const ocrResult = await OCRUtils.processImageWithOCR(
      image.uri,
      image.base64
    );

    console.log("✅ Imagem da galeria processada!");
    return ocrResult;
  } catch (error) {
    console.error("❌ Erro no exemplo galeria:", error);
    return { success: false, erro: error.message };
  }
};

/**
 * Exemplo 4: Fluxo completo em um componente React
 */
export const exemploUsoEmComponente = `
// Como usar no seu componente React Native

import React, { useState } from 'react';
import { Button, Alert } from 'react-native';
import { OCRUtils } from '../utils/ocrUtils';

export const MeuComponente = () => {
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleOCRScan = async () => {
    if (processando) return;

    setProcessando(true);

    try {
      // A função automaticamente mostra opções: câmera ou galeria
      const result = await OCRUtils.scanMedicineFromImage();

      if (result.success) {
        // Medicamento encontrado!
        setResultado(result.medicineName);
        
        Alert.alert(
          'Sucesso!', 
          \`Medicamento detectado: \${result.medicineName}\`
        );
      } else {
        // Erro ou cancelamento
        if (result.error !== 'Captura cancelada') {
          Alert.alert('Erro', result.error);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha no processamento da imagem');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Button 
      title={processando ? "Processando..." : "📸 Escanear Remédio"}
      onPress={handleOCRScan}
      disabled={processando}
    />
  );
};
`;

/**
 * Exemplo 5: Verificar permissões antes de usar
 */
export const exemploVerificarPermissoes = async () => {
  console.log("🔐 Exemplo: Verificando permissões...");

  try {
    // Verificar permissão da câmera
    const cameraPermission = await OCRUtils.requestCameraPermissions();
    console.log(
      "📷 Permissão câmera:",
      cameraPermission ? "✅ Concedida" : "❌ Negada"
    );

    // Verificar permissão da galeria
    const galleryPermission = await OCRUtils.requestMediaLibraryPermissions();
    console.log(
      "🖼️ Permissão galeria:",
      galleryPermission ? "✅ Concedida" : "❌ Negada"
    );

    return {
      camera: cameraPermission,
      galeria: galleryPermission,
      ambas: cameraPermission && galleryPermission,
    };
  } catch (error) {
    console.error("❌ Erro ao verificar permissões:", error);
    return { camera: false, galeria: false, ambas: false };
  }
};

/**
 * Exemplo 6: Estatísticas de uso do OCR
 */
export const exemploEstatisticasOCR = async () => {
  console.log("📊 Exemplo: Estatísticas de uso do OCR...");

  try {
    // Obter histórico de resultados
    const historico = await OCRDataManager.getOCRHistory();

    const stats = {
      total_scans: historico.length,
      sucessos: historico.filter((item) => item.success).length,
      falhas: historico.filter((item) => !item.success).length,
      medicamentos_unicos: [
        ...new Set(
          historico
            .filter((item) => item.success)
            .map((item) => item.medicineName)
        ),
      ].length,
    };

    console.log("📈 Estatísticas:", stats);
    return stats;
  } catch (error) {
    console.error("❌ Erro ao obter estatísticas:", error);
    return null;
  }
};

// Export de todos os exemplos
export default {
  exemploOCRCompleto,
  exemploOCRCamera,
  exemploOCRGaleria,
  exemploUsoEmComponente,
  exemploVerificarPermissoes,
  exemploEstatisticasOCR,
};
