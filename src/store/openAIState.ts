import { ChatCompletionRequestMessage } from "openai";

let threadLimit = 10;
let generateCodeMessages: ChatCompletionRequestMessage[] = [];
let generateResponsesMessages: ChatCompletionRequestMessage[] = [];
let tokenUsedSinceStartup = 0;

export const addCodeMessage = (message: ChatCompletionRequestMessage): void => {
  if (generateCodeMessages.length >= threadLimit) {
    generateCodeMessages.shift();
  }

  generateCodeMessages.push(message);
};

export const addResponseMessage = (
  message: ChatCompletionRequestMessage
): void => {
  if (generateResponsesMessages.length >= threadLimit) {
    generateResponsesMessages.shift();
  }

  generateResponsesMessages.push(message);
};

export const clearCodeMessages = (): void => {
  generateCodeMessages = [];
};

export const clearResponseMessages = (): void => {
  generateResponsesMessages = [];
};

export const getCodeMessages = (): ChatCompletionRequestMessage[] => {
  return generateCodeMessages;
};

export const getResponseMessages = (): ChatCompletionRequestMessage[] => {
  return generateResponsesMessages;
};

export const addTokenUsedSinceStartup = (tokenUsed = 0): void => {
  tokenUsedSinceStartup += tokenUsed;
};

export const getEstimatedCostSinceStartup = (): string => {
  const cost = (tokenUsedSinceStartup / 1000) * 0.002;
  return `$${cost.toFixed(2)}`;
};
