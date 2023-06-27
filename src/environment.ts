import { EditorTransaction, EditorPosition } from 'obsidian';
import { EditorLike } from './editorLike';
import { MathBlock } from './mathblock';

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
  return {
    replaceSelection: `\\begin{${name}}${padContents(
      contents,
      true,
    )}\\end{${name}}`,
    selection: {
      from: {
        ch: 0,
        line: cursor.line + 1, // move our caret to just before the beginning of contents
      },
    },
  };
}

export function wrapSelection(
  name: string,
  cursor: EditorPosition,
  contents: string = '',
): EditorTransaction {
  return {
    replaceSelection: `\\begin{${name}}${padContents(contents)}\\end{${name}}`,
    selection: {
      from: {
        ch: 0,
        line: cursor.line + 1, // move our caret to just before the beginning of contents
      },
    },
  };
}

export function wrapBlock(
  name: string,
  doc: EditorLike,
  block: MathBlock,
): EditorTransaction {
  const blockText = block.text.slice(block.startPosition, block.endPosition);
  // Handle the case where the cursor on the beginning line of the block
  let cursor = doc.getCursor();
  const start = doc.offsetToPos(block.startPosition);
  if (cursor.line === start.line) {
    cursor = {
      line: cursor.line + 1,
      ch: 0,
    };
  }
  return {
    changes: [
      {
        from: doc.offsetToPos(block.startPosition),
        to: doc.offsetToPos(block.endPosition),
        text: `\\begin{${name}}${padContents(blockText)}\\end{${name}}`,
      },
    ],
    selection: { from: cursor },
  };
}

export function unwrapEnvironment(
  environment: Environment,
  doc: EditorLike,
): EditorTransaction {
  let cursor = doc.getCursor();
  if (justWhitespace(environment.contents.split('\n', 1)[0])) {
    // If the first line of the environment is just whitespace, we'll
    // move the cursor to the following line
    cursor = {
      line: cursor.line - 1,
      ch: cursor.ch + doc.offsetToPos(environment.begin.from).ch,
    };
  }
  return {
    changes: [
      {
        text: trim(environment.contents),
        from: doc.offsetToPos(environment.begin.from),
        to: doc.offsetToPos(environment.end.to),
      },
    ],
    selection: { from: cursor },
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

function padContents(contents: string, padEmpty: boolean = false): string {
  const lines = contents.split('\n');
  return `${getPad(lines[0], padEmpty)}${contents}${getPad(
    lines[lines.length - 1],
    padEmpty,
  )}`;
}

function justWhitespace(text: string): boolean {
  return text.match(/^[ \t]*$/) != null;
}

function getPad(text: string, padEmpty: boolean = false): string {
  if (text.length === 0 && padEmpty) return '\n';
  if (text.length === 0 || justWhitespace(text)) return '';
  return '\n';
}

function trim(text: string): string {
  if (text.length === 0) return text;
  const start = text.startsWith('\n') ? 1 : 0;
  const end = text.endsWith('\n') ? text.length - 1 : text.length;
  return text.slice(start, end);
}
