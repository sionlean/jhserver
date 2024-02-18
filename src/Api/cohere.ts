// External Modules
import cohere from "cohere-ai";
import {
  classifyRequest,
  generateRequest,
  summarizeRequest,
} from "cohere-ai/dist/models";

// Local Modules
import AIBase from "./aiBase";
import AIErrorManager from "../lib/aiErrorManager";

// Interfaces
import { CustomError } from "../Interfaces/general";

// Constants
import { MODEL_COHERE } from "../constants/constant";

export default class Cohere implements AIBase {
  private static _instance: Cohere;
  private constructor() {}

  static getInstance = (): Cohere => {
    if (!Cohere._instance) {
      Cohere._instance = new Cohere();
    }

    return Cohere._instance;
  };

  cohere = cohere.init(process.env.COHERE_TOKEN!);
  currentModel: string = MODEL_COHERE.COMMAND;

  changeModel = (model: string): string | CustomError => {
    const currentModels: string[] = Object.values(MODEL_COHERE);
    const isValidModel = currentModels.includes(model);

    if (isValidModel) {
      this.currentModel = model;
      return `Model successfullly changed to ${model}`;
    } else {
      return AIErrorManager.getInvalidModelError(model);
    }
  };

  getCurrentModel = (): string | CustomError => {
    const currentModels: string[] = Object.values(MODEL_COHERE);
    const isValidModel = currentModels.includes(this.currentModel);

    if (isValidModel) {
      return this.currentModel;
    } else {
      return AIErrorManager.getCurrentModelNotFoundError();
    }
  };

  listAvailableModels = (): string[] | CustomError => {
    return (
      Object.values(MODEL_COHERE) ||
      AIErrorManager.getFailedToListAIModelsError()
    );
  };

  generateResponse = (
    text: string
  ): Promise<string | CustomError> | CustomError => {
    if (!text) return AIErrorManager.getMissingTextParamError();

    const promise = new Promise((resolve, reject) => {
      try {
        switch (this.currentModel) {
          case MODEL_COHERE.COMMAND:
          case MODEL_COHERE.COMMAND_LIGHT:
          case MODEL_COHERE.GENERATION:
          case MODEL_COHERE.GENERATION_LIGHT:
            const generateConfig: generateRequest = {
              max_tokens: 5000,
              model: this.currentModel,
              prompt: text,
              temperature: 1,
            };
            resolve(cohere.generate(generateConfig));
            break;
          case MODEL_COHERE.REPRESENTATION:
          case MODEL_COHERE.REPRESENTATION_LIGHT:
          case MODEL_COHERE.REPRESENTATION_MULTILINGUAL:
            const classifyConfig: classifyRequest = {
              examples: [],
              inputs: [],
              model: this.currentModel,
              preset: "",
            };
            resolve(cohere.classify(classifyConfig));
            break;
          case MODEL_COHERE.RERANK:
          case MODEL_COHERE.RERANK_MULTILINGUAL:
            // Not in endpoint
            resolve(null);
            break;
          case MODEL_COHERE.SUMMARIZE:
          case MODEL_COHERE.SUMMARIZE_LIGHT:
            const summarizeConfig: summarizeRequest = {
              length: "",
              model: this.currentModel,
              text: text,
            };
            resolve(cohere.summarize(summarizeConfig));
            break;
          default:
            resolve(AIErrorManager.getInvalidModelError(this.currentModel));
        }
      } catch (err) {
        reject(err);
      }
    });

    return promise
      .then((resp: any) => {
        if (!resp) throw Error("Unknown Error - Empty Response");

        if (resp?.statusCode === 200) {
          return resp;
        } else {
          return AIErrorManager.getFailedToGenerateAIResponseError(resp);
        }
      })
      .catch((err) => {
        return AIErrorManager.getFailedToGenerateAIResponseError(err);
      });
  };
}
