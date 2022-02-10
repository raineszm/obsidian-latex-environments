import { Editor, EditorTransaction, EditorPosition } from 'obsidian';

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
  doc: Editor,
): EditorTransaction {
  return {
    changes: [
      {
        text: environment.contents,
        from: doc.offsetToPos(environment.begin.from),
        to: doc.offsetToPos(environment.end.to),
      },
    ],
  };
}

export function changeEnvironment(
  environment: Environment,
  doc: Editor,
  name: string,
): EditorTransaction {
  const change = {
    text: `\\begin{${name}}${environment.contents}\\end{${name}}`,
    from: doc.offsetToPos(environment.begin.from),
    to: doc.offsetToPos(environment.end.to),
  };
  return {
    changes: [change],
  };
}

function getPad(text: string): string {
  if (text.length > 0 && text.match(/^[ \t]*$/) != null) {
    return '';
  }
  return '\n';
}
