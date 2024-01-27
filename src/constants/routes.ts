export enum MAIN_ROUTES {
  AI = "/ai",
  AUTHENTICATION = "/auth",
  MAPS = "/maps",
}

export enum ROUTE_AI {
  CHANGE_MODEL = "/changeModel",
  CHANGE_PROVIDER = "/changeProvider",
  CURRENT_MODEL = "/currentModel",
  GENERATE_RESPONSE = "/generateResponse",
  GET_ESIMATED_COST = "/getEstimatedCost",
  LIST_AVAILABLE_MODELS = "/listAvailableModels",
}

export enum ROUTE_AUTHENTICATION {
  GET_TOKEN = "/getToken",
}

export enum ROUTE_MAP {
  DIRECTIONS = "/directions",
  PLACES = "/places",
}

export const UNAUTHENTICATED_ROUTES: MAIN_ROUTES[] = [
  MAIN_ROUTES.AUTHENTICATION,
];
