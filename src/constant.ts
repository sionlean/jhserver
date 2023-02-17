export const PORT = 3000;

export enum MAIN_ROUTES {
  AUTHENTICATION = "/auth",
  DIRECTIONS = "/directions",
  OPEN_AI = "/openAI",
}

export enum MODEL_AI {
  ADA = "text-ada-001",
  BABBAGE = "text-babbage-001",
  CURIE = "text-curie-001",
  DAVINCI = "text-davinci-003",
}
export enum ROUTE_AI {
  CHANGE_MODEL = "/changeModel",
  CURRENT_MODEL = "/currentModel",
  GENERATE_RESPONSE = "/generateResponse",
  LIST_AVAILABLE_MODELS = "/listAvailableModels",
  LIST_OPEN_AI_MODELS = "/listOpenAIModels",
}

export enum ROUTE_AUTHENTICATION {
  GET_TOKEN = "/getToken",
}

export const UNAUTHENTICATED_ROUTES: MAIN_ROUTES[] = [
  MAIN_ROUTES.AUTHENTICATION,
];
