// External Modules
import express from "express";
import { Configuration, CreateCompletionRequest, OpenAIApi } from "openai";

// Constants
import { MODEL_AI, ROUTE_AI } from "../constant";

// Setup openai
const configuration = new Configuration({ apiKey: process.env.OPEN_AI_TOKEN });
const openai = new OpenAIApi(configuration);
const router = express.Router();
let currentModel = MODEL_AI.BABBAGE;

router.get(ROUTE_AI.CURRENT_MODEL, async (req, res) => {
  const currentModels = Object.values(MODEL_AI);
  const isValidModel = currentModels.includes(currentModel);
  if (!isValidModel) {
    const errorResponse = {
      error: {
        message: "Current model not found",
        code: "CURRENT_MODEL_NOT_FOUND",
        details: "The currently selected model is not valid.",
      },
    };
    return res.status(400).send(errorResponse);
  }

  return res.status(200).json({ data: { model: currentModel } });
});

router.get(ROUTE_AI.LIST_AVAILABLE_MODELS, async (req, res) => {
  const models = Object.values(MODEL_AI);
  return res.status(200).json({ data: { models } });
});

router.get(ROUTE_AI.LIST_OPEN_AI_MODELS, async (req, res) => {
  try {
    const response = await openai.listModels();
    const models = response.data.data;
    return res.status(200).json({ data: { models } });
  } catch (err) {
    const errorResponse = {
      error: {
        message: "Failed to list OpenAI models",
        code: "LIST_OPENAI_MODELS_FAILED",
        details: JSON.stringify(err),
      },
    };
    return res.status(400).send(errorResponse);
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
    const errorResponse = {
      error: {
        message: "Invalid model",
        code: "INVALID_MODEL",
        details: `The provided model '${model}' is not valid.`,
      },
    };
    return res.status(400).send(errorResponse);
  }
});

router.post(ROUTE_AI.GENERATE_RESPONSE, async (req, res) => {
  const prompt = req.body.text;

  if (!prompt) {
    const errorResponse = {
      error: {
        message: "Missing text parameter",
        code: "MISSING_TEXT_PARAM",
        details: "The 'text' parameter is required.",
      },
    };
    return res.status(400).send(errorResponse);
  }

  const request: CreateCompletionRequest = {
    model: currentModel,
    prompt,
    temperature: 0,
    max_tokens: 1000,
  };

  try {
    const response = await openai.createCompletion(request);
    const reply = response.data.choices[0].text!;
    return res.status(200).json({ data: { reply } });
  } catch (err) {
    const errorResponse = {
      error: {
        message: "Failed to generate AI response",
        code: "AI_RESPONSE_FAILED",
        details: JSON.stringify(err),
      },
    };
    return res.status(400).send(errorResponse);
  }
});

export default router;
