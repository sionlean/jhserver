// External Modules
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  Configuration,
  OpenAIApi,
} from "openai";

// Local Modules
import AIBase from "./aiBase";
import AIErrorManager from "../lib/aiErrorManager";

// Interfaces
import { CustomError } from "../Interfaces/general";

// Constants
import { MODEL_OPEN_AI, TYPE_AI_QUERY } from "../constants/constant";

// Store
import {
  addCodeMessage,
  addResponseMessage,
  addTokenUsedSinceStartup,
  clearCodeMessages,
  clearResponseMessages,
  getCodeMessages,
  getEstimatedCostSinceStartup,
  getResponseMessages,
} from "../store/openAIState";

export default class OpenAI implements AIBase {
  private static _instance: OpenAI;
  private constructor() {}

  static getInstance = (): OpenAI => {
    if (!OpenAI._instance) {
      OpenAI._instance = new OpenAI();
    }

    return OpenAI._instance;
  };

  configuration = new Configuration({ apiKey: process.env.OPEN_AI_TOKEN });
  openai = new OpenAIApi(this.configuration);
  currentModel: string = MODEL_OPEN_AI.CHAT_GPT;

  changeModel = (model: string): string | CustomError => {
    const currentModels: string[] = Object.values(MODEL_OPEN_AI);
    const isValidModel = currentModels.includes(model);

    if (isValidModel) {
      this.currentModel = model;
      return `Model successfullly changed to ${model}`;
    } else {
      return AIErrorManager.getInvalidModelError(model);
    }
  };

  getCurrentModel = (): string | CustomError => {
    const currentModels: string[] = Object.values(MODEL_OPEN_AI);
    const isValidModel = currentModels.includes(this.currentModel);

    if (isValidModel) {
      return this.currentModel;
    } else {
      return AIErrorManager.getCurrentModelNotFoundError();
    }
  };

  getEstimatedCost = (): string | CustomError => {
    return (
      getEstimatedCostSinceStartup() ||
      AIErrorManager.getFailedToGetEstimatedCostError()
    );
  };

  listAvailableModels = (): string[] | CustomError => {
    return (
      Object.values(MODEL_OPEN_AI) ||
      AIErrorManager.getFailedToListAIModelsError()
    );
  };

  generateResponse = (
    text: string,
    includePrevResp = false,
    type = TYPE_AI_QUERY.ASSIT
  ): Promise<string | CustomError> | CustomError => {
    if (!text) return AIErrorManager.getMissingTextParamError();

    switch (this.currentModel) {
      case MODEL_OPEN_AI.CHAT_GPT:
        switch (type) {
          case TYPE_AI_QUERY.ASSIT:
            return this.generateChatgptResponse(text, includePrevResp);

          case TYPE_AI_QUERY.CODE:
            return this.generateChatgptCode(text, includePrevResp);
        }
      case MODEL_OPEN_AI.ADA:
      case MODEL_OPEN_AI.BABBAGE:
      case MODEL_OPEN_AI.CURIE:
      case MODEL_OPEN_AI.DAVINCI:
        return this.generateOpenAIResponse(text);
      default:
        return AIErrorManager.getInvalidModelError(text);
    }
  };

  private callChatCompletionApi = async (
    messages: ChatCompletionRequestMessage[],
    errMethod:
      | typeof AIErrorManager.getFailedToGenerateAICodeError
      | typeof AIErrorManager.getFailedToGenerateAIResponseError
  ): Promise<string | CustomError> => {
    const chatRequest: CreateChatCompletionRequest = {
      model: this.currentModel,
      messages,
      temperature: 0.9,
      max_tokens: 4000,
      user: "system",
    };

    try {
      const response = await this.openai.createChatCompletion(chatRequest);
      const reply = response.data.choices[0].message?.content;
      const tokenUsed = response.data.usage?.total_tokens;
      addTokenUsedSinceStartup(tokenUsed);

      return reply || errMethod(new Error("No content"));
    } catch (err) {
      return errMethod(err);
    }
  };

  private generateChatgptCode = (
    text: string,
    includePrevResp: boolean
  ): Promise<string | CustomError> => {
    // Logic to get previous chat message for context
    const message: ChatCompletionRequestMessage = {
      role: "user",
      content: text,
    };
    if (includePrevResp) {
      addCodeMessage(message);
    } else {
      clearCodeMessages();
      addCodeMessage({
        role: "system",
        content: "You are a coder who responds with code and explaination",
      });
      addCodeMessage(message);
    }

    return this.callChatCompletionApi(
      getCodeMessages(),
      AIErrorManager.getFailedToGenerateAICodeError
    );
  };

  private generateChatgptResponse = (
    text: string,
    includePrevResp: boolean
  ): Promise<string | CustomError> => {
    // Logic to get previous chat message for context
    const message: ChatCompletionRequestMessage = {
      role: "user",
      content: text,
    };
    if (includePrevResp) {
      addResponseMessage(message);
    } else {
      clearResponseMessages();
      addResponseMessage({
        role: "system",
        content: "You are a helpful assistant",
      });
      addResponseMessage(message);
    }

    return this.callChatCompletionApi(
      getResponseMessages(),
      AIErrorManager.getFailedToGenerateAIResponseError
    );
  };

  private generateOpenAIResponse = async (
    text: string
  ): Promise<string | CustomError> => {
    const request: CreateCompletionRequest = {
      model: this.currentModel,
      prompt: text,
      temperature: 0.9,
      max_tokens: 2000,
    };

    try {
      const response = await this.openai.createCompletion(request);
      const reply = response.data.choices[0].text;

      return (
        reply ||
        AIErrorManager.getFailedToGenerateAIResponseError(
          new Error("No Content")
        )
      );
    } catch (err) {
      return AIErrorManager.getFailedToGenerateAIResponseError(err);
    }
  };
}
