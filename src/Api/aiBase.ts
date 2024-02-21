// Interfaces
import { CustomError, ServerResponse } from "../Interfaces/general";

// Constants
import { TYPE_AI_QUERY } from "../constants/constant";

export default abstract class AIBase {
  constructor() {}

  abstract currentModel: string;

  abstract changeModel: (model: string) => ServerResponse<string | CustomError>;

  abstract getCurrentModel: () => ServerResponse<string | CustomError>;
  abstract listAvailableModels: () => ServerResponse<string[] | CustomError>;
  abstract generateResponse: (
    text: string,
    includePrevResp?: boolean,
    type?: TYPE_AI_QUERY
  ) => Promise<ServerResponse<string | CustomError>>;
}
