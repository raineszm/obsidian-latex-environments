// Modified from test code by Tim Hor
// at https://github.com/timhor/obsidian-editor-shortcuts/blob/0f364c444311efe2f880867033ee94475941e725/src/__tests__/test-helpers.ts
// used under the MIT license.
import {
  EditorState,
  Text,
  SelectionRange,
  TransactionSpec,
  ChangeSpec,
  EditorSelection,
  ChangeSet,
} from '@codemirror/state';
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
    return posToOffset(this.doc(), pos);
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
    const { replaceSelection, selection, selections } = editorTransaction;
    const tx: TransactionSpec = {
      scrollIntoView: true,
    };
    const txChanges: ChangeSpec[] = [];
    let doc = this.doc();

    if (replaceSelection !== undefined) {
      const replaceTx = this.view.state.replaceSelection(replaceSelection);
      if (replaceTx.changes !== undefined) txChanges.push(replaceTx.changes);
      tx.selection = replaceTx.selection;
      tx.effects = replaceTx.effects;
    }

    const changes = editorTransaction.changes?.map((change) => {
      const to = isDefined(change.to) ? this.posToOffset(change.to) : undefined;
      return {
        from: this.posToOffset(change.from),
        to,
        insert: change.text,
      };
    });

    if (isDefined(changes)) txChanges.push(...changes);

    if (txChanges.length > 0) {
      const singleTx = ChangeSet.of(
        txChanges,
        doc.length,
        this.view.state.facet(EditorState.lineSeparator),
      );
      tx.changes = [singleTx];
      if (isDefined(selections) || isDefined(selection)) {
        doc = singleTx.apply(doc);
      }
    } else tx.changes = txChanges;

    if (selections !== undefined)
      tx.selection = EditorSelection.create(
        selections.map((s) => {
          const { from, to } = s;
          const anchor = posToOffset(doc, from);
          const head = isDefined(to) ? posToOffset(doc, to) : anchor;
          return EditorSelection.range(anchor, head);
        }),
      );
    else if (isDefined(editorTransaction.selection)) {
      const { from, to } = editorTransaction.selection;
      const head = isDefined(to) ? posToOffset(doc, to) : undefined;
      tx.selection = {
        anchor: posToOffset(doc, from),
        head,
      };
    }

    this.view.dispatch(tx);
  }
}

function posToOffset(doc: Text, pos: EditorPosition): number {
  if (pos.line < 0) return 0;
  const n = pos.line + 1;
  if (n > doc.lines) return doc.length;
  const i = doc.line(n);
  return isFinite(pos.ch)
    ? pos.ch < 0
      ? i.from + Math.max(0, i.length + pos.ch)
      : i.from + pos.ch
    : i.to;
}
