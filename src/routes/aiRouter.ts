// External Modules
import express, { Request, Response } from "express";

// Local Modules
import AIErrorManager from "../lib/aiErrorManager";
import Cohere from "../api/cohere";
import OpenAI from "../api/openAI";

// Constants
import { ROUTE_AI } from "../constants/routes";
import { TYPE_AI_PROVIDER } from "../constants/constant";

const router = express.Router();
let currentProvider: Cohere | OpenAI = Cohere.getInstance();

router.post(ROUTE_AI.CHANGE_MODEL, async (req: Request, res: Response) => {
  const model = req.body.model;
  const { code, reply } = currentProvider.changeModel(model);

  if (code === 200) {
    res.status(200).send({ data: { reply: "Success" } });
  } else {
    res.status(code).send(reply);
  }
});

router.post(ROUTE_AI.CHANGE_PROVIDER, async (req: Request, res: Response) => {
  const provider: string = req.body.provider;

  if (provider) {
    switch (provider.toLowerCase()) {
      case TYPE_AI_PROVIDER.COHERE:
        currentProvider = Cohere.getInstance();
        res.status(200).send({ data: { reply: "Success" } });
        break;
      case TYPE_AI_PROVIDER.OPEN_AI:
        currentProvider = OpenAI.getInstance();
        res.status(200).send({ data: { reply: "Success" } });
        break;
      default:
        res
          .status(422)
          .send(AIErrorManager.getFailedToChangeProvider(provider));
        break;
    }
  } else {
    res.status(401).send(AIErrorManager.getFailedToChangeProvider(provider));
  }
});

router.get(ROUTE_AI.CURRENT_MODEL, async (_, res: Response) => {
  const { code, reply } = currentProvider.getCurrentModel();

  if (code === 200) {
    res.status(code).send({ data: { model: reply } });
  } else {
    res.status(code).send(reply);
  }
});

router.post(ROUTE_AI.GENERATE_RESPONSE, async (req: Request, res: Response) => {
  const { text, includePrevResp, type } = req.body;
  const { code, reply } = await currentProvider.generateResponse(
    text,
    includePrevResp,
    type
  );

  if (code === 200) {
    res.status(code).send({ data: { reply } });
  } else {
    res.status(code).send(reply);
  }
});

router.get(ROUTE_AI.GET_ESIMATED_COST, async (_, res: Response) => {
  if (currentProvider instanceof OpenAI) {
    const { code, reply } = currentProvider.getEstimatedCost();

    if (code === 200) {
      res.status(code).send({ data: { cost: reply } });
    } else {
      res.status(code).send(reply);
    }
  } else {
    res.status(401).send(AIErrorManager.getFailedToGetEstimatedCostError());
  }
});

router.get(ROUTE_AI.LIST_AVAILABLE_MODELS, async (_, res: Response) => {
  const { code, reply } = currentProvider.listAvailableModels();

  if (code === 200) {
    res.status(code).send({ data: { models: reply } });
  } else {
    res.status(code).send(reply);
  }
});

export default router;
