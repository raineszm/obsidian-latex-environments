import * as CodeMirror from 'codemirror';
import { Environment, PosRange } from './environment';

export class MathBlock {
  readonly startPosition: CodeMirror.Position;
  readonly endPosition: CodeMirror.Position;
  public doc: CodeMirror.Doc;

  constructor(doc: CodeMirror.Doc, cursor: CodeMirror.Position) {
    const searchCursor = doc.getSearchCursor('$$', cursor);
    this.startPosition = searchCursor.findPrevious()
      ? searchCursor.to()
      : { line: doc.firstLine(), ch: 0 };
    this.endPosition = searchCursor.findNext()
      ? searchCursor.from()
      : { line: doc.lastLine(), ch: doc.getLine(doc.lastLine()).length - 1 };
    this.doc = doc;
  }

  public getEnclosingEnvironment(
    cursor: CodeMirror.Position,
  ): Environment | undefined {
    const beginEnds = new BeginEnds(
      this.doc,
      this.startPosition,
      this.endPosition,
    );
    const environments = Array.from(beginEnds);

    if (beginEnds.isOpen) {
      throw new Error('unclosed environments in block');
    }
    const start = environments
      .filter((env) => {
        const from = env.pos.from;
        return (
          env.type === 'begin' &&
          (from.line < cursor.line ||
            (from.line == cursor.line && from.ch <= cursor.ch))
        );
      })
      .pop();

    if (!start) {
      return undefined;
    }

    const end = environments
      .filter((env) => {
        const to = env.pos.to;
        return (
          env.type === 'end' &&
          (to.line > cursor.line ||
            (to.line == cursor.line && to.ch > cursor.ch))
        );
      })
      .shift();

    if (!end) {
      throw new Error('current environment is never closed');
    }

    return new Environment(this.doc, start.name, start.pos, end.pos);
  }

  public static isMathMode(
    cursor: CodeMirror.Position,
    editor: CodeMirror.Editor,
  ): boolean {
    const token = editor.getTokenAt(cursor);
    const state = token.state;
    return state.hmdInnerStyle === 'math';
  }
}

interface BeginEnd {
  name: string;
  type: 'begin' | 'end';
  pos: PosRange;
}

class BeginEnds implements IterableIterator<BeginEnd> {
  private openEnvs: BeginEnd[] = [];
  private search: CodeMirror.SearchCursor;
  constructor(
    readonly doc: CodeMirror.Doc,
    readonly start: CodeMirror.Position,
    readonly end: CodeMirror.Position,
  ) {
    this.search = this.getEnvCursor(this.start);
  }

  public reset(): void {
    this.search = this.getEnvCursor(this.start);
  }

  private getEnvCursor(start: CodeMirror.Position): CodeMirror.SearchCursor {
    return this.doc.getSearchCursor(/\\(begin|end){\s*([^}]+)\s*}/m, start);
  }

  public get isOpen(): boolean {
    return !!this.openEnvs.length;
  }

  [Symbol.iterator](): IterableIterator<BeginEnd> {
    this.reset();
    return this;
  }

  next(): IteratorResult<BeginEnd> {
    const match = this.search.findNext();
    const to = this.search.to();

    if (
      match === true ||
      match === false ||
      to.line > this.end.line ||
      (to.line === this.end.line && to.ch > this.end.ch)
    ) {
      return { done: true, value: null };
    }

    switch (match[1]) {
      case 'begin': {
        const current: BeginEnd = {
          name: match[2],
          type: 'begin',
          pos: {
            from: this.search.from(),
            to: this.search.to(),
          },
        };
        this.openEnvs.push(current);
        return {
          done: false,
          value: current,
        };
      }
      case 'end': {
        const current = this.openEnvs.pop();
        if (!current) {
          throw new Error('closing environment which was never opened');
        }
        if (current.name !== match[2]) {
          throw new Error('environment not closed properly');
        }
        return {
          done: false,
          value: {
            name: match[2],
            type: 'end',
            pos: {
              from: this.search.from(),
              to: this.search.to(),
            },
          },
        };
      }
    }
    throw new Error(`regex returned unexpected result ${match[1]}`);
  }
}
