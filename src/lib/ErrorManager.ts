// Interfaces
import { CustomError } from "../Interfaces/general";

export default class ErrorManager {
  private constructor() {}

  static getCurrentModelNotFoundError = (): CustomError => {
    return {
      error: {
        message: "Current model not found",
        code: "CURRENT_MODEL_NOT_FOUND",
        details: "The currently selected model is not valid.",
      },
    };
  };

  static getFailedToGenerateAICodeError = (err: unknown): CustomError => {
    return {
      error: {
        message: "Failed to generate AI code",
        code: "AI_GENERATE_CODE_FAILED",
        details: JSON.stringify(err),
      },
    };
  };

  static getFailedToGenerateAIResponseError = (err: unknown): CustomError => {
    return {
      error: {
        message: "Failed to generate AI response",
        code: "AI_GENERATE_RESPONSE_FAILED",
        details: JSON.stringify(err),
      },
    };
  };

  static getFailedToListAIModelsError = (err: unknown): CustomError => {
    return {
      error: {
        message: "Failed to list OpenAI models",
        code: "LIST_OPENAI_MODELS_FAILED",
        details: JSON.stringify(err),
      },
    };
  };

  static getInvalidModelError = (model: string): CustomError => {
    return {
      error: {
        message: "Invalid model",
        code: "INVALID_MODEL",
        details: `The provided model '${model}' is not valid.`,
      },
    };
  };

  static getMissingTextParamError = (): CustomError => {
    return {
      error: {
        message: "Missing text parameter",
        code: "MISSING_TEXT_PARAM",
        details: "The 'text' parameter is required.",
      },
    };
  };
}
