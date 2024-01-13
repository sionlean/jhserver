// External Modules
import cohere from "cohere-ai";
import { generateRequest } from "cohere-ai/dist/models";
import { classifyRequest } from "cohere-ai/dist/models";
import { summarizeRequest } from "cohere-ai/dist/models";

// Local Modules
import AIErrorManager from "../lib/aiErrorManager";

// Interfaces
import { CustomError } from "../Interfaces/general";

// Constants
import { MODEL_COHERE } from "../constant";

export default class CohereRouter {
  constructor() {
    cohere.init(process.env.COHERE_TOKEN!);
  }
  private model = MODEL_COHERE.COMMAND;

  generateResponse = async (text: string): Promise<CustomError | string> => {
    const promise = new Promise(async (resolve, reject) => {
      if (!text) reject(AIErrorManager.getMissingTextParamError());

      try {
        switch (this.model) {
          case MODEL_COHERE.COMMAND:
          case MODEL_COHERE.COMMAND_LIGHT:
          case MODEL_COHERE.GENERATION:
          case MODEL_COHERE.GENERATION_LIGHT:
            const generateConfig: generateRequest = {
              model: this.model,
              prompt: text,
              max_tokens: 2048,
              temperature: 1,
            };
            resolve(await cohere.generate(generateConfig));
            break;
          case MODEL_COHERE.REPRESENTATION:
          case MODEL_COHERE.REPRESENTATION_LIGHT:
          case MODEL_COHERE.REPRESENTATION_MULTILINGUAL:
            const classifyConfig: classifyRequest = {
              inputs: [],
              examples: [],
              model: this.model,
              preset: "",
            };
            resolve(await cohere.classify(classifyConfig));
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
              model: this.model,
              text: text,
            };
            resolve(await cohere.summarize(summarizeConfig));
            break;
          default:
            resolve(null);
        }
      } catch (err) {
        reject(err);
      }
    });

    return promise
      .then((resp: any) => {
        if (!resp) throw Error("Unknown Error - Empty Response");

        const text = resp.body.generations[0]?.text;
        if (resp?.statusCode === 200 && text) {
          return text;
        } else {
          throw new Error("Unable to find text in response");
        }
      })
      .catch((err) => {
        return AIErrorManager.getFailedToGenerateAIResponseError(err);
      });
  };

  changeModel = (model: string): CustomError | string => {
    const currentModels: string[] = Object.values(MODEL_COHERE);
    const isValidModel = currentModels.includes(model);

    if (isValidModel) {
      this.model = model as MODEL_COHERE;
      return `Model successfullly changed to ${model}`;
    } else {
      return AIErrorManager.getInvalidModelError(model);
    }
  };

  currentModel = (): MODEL_COHERE | CustomError => {
    const currentModels = Object.values(MODEL_COHERE);
    const isValidModel = currentModels.includes(this.model);
    if (!isValidModel) {
      return AIErrorManager.getCurrentModelNotFoundError();
    }

    return this.model;
  };

  listAvailableModels = (): string[] => {
    return Object.values(MODEL_COHERE);
  };
}
