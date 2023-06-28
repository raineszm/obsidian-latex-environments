export class SearchCursor {
  public readonly regex: RegExp;
  private _from: number;
  private _to: number;
  private _caret: number;

  constructor(
    public text: string,
    regex: RegExp | String,
    private readonly _originalCaret: number,
  ) {
    if (regex instanceof RegExp) {
      this.regex = regex;
    } else {
      this.regex = new RegExp(regex as string);
    }
    this.reset();
  }

  public reset(): void {
    this._from = this._originalCaret;
    this._to = this._originalCaret;
    this._caret = this._originalCaret;
  }

  public findNext(): RegExpMatchArray | undefined {
    const text = this.text.slice(this._caret);
    const match = text.match(this.regex);
    if (match?.index == null) {
      return undefined;
    }
    this._from = this._caret + match.index;
    this._to = this._caret + match.index + match[0].length;
    this._caret = this._to;
    return match;
  }

  public findPrevious(): RegExpMatchArray | undefined {
    const reverseRegex = new RegExp(
      `(?<full>${this.regex.source})(?![\\s\\S]*\\k<full>)`,
      this.regex.flags,
    );
    const text = this.text.slice(0, this._caret);
    const lastMatch = text.match(reverseRegex);
    if (lastMatch?.index == null || lastMatch?.groups == null) {
      return undefined;
    }
    this._from = lastMatch.index;
    this._to = lastMatch.index + lastMatch.groups.full.length;
    this._caret = this._from;
    return lastMatch;
  }

  public to(): number {
    return this._to;
  }

  public from(): number {
    return this._from;
  }
}

// interface Match {
//   index: number;
//   text: string;
// }
//
// function getLastMatch(r: RegExp, s: string): Match | undefined {
//   s.match(r);
//   const matches = Array.from(matchAll(r, s));
//   const lastMatch = matches[matches.length - 1];
//   if (lastMatch == null) {
//     return undefined;
//   } else {
//     return {
//       index: lastMatch.index,
//       text: lastMatch[0],
//     };
//   }
// }
