import { Environment, PosRange } from './environment';
import { Editor, EditorPosition } from 'obsidian';
import { SearchCursor } from './search';

export class MathBlock {
  readonly startPosition: EditorPosition;
  readonly endPosition: EditorPosition;
  public doc: Editor;

  constructor(doc: Editor, cursor: EditorPosition) {
    this.doc = doc;
    const searchCursor = new SearchCursor(this.doc, '$$', cursor);
    this.startPosition = searchCursor.findPrevious()
      ? searchCursor.to()
      : doc.offsetToPos(1);
    this.endPosition = searchCursor.findNext()
      ? searchCursor.from()
      : { line: doc.lastLine(), ch: doc.getLine(doc.lastLine()).length - 1 };
  }

  public getEnclosingEnvironment(
    cursor: EditorPosition,
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
            (from.line === cursor.line && from.ch <= cursor.ch))
        );
      })
      .pop();

    if (start === undefined) {
      return undefined;
    }

    const startTo = start.pos.to;
    const after = environments.filter((env) => {
      const from = env.pos.from;
      return (
        from.line > startTo.line ||
        (from.line === startTo.line && from.ch > startTo.ch)
      );
    });

    let open = 1;
    let end: BeginEnd | undefined;
    for (const env of after) {
      if (env.type === 'begin') {
        open++;
      } else {
        open--;
        if (open === 0) {
          end = env;
          break;
        }
      }
    }

    if (end === undefined) {
      throw new Error('current environment is never closed');
    }

    const endTo = end.pos.to;
    if (
      endTo.line < cursor.line ||
      (endTo.line === cursor.line && endTo.ch < cursor.ch)
    ) {
      return undefined;
    }

    return new Environment(this.doc, start.name, start.pos, end.pos);
  }

  public static isMathMode(cursor: EditorPosition, editor: Editor): boolean {
    // const token = editor.getTokenAt(cursor);
    // const state = token.state;
    // return state.hmdInnerStyle === 'math';
    return true;
  }
}

interface BeginEnd {
  name: string;
  type: 'begin' | 'end';
  pos: PosRange;
}

class BeginEnds implements IterableIterator<BeginEnd> {
  private readonly openEnvs: BeginEnd[] = [];
  private search: SearchCursor;
  constructor(
    readonly doc: Editor,
    readonly start: EditorPosition,
    readonly end: EditorPosition,
  ) {
    this.search = this.getEnvCursor(this.start);
  }

  public reset(): void {
    this.search = this.getEnvCursor(this.start);
  }

  private getEnvCursor(start: EditorPosition): SearchCursor {
    return new SearchCursor(this.doc, /\\(begin|end){\s*([^}]+)\s*}/m, start);
  }

  public get isOpen(): boolean {
    return this.openEnvs.length > 0;
  }

  [Symbol.iterator](): IterableIterator<BeginEnd> {
    this.reset();
    return this;
  }

  next(): IteratorResult<BeginEnd> {
    const match = this.search.findNext();
    const to = this.search.to();

    if (
      match ||
      !match ||
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
        if (current === undefined) {
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
    throw new Error(`regex returned unexpected result ${match[1] as string}`);
  }
}
