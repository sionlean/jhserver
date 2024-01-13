// External Modules
import express, { Request, Response } from "express";

// Local Modules
import AIErrorManager from "../lib/aiErrorManager";
import CohereRouter from "./cohereRouter";
import OpenAIRouter from "./openAIRouter";

// Constants
import { ROUTE_AI, TYPE_AI_PROVIDER } from "../constant";

const router = express.Router();
let currentProvider: CohereRouter | OpenAIRouter = new CohereRouter();

router.get(ROUTE_AI.CHANGE_MODEL, async (req: Request, res: Response) => {
  const model = req.body.model;
  const resp = currentProvider.changeModel(model);

  if (AIErrorManager.isCustomError(resp)) {
    res.status(401).send(resp);
  } else {
    res.status(200).send({ data: { reply: "Success" } });
  }
});

router.get(ROUTE_AI.CHANGE_PROVIDER, async (req: Request, res: Response) => {
  const provider: string = req.body.provider;

  switch (provider) {
    case TYPE_AI_PROVIDER.COHERE:
      currentProvider = new CohereRouter();
      res.status(200).send({ data: {} });
      break;
    case TYPE_AI_PROVIDER.OPEN_AI:
      currentProvider = new OpenAIRouter();
      res.status(200).send({ data: {} });
      break;
    default:
      res.status(401).send(AIErrorManager.getFailedToChangeProvider(provider));
      break;
  }
});

router.get(ROUTE_AI.CURRENT_MODEL, async (_, res: Response) => {
  const resp = currentProvider.currentModel();

  if (AIErrorManager.isCustomError(resp)) {
    res.status(401).send(resp);
  } else {
    res.status(200).send({ data: { model: resp } });
  }
});

router.post(ROUTE_AI.GENERATE_RESPONSE, async (req: Request, res: Response) => {
  const { text, includePrevResp, type } = req.body;
  const resp = await currentProvider.generateResponse(
    text,
    includePrevResp,
    type
  );

  if (AIErrorManager.isCustomError(resp)) {
    return res.status(401).send(resp);
  } else {
    return res.status(200).send({ data: { reply: resp } });
  }
});

router.get(ROUTE_AI.GET_ESIMATED_COST, async (_, res: Response) => {
  if (currentProvider instanceof OpenAIRouter) {
    res
      .status(200)
      .send({ data: { cost: currentProvider.getEstimatedCost() } });
  } else {
    res.status(401).send(AIErrorManager.getFailedToGetEstimatedCostError());
  }
});

router.get(ROUTE_AI.LIST_AVAILABLE_MODELS, async (_, res: Response) => {
  const resp = currentProvider.listAvailableModels();

  if (AIErrorManager.isCustomError(resp)) {
    res.status(401).send(resp);
  } else {
    res.status(200).send({ data: { reply: resp } });
  }
});

router.get(ROUTE_AI.LIST_OPEN_AI_MODELS, async (_, res: Response) => {
  if (currentProvider instanceof OpenAIRouter) {
    const models = await currentProvider.listOpenAIModels();

    if (AIErrorManager.isCustomError(models)) {
      res.status(401).send(AIErrorManager.getFailedToListAIModelsError());
    } else {
      res.status(200).send({ data: { models } });
    }
  } else {
    res.status(401).send(AIErrorManager.getFailedToListAIModelsError());
  }
});

export default router;
