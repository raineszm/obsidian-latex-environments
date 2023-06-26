import { PosRange } from '../src/environment';
import { EditorPosition } from 'obsidian';

export interface DocInfo {
  text: string;
  cursor: number;
  selection: PosRange;
}
export function fromString(template: string): DocInfo {
  const pieces = template.split('|');
  const cursor = pieces.length > 1 ? pieces[0].length : 0;
  const rangeEnd = pieces.length > 2 ? cursor + pieces[1].length : cursor;
  return {
    text: pieces.join(''),
    cursor,
    selection: {
      from: cursor,
      to: rangeEnd,
    },
  };
}

export function allCursorsFromString(str: string): EditorPosition[] {
  const cursors = [];
  const lines = str.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const ch = lines[i].indexOf('|');
    if (ch !== -1) {
      cursors.push({ ch: ch, line: i });
    }
  }
  return cursors;
}

export function cursorFromString(str: string): EditorPosition {
  const cursor = allCursorsFromString(str).shift();
  if (cursor === undefined) {
    return { ch: -1, line: -1 };
  }
  return cursor;
}

export function valueAndCursor(str: string): {
  value: string;
  cursor: EditorPosition;
} {
  return {
    value: str.replace('|', ''),
    cursor: cursorFromString(str),
  };
}
