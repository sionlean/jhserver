// Local Modules
import ErrorManagerBase from "./errorManagerBase";

// Interfaces
import { CustomError } from "../Interfaces/general";

export default class AIErrorManager extends ErrorManagerBase {
  private constructor() {
    super();
  }

  static getCurrentModelNotFoundError = (): CustomError => {
    return {
      error: {
        message: "Current model not found",
        code: "CURRENT_MODEL_NOT_FOUND",
        details: "The currently selected model is not valid.",
      },
    };
  };

  static getFailedToChangeProvider = (model: string): CustomError => {
    return {
      error: {
        message: `Failed to change to provider: ${model}`,
        code: "FAILED_TO_CHANGE_PROVIDER",
        details: "Failed to change provider due to invalid provider name",
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

  static getFailedToGetEstimatedCostError = (): CustomError => {
    return {
      error: {
        message: "Failed to get estimated cost",
        code: "ESTIMATED_COST_NOT_FOUND",
        details: "Unable to get estimated cost",
      },
    };
  };

  static getFailedToListAIModelsError = (err?: unknown): CustomError => {
    return {
      error: {
        message: "Failed to list AI models",
        code: "LIST_AI_MODELS_FAILED",
        details: JSON.stringify(err) || "Failed to list models",
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
