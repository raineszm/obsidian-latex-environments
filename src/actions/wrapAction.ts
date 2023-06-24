import { Action } from './action';
import { newEnvironment } from '../environment';
import { EditorTransaction } from 'obsidian';
import { EditorLike } from '../editorLike';

export class WrapAction extends Action {
  constructor(doc: EditorLike, public readonly addWhitespace = true) {
    super(doc);
  }

  prepare(): Action {
    return this;
  }

  transaction(envName: string): EditorTransaction {
    return newEnvironment(
      envName,
      this.doc.getCursor(),
      this.doc.getSelection(),
    );
  }
}
