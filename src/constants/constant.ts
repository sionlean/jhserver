export enum MODEL_OPEN_AI {
  ADA = "text-ada-001",
  BABBAGE = "text-babbage-001",
  CHAT_GPT = "gpt-3.5-turbo",
  CURIE = "text-curie-001",
  DAVINCI = "text-davinci-003",
}

export enum MODEL_COHERE {
  COMMAND_LIGHT = "command-light", // A smaller, faster version of command. Almost as capable, but a lot faster. Uses Co.generate()
  COMMAND = "command", // An instruction-following conversational model that performs language tasks with high quality, more reliably and with a longer context than our base generative models. Uses Co.generate()
  GENERATION = "base", // A smaller, faster version of base. Almost as capable, but a lot faster. Uses Co.generate()
  GENERATION_LIGHT = "base-light", // A model that performs generative language tasks. Uses Co.generate()
  REPRESENTATION = "embed-english-v2.0", // A smaller, faster version of embed-english-v2.0. Almost as capable, but a lot faster. English only. Uses Co.Classify(), Co.Embed(), Co.Detect_language(), Co.Tokenize(), Co.Detokenize()
  REPRESENTATION_LIGHT = "embed-english-light-v2.0", // A model that allows for text to be classified or turned into embeddings. English only. Uses Co.Classify(), Co.Embed(), Co.Detect_language(), Co.Tokenize(), Co.Detokenize()
  REPRESENTATION_MULTILINGUAL = "embed-multilingual-v2.0", // Provides multilingual classification and embedding support. See supported languages here. Uses Co.Classify(), Co.Embed(), Co.Detect_language(), Co.Tokenize(), Co.Detokenize()
  RERANK = "rerank-english-v2.0", // A model that allows for re-ranking English language documents. Uses Co.rerank()
  RERANK_MULTILINGUAL = "rerank-multilingual-v2.0", // A model for documents that are not in English. Supports the same languages as embed-multilingual-v2.0. Uses Co.rerank()
  SUMMARIZE_LIGHT = "summarize-medium", // A smaller, faster version of summarize-xlarge. Almost as capable, but a lot faster. Uses Co.summarize()
  SUMMARIZE = "summarize-xlarge", // A model that takes a piece of text and generates a summary. Uses Co.summarize()
}

export enum TYPE_AI_PROVIDER {
  OPEN_AI = "openai",
  COHERE = "cohere",
}

export enum TYPE_AI_QUERY {
  ASSIT = "assit",
  CODE = "code",
}
