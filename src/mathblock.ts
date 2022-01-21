import { Environment } from './environment';
import { SearchCursor } from './search';
import { Editor } from 'obsidian';

export class MathBlock {
  readonly startPosition: number;
  readonly endPosition: number;

  constructor(public readonly text: string, cursor: number) {
    const searchCursor = new SearchCursor(text, '$$', cursor);
    this.startPosition = searchCursor.findPrevious() ? searchCursor.to() : 0;
    this.endPosition = searchCursor.findNext()
      ? searchCursor.from()
      : text.length;
  }

  public getEnclosingEnvironment(cursor: number): Environment | undefined {
    const beginEnds = new BeginEnds(
      this.text,
      this.startPosition,
      this.endPosition,
    );
    const environments = Array.from(beginEnds);

    if (beginEnds.isOpen) {
      throw new Error('unclosed environments in block');
    }
    const start = environments
      .filter((env) => env.type === 'begin' && env.from < cursor)
      .pop();

    if (start === undefined) {
      return undefined;
    }

    const after = environments.filter((env) => env.from > start.to);

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

    if (end.to < cursor) {
      return undefined;
    }

    return new Environment(this.text, start.name, start, end);
  }

  public static isMathMode(cursor: number, editor: Editor): boolean {
    // const token = editor.getTokenAt(cursor);
    // const state = token.state;
    // return state.hmdInnerStyle === 'math';
    return true;
  }
}

interface BeginEnd {
  name: string;
  type: 'begin' | 'end';
  from: number;
  to: number;
}

class BeginEnds implements IterableIterator<BeginEnd> {
  private readonly openEnvs: BeginEnd[] = [];
  private search: SearchCursor;
  constructor(
    readonly text: string,
    readonly start: number,
    readonly end: number,
  ) {
    this.search = this.getEnvCursor(this.start);
  }

  public reset(): void {
    this.search = this.getEnvCursor(this.start);
  }

  private getEnvCursor(start: number): SearchCursor {
    return new SearchCursor(this.text, /\\(begin|end){\s*([^}]+)\s*}/m, start);
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

    if (match || !match || to > this.end) {
      return { done: true, value: null };
    }

    switch (match[1]) {
      case 'begin': {
        const current: BeginEnd = {
          name: match[2],
          type: 'begin',
          from: this.search.from(),
          to: this.search.to(),
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
            from: this.search.from(),
            to: this.search.to(),
          },
        };
      }
    }
    throw new Error(`regex returned unexpected result ${match[1] as string}`);
  }
}
