import CodeMirror, {Doc} from 'codemirror';
import 'codemirror/addon/search/searchcursor';

export function fromString (template: string): CodeMirror.Doc {
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
