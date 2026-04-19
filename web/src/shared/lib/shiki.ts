import "server-only";

import {
  createHighlighterCore,
  type HighlighterGeneric,
  type LanguageRegistration,
  type ThemeRegistration,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import thailangGrammarJson from "./thailang.tmLanguage.json";
import thailangLacquerJson from "./thailang-paper.theme.json";

const thailangGrammar = thailangGrammarJson as unknown as LanguageRegistration;
const thailangLacquer = thailangLacquerJson as unknown as ThemeRegistration;

export const THAILANG_LANG = "thailang";
export const THAILANG_THEME = "thailang-lacquer";

type Highlighter = HighlighterGeneric<
  typeof THAILANG_LANG,
  typeof THAILANG_THEME
>;

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      langs: [thailangGrammar],
      themes: [thailangLacquer],
      engine: createJavaScriptRegexEngine(),
    }) as Promise<Highlighter>;
  }
  return highlighterPromise;
}

export async function highlightToHtml(source: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(source, {
    lang: THAILANG_LANG,
    theme: THAILANG_THEME,
  });
}
