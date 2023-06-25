// Modified from test code by Tim Hor
// at https://github.com/timhor/obsidian-editor-shortcuts/blob/0f364c444311efe2f880867033ee94475941e725/src/__tests__/test-helpers.ts
// used under the MIT license.
import { EditorState, Text, SelectionRange } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import type { EditorPosition, EditorTransaction } from 'obsidian';
import { EditorLike } from '../src/editorLike';

function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}

// Light wrapper around EditorView to allow testing actions.
// Based on the migration guide at https://codemirror.net/docs/migration/
export class TestEditor implements EditorLike {
  constructor(private readonly view: EditorView) {}

  private doc(): Text {
    return this.view.state.doc;
  }

  getCursor(): EditorPosition {
    const offset = this.view.state.selection.main.head;
    return this.offsetToPos(offset);
  }

  setCursor(pos: number): void {
    return this.view.dispatch({ selection: { anchor: pos } });
  }

  getSelection(): string {
    return this.view.state.sliceDoc(
      this.view.state.selection.main.from,
      this.view.state.selection.main.to,
    );
  }

  setSelection(from: number, to: number): void {
    return this.view.dispatch({ selection: { anchor: from, head: to } });
  }

  getValue(): string {
    return this.doc().toString();
  }

  setValue(value: string): void {
    this.view.setState(EditorState.create({ doc: value }));
  }

  posToOffset(pos: EditorPosition): number {
    return this.doc().line(pos.line + 1).from + pos.ch;
  }

  offsetToPos(offset: number): { ch: number; line: number } {
    const line = this.doc().lineAt(offset);
    return { line: line.number - 1, ch: offset - line.from };
  }

  somethingSelected(): Boolean {
    return this.view.state.selection.ranges.some(
      (r: SelectionRange) => !r.empty,
    );
  }

  focus(): void {
    this.view.focus();
  }

  transaction(editorTransaction: EditorTransaction): void {
    const changes = editorTransaction.changes?.map((change) => {
      const to = isDefined(change.to) ? this.posToOffset(change.to) : undefined;
      return {
        from: this.posToOffset(change.from),
        to,
        insert: change.text,
      };
    });

    let selection;
    if (isDefined(editorTransaction.selection)) {
      const { from, to } = editorTransaction.selection;
      const head = isDefined(to) ? this.posToOffset(to) : undefined;
      selection = {
        anchor: this.posToOffset(from),
        head,
      };
    }
    this.view.dispatch({ changes, selection });
  }
}
