import * as CodeMirror from 'codemirror';

export type PosRange = {
  from: CodeMirror.Position;
  to: CodeMirror.Position;
};

export class Environment {
  constructor(
    public doc: CodeMirror.Doc,
    public readonly name: string,
    public readonly start: PosRange,
    public readonly end: PosRange,
  ) {}

  public replace(envName: string): void {
    this.doc.replaceRange(
      `\\begin{${envName}}`,
      this.start.from,
      this.start.to,
    );
    this.doc.replaceRange(`\\end{${envName}}`, this.end.from, this.end.to);
  }
}
