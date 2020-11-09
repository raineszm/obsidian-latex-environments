import * as CodeMirror from 'codemirror';

export type PosRange = {
  from: CodeMirror.Position;
  to: CodeMirror.Position;
};

const BEGIN_LENGTH = 8;
const END_LENGTH = 6;

export class Environment {
  constructor(
    public doc: CodeMirror.Doc,
    private _name: string,
    private _start: PosRange,
    private _end: PosRange,
  ) {}

  public get name(): string {
    return this._name;
  }

  public get start(): PosRange {
    return this._start;
  }

  public get end(): PosRange {
    return this._end;
  }

  public get beginString(): string {
    return `\\begin{${this._name}}`;
  }

  public get endString(): string {
    return `\\end{${this._name}}`;
  }

  public replace(envName: string): Environment {
    this._name = envName;
    this.doc.replaceRange(this.beginString, this.start.from, this.start.to);
    this.doc.replaceRange(this.endString, this.end.from, this.end.to);
    this._start.to = {
      line: this.start.from.line,
      ch: this.start.from.ch + this.beginString.length,
    };
    this._end.to = {
      line: this.end.from.line,
      ch: this.end.from.ch + this.endString.length,
    };
    return this;
  }

  public print(contents = '\n\n'): string {
    return `${this.beginString}${contents}${this.endString}`;
  }

  private static newRange(
    cursor: CodeMirror.Position,
    envName: string,
    lineOffset: number,
    chOffset: number,
  ): PosRange {
    return {
      from: {
        line: cursor.line + lineOffset,
        ch: cursor.ch,
      },
      to: {
        line: cursor.line + lineOffset,
        ch: cursor.ch + chOffset + envName.length,
      },
    };
  }

  public static create(
    envName: string,
    doc: CodeMirror.Doc,
    cursor: CodeMirror.Position,
  ): Environment {
    const newLine = nextLine(cursor, true);
    const newEnvironment = new Environment(
      doc,
      envName,
      this.newRange(newLine, envName, 0, BEGIN_LENGTH),
      this.newRange(newLine, envName, 2, END_LENGTH),
    );

    doc.replaceRange('\n' + newEnvironment.print() + '\n', cursor);
    doc.setCursor(nextLine(newLine));
    return newEnvironment;
  }

  public static wrap(
    envName: string,
    doc: CodeMirror.Doc,
    from: CodeMirror.Position,
    to: CodeMirror.Position,
  ): Environment {
    const newEnvironment = new Environment(
      doc,
      envName,
      this.newRange(from, envName, 0, BEGIN_LENGTH),
      this.newRange(nextLine(to, true, 2), envName, 2, END_LENGTH),
    );
    doc.replaceRange('\n' + newEnvironment.endString, to);
    doc.replaceRange(newEnvironment.beginString + '\n', from);
    doc.setSelection(nextLine(to, true));

    return newEnvironment;
  }
}

function nextLine(
  cursor: CodeMirror.Position,
  cr = false,
  offset = 1,
): CodeMirror.Position {
  return { line: cursor.line + offset, ch: cr ? 0 : cursor.ch };
}
