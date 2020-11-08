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

  private getEnvCursor(start: CodeMirror.Position): CodeMirror.SearchCursor {
    return this.doc.getSearchCursor(/\\(begin|end){\s*([^}]+)\s*}/m, start);
  }

  private getEnclosingStart(
    cursor: CodeMirror.Position,
  ): EnvironmentStart | undefined {
    const enclosing = [];
    const envCursor = this.getEnvCursor(this.startPosition);

    let match;

    while ((match = envCursor.findNext())) {
      const from = envCursor.from();
      if (
        from.line > cursor.line ||
        (from.line === cursor.line && from.ch > cursor.ch)
      ) {
        break;
      }
      if (match === true) continue;

      switch (match[1]) {
        case 'begin':
          enclosing.push({
            name: match[2],
            start: {
              from: envCursor.from(),
              to: envCursor.to(),
            },
          });
          break;
        case 'end': {
          const current = enclosing.pop();
          if (!current) {
            throw new Error('closing environment which was never opened');
          }
          if (current.name !== match[2]) {
            throw new Error('environment not closed properly');
          }
        }
      }
    }

    return enclosing.pop();
  }

  private getEnclosingEnd(name: string, cursor: CodeMirror.Position): PosRange {
    const envCursor = this.getEnvCursor(cursor);

    let match;
    while ((match = envCursor.findNext())) {
      const to = envCursor.to();
      if (
        to.line > this.endPosition.line ||
        (to.line === this.endPosition.line && to.ch > this.endPosition.ch)
      ) {
        break;
      }

      if (match === true) {
        continue;
      }

      if (match[1] === 'end' && match[2] === name) {
        return {
          from: envCursor.from(),
          to: envCursor.to(),
        };
      }
    }
    throw new Error('current environment is never closed');
  }

  public getEnclosingEnvironment(
    cursor: CodeMirror.Position,
  ): Environment | undefined {
    const env = this.getEnclosingStart(cursor);

    if (!env) {
      return undefined;
    }
    return new Environment(
      this.doc,
      env.name,
      env.start,
      this.getEnclosingEnd(env.name, cursor),
    );
  }

  public static isMathMode(
    cursor: CodeMirror.Position,
    doc: CodeMirror.Editor,
  ): boolean {
    const token = doc.getTokenAt(cursor);
    const state = token.state;
    return state.hmdInnerStyle === 'math';
  }
}

interface EnvironmentStart {
  name: string;
  start: PosRange;
}
