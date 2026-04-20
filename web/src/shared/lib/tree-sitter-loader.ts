import { Language, Parser } from "web-tree-sitter";

let parserPromise: Promise<Parser> | null = null;

export function getParser(): Promise<Parser> {
  if (!parserPromise) {
    parserPromise = (async () => {
      await Parser.init({
        locateFile: (name: string) => `/${name}`,
      });
      const language = await Language.load("/thailang.wasm");
      const parser = new Parser();
      parser.setLanguage(language);
      return parser;
    })();
  }
  return parserPromise;
}
