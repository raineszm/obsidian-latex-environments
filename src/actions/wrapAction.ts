import { Action } from './action';
import { Environment } from '../environment';
import { Editor, EditorPosition, EditorTransaction } from 'obsidian';

export class WrapAction extends Action {
  constructor(
    doc: Editor,
    public readonly from: EditorPosition,
    public readonly to: EditorPosition,
    public readonly addWhitespace = true,
  ) {
    super(doc);
  }

  prepare(): Action {
    return this;
  }

  transaction(envName: string): EditorTransaction {
    const newEnvironment = Environment.wrap(
      envName,
      this.doc,
      this.from,
      this.to,
      this.addWhitespace ? '\n' : '',
    );
    return newEnvironment.transaction;
  }
}
