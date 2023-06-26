import { EditorPosition, EditorTransaction } from 'obsidian';

// We need to shim the Editor class because it's not exported from Obsidian.
// This allows us to test by using codemirror directly.
export interface EditorLike {
  getCursor: () => EditorPosition;

  getSelection: () => string;

  offsetToPos: (from: number) => EditorPosition;

  posToOffset: (pos: EditorPosition) => number;

  getValue: () => string;

  somethingSelected: () => boolean;

  transaction: (editorTransaction: EditorTransaction) => void;

  focus: () => void;
}
