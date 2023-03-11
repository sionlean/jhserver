export enum MAIN_ROUTES {
  AUTHENTICATION = "/auth",
  DIRECTIONS = "/directions",
  OPEN_AI = "/openAI",
}

export enum MODEL_AI {
  ADA = "text-ada-001",
  BABBAGE = "text-babbage-001",
  CHAT_GPT = "gpt-3.5-turbo",
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

export enum TYPE_AI_QUERY {
  ASSIT = "assit",
  CODE = "code",
}

export const UNAUTHENTICATED_ROUTES: MAIN_ROUTES[] = [
  MAIN_ROUTES.AUTHENTICATION,
];
