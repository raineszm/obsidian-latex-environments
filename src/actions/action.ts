import * as CodeMirror from 'codemirror';

export abstract class Action {
  constructor(public doc: CodeMirror.Doc) {}
  abstract prepare(): Action;
  abstract execute(envName: string): void;
  public suggestName(): string | undefined {
    return undefined;
  }
}