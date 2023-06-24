import { EditorTransaction, EditorPosition } from 'obsidian';
import { EditorLike } from './editorLike';

export interface PosRange {
  from: number;
  to: number;
}

export interface Environment {
  name: string;
  begin: PosRange;
  end: PosRange;
  contents: string;
}

export function newEnvironment(
  name: string,
  cursor: EditorPosition,
  contents: string = '',
): EditorTransaction {
  const pad = getPad(contents);
  return {
    replaceSelection: `\\begin{${name}}${pad}${contents}${pad}\\end{${name}}`,
    selection: {
      from: {
        ch: 0,
        line: cursor.line + 1, // move our caret to just before the beginning of contents
      },
    },
  };
}

export function unwrapEnvironment(
  environment: Environment,
  doc: EditorLike,
): EditorTransaction {
  return {
    changes: [
      {
        text: trim(environment.contents),
        from: doc.offsetToPos(environment.begin.from),
        to: doc.offsetToPos(environment.end.to),
      },
    ],
    selection: { from: doc.getCursor() },
  };
}

export function changeEnvironment(
  environment: Environment,
  doc: EditorLike,
  name: string,
): EditorTransaction {
  const change = {
    text: `\\begin{${name}}${environment.contents}\\end{${name}}`,
    from: doc.offsetToPos(environment.begin.from),
    to: doc.offsetToPos(environment.end.to),
  };
  return {
    changes: [change],
    selection: { from: doc.getCursor() },
  };
}

function getPad(text: string): string {
  if (text.length > 0 && text.match(/^[ \t]*$/) != null) {
    return '';
  }
  return '\n';
}

function trim(text: string): string {
  if (text.length === 0) return text;
  const start = text.startsWith('\n') ? 1 : 0;
  const end = text.endsWith('\n') ? text.length - 1 : text.length;
  return text.slice(start, end);
}
