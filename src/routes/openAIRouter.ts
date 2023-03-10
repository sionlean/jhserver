// External Modules
import express, { Response } from "express";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
  Configuration,
  OpenAIApi,
} from "openai";

// Local Modules
import ErrorManager from "../lib/ErrorManager";

// Constants
import { MODEL_AI, ROUTE_AI } from "../constant";

// Store
import {
  addCodeMessage,
  addResponseMessage,
  clearCodeMessages,
  clearResponseMessages,
  getCodeMessages,
  getResponseMessages,
} from "../store/openAIState";

// Setup openai
const configuration = new Configuration({ apiKey: process.env.OPEN_AI_TOKEN });
const openai = new OpenAIApi(configuration);
const router = express.Router();
let currentModel = MODEL_AI.CHAT_GPT;

router.get(ROUTE_AI.CURRENT_MODEL, async (_, res) => {
  const currentModels = Object.values(MODEL_AI);
  const isValidModel = currentModels.includes(currentModel);
  if (!isValidModel) {
    return res.status(400).send(ErrorManager.getCurrentModelNotFoundError());
  }

  return res.status(200).json({ data: { model: currentModel } });
});

router.get(ROUTE_AI.LIST_AVAILABLE_MODELS, async (_, res) => {
  const models = Object.values(MODEL_AI);
  return res.status(200).json({ data: { models } });
});

router.get(ROUTE_AI.LIST_OPEN_AI_MODELS, async (_, res) => {
  try {
    const response = await openai.listModels();
    const models = response.data.data;
    return res.status(200).json({ data: { models } });
  } catch (err) {
    return res.status(400).send(ErrorManager.getFailedToListAIModelsError(err));
  }
});

router.post(ROUTE_AI.CHANGE_MODEL, async (req, res) => {
  const model = req.body.model;
  const currentModels = Object.values(MODEL_AI);
  const isValidModel = currentModels.includes(model);

  if (isValidModel) {
    currentModel = model;
    const message = `Model successfullly changed to ${model}`;
    return res.status(200).json({ data: { message } });
  } else {
    return res.status(400).send(ErrorManager.getInvalidModelError(model));
  }
});

router.post(ROUTE_AI.GENERATE_CODE, async (req, res) => {
  const { text, includePrevResp } = req.body;
  if (!text)
    return res.status(400).send(ErrorManager.getMissingTextParamError());

  // Logic to get previous chat message for context
  const message: ChatCompletionRequestMessage = { role: "user", content: text };
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

  callChatCompletionApi(
    res,
    getCodeMessages(),
    ErrorManager.getFailedToGenerateAICodeError
  );
});

router.post(ROUTE_AI.GENERATE_RESPONSE, async (req, res) => {
  const { text, includePrevResp } = req.body;
  if (!text)
    return res.status(400).send(ErrorManager.getMissingTextParamError());

  // Logic to get previous chat message for context
  const message: ChatCompletionRequestMessage = { role: "user", content: text };
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

  callChatCompletionApi(
    res,
    getResponseMessages(),
    ErrorManager.getFailedToGenerateAIResponseError
  );
});

const callChatCompletionApi = async (
  res: any,
  messages: ChatCompletionRequestMessage[],
  errMethod:
    | typeof ErrorManager.getFailedToGenerateAICodeError
    | typeof ErrorManager.getFailedToGenerateAIResponseError
): Promise<void> => {
  const chatRequest: CreateChatCompletionRequest = {
    model: currentModel,
    messages,
    temperature: 0.9,
    max_tokens: 4000,
    user: "system",
  };

  try {
    // response.data.usage?.total_tokens
    const response = await openai.createChatCompletion(chatRequest);
    const reply = response.data.choices[0].message?.content;
    return res.status(200).json({ data: { reply } });
  } catch (err) {
    return res.status(400).send(errMethod(err));
  }
};

// router.post(ROUTE_AI.GENERATE_RESPONSE, async (req, res) => {
//   const { prompt } = req.body.text;

//   if (!prompt) {
//     const errorResponse = {
//       error: {
//         message: "Missing text parameter",
//         code: "MISSING_TEXT_PARAM",
//         details: "The 'text' parameter is required.",
//       },
//     };
//     return res.status(400).send(errorResponse);
//   }

//   const request: CreateCompletionRequest = {
//     model: currentModel,
//     prompt,
//     temperature: 0.9,
//     max_tokens: 2000,
//   };

//   try {
//     const response = await openai.createCompletion(request);
//     const reply = response.data.choices[0].text!;
//     return res.status(200).json({ data: { reply } });
//   } catch (err) {
//     const errorResponse = {
//       error: {
//         message: "Failed to generate AI response",
//         code: "AI_RESPONSE_FAILED",
//         details: JSON.stringify(err),
//       },
//     };
//     return res.status(400).send(errorResponse);
//   }
// });

export default router;
