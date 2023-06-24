import { Editor, EditorPosition, EditorTransaction } from 'obsidian';

// We need to shim the Editor class because it's not exported from Obsidian.
// This allows us to test by using codemirror directly.
export interface EditorLike {
  getCursor: () => EditorPosition;

  getSelection: () => string;

  offsetToPos: (from: number) => EditorPosition;

  posToOffset: (pos: EditorPosition) => number;

  getValue: () => string;

  somethingSelected: () => Boolean;

  transaction: (editorTransaction: EditorTransaction) => void;

  focus: () => void;
}

export class EditorShim implements EditorLike {
  constructor(private readonly editor: Editor) {}
  offsetToPos(from: number): EditorPosition {
    return this.editor.offsetToPos(from);
  }

  getCursor(): EditorPosition {
    return this.editor.getCursor();
  }

  getSelection(): string {
    return this.editor.getSelection();
  }

  posToOffset(pos: EditorPosition): number {
    return this.editor.posToOffset(pos);
  }

  getValue(): string {
    return this.editor.getValue();
  }

  somethingSelected(): Boolean {
    return this.editor.somethingSelected();
  }

  transaction(editorTransaction: EditorTransaction): void {
    this.editor.transaction(editorTransaction);
  }

  focus(): void {
    this.editor.focus();
  }
}
