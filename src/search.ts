import { Editor, EditorPosition } from 'obsidian';

export class SearchCursor {
  public readonly regex: RegExp;
  private _from: EditorPosition;
  private _to: EditorPosition;

  constructor(
    public doc: Editor,
    regex: RegExp | String,
    public readonly caret: EditorPosition,
  ) {
    if (regex instanceof RegExp) {
      this.regex = regex;
    } else {
      this.regex = new RegExp(regex as string);
    }
    this._from = caret;
    this._to = caret;
  }

  public findNext(): boolean {
    const text = this.doc.getValue().slice(this.caretOffset());
    const match = text.match(this.regex);
    if (match?.index == null) {
      return false;
    }
    this._from = this.doc.offsetToPos(this.caretOffset() + match.index);
    this._to = this.doc.offsetToPos(
      this.caretOffset() + match.index + match[0].length,
    );
    return true;
  }

  public findPrevious(): boolean {
    const reverseRegex = new RegExp(this.regex.source, this.regex.flags + 'g');
    const text = this.doc.getValue().slice(this.caretOffset());
    const matches = Array.from(text.matchAll(reverseRegex));
    const lastMatch = matches[matches.length - 1];
    if (lastMatch?.index == null) {
      return false;
    }
    const offset = lastMatch.index;
    this._to = this.doc.offsetToPos(offset + 1 + 1);
    this._to = this.doc.offsetToPos(offset + lastMatch[0].length + 1);
    return true;
  }

  public to(): EditorPosition {
    return this._to;
  }

  public from(): EditorPosition {
    return this._from;
  }

  private caretOffset(): number {
    return this.doc.posToOffset(this.caret);
  }
}
