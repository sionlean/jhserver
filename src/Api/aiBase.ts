// Interfaces
import { CustomError } from "../Interfaces/general";

// Constants
import { TYPE_AI_QUERY } from "../../constants/constant";

export default abstract class AIBase {
  constructor() {}

  abstract currentModel: string;

  abstract changeModel: (model: string) => string | CustomError;
  abstract getCurrentModel: () => string | CustomError;
  abstract listAvailableModels: () => string[] | CustomError;
  abstract generateResponse: (
    text: string,
    includePrevResp?: boolean,
    type?: TYPE_AI_QUERY
  ) => Promise<string | CustomError> | CustomError;
}
