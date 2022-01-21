import { Editor, EditorChange } from 'obsidian';

export class Change {
  constructor(
    public readonly text: string,
    public readonly from: number,
    public readonly to?: number,
  ) {}

  public toEditorChange(editor: Editor): EditorChange {
    return {
      text: this.text,
      from: editor.offsetToPos(this.from),
      to: this.to == null ? this.to : editor.offsetToPos(this.to),
    };
  }
}
