import { Editor, EditorTransaction } from 'obsidian';

export abstract class Action {
  constructor(public doc: Editor) {}
  abstract prepare(): Action;
  abstract transaction(envName: string): EditorTransaction;
  public suggestName(): string | undefined {
    return undefined;
  }

  public get needsName(): boolean {
    return true;
  }
}
