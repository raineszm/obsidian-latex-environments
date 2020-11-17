import { Action } from './action';
import * as CodeMirror from 'codemirror';
import { Environment } from '../environment';

export class WrapAction extends Action {
  constructor(
    doc: CodeMirror.Doc,
    public readonly from: CodeMirror.Position,
    public readonly to: CodeMirror.Position,
    public readonly addWhitespace = true,
  ) {
    super(doc);
  }

  prepare(): Action {
    return this;
  }

  execute(envName: string): void {
    Environment.wrap(
      envName,
      this.doc,
      this.from,
      this.to,
      this.addWhitespace ? '\n' : '',
    );
  }
}
