// External Modules
import { CohereClient } from "cohere-ai";
import {
  ClassifyRequest,
  ClassifyResponse,
  GenerateRequest,
  Generation,
  SummarizeRequest,
  SummarizeResponse,
} from "cohere-ai/api";

// Local Modules
import AIBase from "./aiBase";
import AIErrorManager from "../lib/aiErrorManager";

// Interfaces
import { CustomError, ServerResponse } from "../Interfaces/general";

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

  cohere = new CohereClient({ token: process.env.COHERE_TOKEN! });
  currentModel: string = MODEL_COHERE.COMMAND;

  changeModel = (model: string): ServerResponse<string | CustomError> => {
    const currentModels: string[] = Object.keys(MODEL_COHERE).map((key) =>
      key.toLowerCase()
    );
    const isValidModel = currentModels.includes(model.toLowerCase());

    if (isValidModel) {
      const modelName = (MODEL_COHERE as { [key: string]: string })[
        model.toUpperCase()
      ];

      this.currentModel = modelName;
      return { code: 200, reply: `Model successfullly changed to ${model}` };
    } else {
      return { code: 422, reply: AIErrorManager.getInvalidModelError(model) };
    }
  };

  getCurrentModel = (): ServerResponse<string | CustomError> => {
    const currentModels: string[] = Object.values(MODEL_COHERE);
    const isValidModel = currentModels.includes(this.currentModel);

    if (isValidModel) {
      return { code: 200, reply: this.currentModel };
    } else {
      return {
        code: 400,
        reply: AIErrorManager.getCurrentModelNotFoundError(),
      };
    }
  };

  listAvailableModels = (): ServerResponse<string[] | CustomError> => {
    const models = Object.values(MODEL_COHERE);

    if (models) {
      return { code: 200, reply: models };
    } else {
      return {
        code: 400,
        reply: AIErrorManager.getFailedToListAIModelsError(),
      };
    }
  };

  generateResponse = async (
    text: string
  ): Promise<ServerResponse<string | CustomError>> => {
    if (!text) {
      return Promise.resolve({
        code: 400,
        reply: AIErrorManager.getMissingTextParamError(),
      });
    }

    const promise: Promise<
      Generation | ClassifyResponse | SummarizeResponse | CustomError | null
    > = new Promise(async (resolve, reject) => {
      try {
        switch (this.currentModel) {
          case MODEL_COHERE.COMMAND:
          case MODEL_COHERE.COMMAND_LIGHT:
          case MODEL_COHERE.GENERATION:
          case MODEL_COHERE.GENERATION_LIGHT:
            const generateConfig: GenerateRequest = {
              maxTokens: 5000,
              model: this.currentModel,
              prompt: text,
              temperature: 1,
            };

            resolve(this.cohere.generate(generateConfig));
            break;
          case MODEL_COHERE.REPRESENTATION:
          case MODEL_COHERE.REPRESENTATION_LIGHT:
          case MODEL_COHERE.REPRESENTATION_MULTILINGUAL:
            const classifyConfig: ClassifyRequest = {
              examples: [],
              inputs: [],
              model: this.currentModel,
              preset: "",
            };
            resolve(this.cohere.classify(classifyConfig));
            break;
          case MODEL_COHERE.RERANK:
          case MODEL_COHERE.RERANK_MULTILINGUAL:
            // Not in endpoint
            resolve(null);
            break;
          case MODEL_COHERE.SUMMARIZE:
          case MODEL_COHERE.SUMMARIZE_LIGHT:
            console.log("summarize");
            const summarizeConfig: SummarizeRequest = {
              model: this.currentModel,
              text: text,
            };
            resolve(this.cohere.summarize(summarizeConfig));
            break;
          default:
            resolve(AIErrorManager.getInvalidModelError(this.currentModel));
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });

    try {
      const resp = await promise;
      if (!resp) throw Error("Unknown Error - Empty Response");

      const response: ServerResponse<string | CustomError> = {
        code: 400,
        reply: AIErrorManager.getFailedToGenerateAIResponseError(resp),
      };

      if ("generations" in resp) {
        const generation = resp.generations[0].text || response.reply;
        response.code = 200;
        response.reply = generation;
      } else if ("classifications" in resp) {
        const prediction = resp.classifications[0].prediction || response.reply;
        response.code = 200;
        response.reply = prediction;
      } else if ("summary" in resp) {
        const summary = resp.summary || response.reply;
        response.code = 200;
        response.reply = summary;
      }
      return response;
    } catch (err) {
      const response: ServerResponse<CustomError> = {
        code: 400,
        reply: AIErrorManager.getFailedToGenerateAIResponseError(err),
      };
      return response;
    }
  };
}
