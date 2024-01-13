// Interfaces
import { CustomError } from "../Interfaces/general";

export default abstract class ErrorManagerBase {
  constructor() {}

  static isCustomError = (object: any): object is CustomError => {
    return !!object?.error;
  };
}
