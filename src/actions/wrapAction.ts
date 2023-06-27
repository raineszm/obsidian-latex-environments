import { Action } from './action';
import { wrapSelection, wrapBlock } from '../environment';
import { EditorTransaction } from 'obsidian';
import { MathBlock } from '../mathblock';

export class WrapAction extends Action {
  prepare(): Action {
    return this;
  }

  transaction(envName: string): EditorTransaction {
    if (this.doc.somethingSelected()) {
      return wrapSelection(
        envName,
        this.doc.getCursor(),
        this.doc.getSelection(),
      );
    }

    const block = new MathBlock(
      this.doc.getValue(),
      this.doc.posToOffset(this.doc.getCursor()),
    );
    return wrapBlock(envName, this.doc, block);
  }
}
