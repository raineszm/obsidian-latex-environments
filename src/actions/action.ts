import { EditorTransaction } from 'obsidian';
import { EditorLike } from '../editorLike';

export abstract class Action {
  constructor(public doc: EditorLike) {}
  abstract prepare(): Action;
  abstract transaction(envName: string): EditorTransaction;
  public suggestName(): string | undefined {
    return undefined;
  }

  public get needsName(): boolean {
    return true;
  }
}
