import { Action } from './action';
import { newEnvironment } from '../environment';
import { Editor, EditorTransaction } from 'obsidian';

export class WrapAction extends Action {
  constructor(doc: Editor, public readonly addWhitespace = true) {
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
