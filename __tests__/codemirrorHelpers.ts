import * as CodeMirror from 'codemirror';
import 'codemirror/addon/search/searchcursor';

export function fromString(template: string): CodeMirror.Doc {
  const doc = CodeMirror.Doc(template);
  const search = doc.getSearchCursor('|');
  if (search.findNext()) {
    doc.setCursor(search.from());
    doc.replaceRange('', search.from(), search.to());
  }
  return doc;
}
