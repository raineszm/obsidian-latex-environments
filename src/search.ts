export class SearchCursor {
  public readonly regex: RegExp;
  private _from: number;
  private _to: number;

  constructor(
    public text: string,
    regex: RegExp | String,
    public readonly caret: number,
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
    const text = this.text.slice(this.caret);
    const match = text.match(this.regex);
    if (match?.index == null) {
      return false;
    }
    this._from = this.caret + match.index;
    this._to = this.caret + match.index + match[0].length;
    return true;
  }

  public findPrevious(): boolean {
    const reverseRegex = new RegExp(this.regex.source, this.regex.flags + 'g');
    const text = this.text.slice(this.caret);
    const lastMatch = getLastMatch(reverseRegex, text);
    if (lastMatch == null) {
      return false;
    }
    this._from = lastMatch.index + 1 + 1;
    this._to = lastMatch.index + lastMatch.text.length + 1;
    return true;
  }

  public to(): number {
    return this._to;
  }

  public from(): number {
    return this._from;
  }
}

interface Match {
  index: number;
  text: string;
}

function getLastMatch(r: RegExp, s: string): Match | undefined {
  const matches = Array.from(matchAll(r, s));
  const lastMatch = matches[matches.length - 1];
  if (lastMatch == null) {
    return undefined;
  } else {
    return {
      index: lastMatch.index,
      text: lastMatch[0],
    };
  }
}

function* matchAll(r: RegExp, s: string): Generator<RegExpExecArray> {
  while (true) {
    const match = r.exec(s);
    if (match == null) return;
    yield match;
  }
}
