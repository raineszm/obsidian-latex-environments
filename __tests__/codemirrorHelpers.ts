import CodeMirror, { Doc } from 'codemirror';
import 'codemirror/addon/search/searchcursor';

export function fromString(template: string): CodeMirror.Doc {
  const doc = Doc(template);
  const search = doc.getSearchCursor('|');
  if (search.findNext() !== false) {
    doc.setCursor(search.from());
    doc.replaceRange('', search.from(), search.to());
  }
  if (search.findNext() !== false) {
    doc.setSelection(doc.getCursor(), search.from());
    doc.replaceRange('', search.from(), search.to());
  }
  return doc;
}

export function allCursorsFromString(str: string): CodeMirror.Position[] {
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

export function cursorFromString(str: string): CodeMirror.Position {
  const cursor = allCursorsFromString(str).shift();
  if (cursor === undefined) {
    return { ch: -1, line: -1 };
  }
  return cursor;
}

export function valueAndCursor(
  str: string,
): { value: string; cursor: CodeMirror.Position } {
  return {
    value: str.replace('|', ''),
    cursor: cursorFromString(str),
  };
}
