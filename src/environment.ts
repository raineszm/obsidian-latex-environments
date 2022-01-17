import {
  Editor,
  EditorChange,
  EditorPosition,
  EditorTransaction,
} from 'obsidian';

export interface PosRange {
  from: EditorPosition;
  to: EditorPosition;
}

const BEGIN_LENGTH = 8;
const END_LENGTH = 6;

export class Environment {
  constructor(
    public doc: Editor,
    private _name: string,
    private _start: PosRange,
    private _end: PosRange,
    changes?: EditorChange[],
    cursor?: EditorPosition,
  ) {
    this._changes = changes ?? [];
    this._cursor = cursor;
  }

  private readonly _changes: EditorChange[];
  private _cursor?: EditorPosition;

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

  public get transaction(): EditorTransaction {
    return {
      changes: this._changes,
      selection: this._cursor == null ? undefined : { from: this._cursor },
    };
  }

  private replaceRange(
    text: string,
    from: EditorPosition,
    to?: EditorPosition,
  ): void {
    this._changes.push({
      text,
      from,
      to,
    });
  }

  private setCursor(cursor: EditorPosition): Environment {
    this._cursor = cursor;
    return this;
  }

  private getCursor(): EditorPosition {
    return this._cursor ?? this.doc.getCursor();
  }

  public replace(envName: string): Environment {
    this._name = envName;
    this.replaceRange(this.beginString, this.start.from, this.start.to);
    this.replaceRange(this.endString, this.end.from, this.end.to);
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
    cursor: EditorPosition,
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
    doc: Editor,
    cursor: EditorPosition,
  ): Environment {
    const newLine = nextLine(cursor, true);
    const newEnvironment = new Environment(
      doc,
      envName,
      Environment.newRange(newLine, envName, 0, BEGIN_LENGTH),
      Environment.newRange(newLine, envName, 2, END_LENGTH),
    );

    const line = doc.getLine(cursor.line);
    const frontPad = getPad(line.substr(0, cursor.ch));
    const rearPad = getPad(line.substr(cursor.ch));

    newEnvironment.replaceRange(
      frontPad + newEnvironment.print() + rearPad,
      cursor,
    );
    newEnvironment.setCursor(nextLine(newLine, false, frontPad.length));
    return newEnvironment;
  }

  public static wrap(
    envName: string,
    doc: Editor,
    from: EditorPosition,
    to: EditorPosition,
    outerPad = '\n',
  ): Environment {
    const newEnvironment = new Environment(
      doc,
      envName,
      Environment.newRange(from, envName, 0, BEGIN_LENGTH),
      Environment.newRange(nextLine(to, true, 2), envName, 2, END_LENGTH),
    );
    newEnvironment.replaceRange(outerPad + newEnvironment.endString, to);
    newEnvironment.replaceRange(newEnvironment.beginString + outerPad, from);
    if (doc.somethingSelected()) {
      newEnvironment.setCursor(nextLine(from, true));
    } else {
      const lineOffset = newEnvironment.start.from.line - from.line;
      newEnvironment.setCursor(
        nextLine(newEnvironment.getCursor(), false, lineOffset),
      );
    }

    return newEnvironment;
  }

  public unwrap(): void {
    this.replaceRange('', this.start.from, this.start.to);
    this.replaceRange('', this.end.from, this.end.to);
  }
}

function nextLine(
  cursor: EditorPosition,
  cr = false,
  offset = 1,
): EditorPosition {
  return { line: cursor.line + offset, ch: cr ? 0 : cursor.ch };
}

function getPad(text: string): string {
  if (text.match(/^[ \t]*$/) !== null) {
    return '';
  }
  return '\n';
}
