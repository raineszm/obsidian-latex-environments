import { Action } from './action';
import { MathBlock } from '../mathblock';
import { Environment } from '../environment';
import { EditorTransaction } from 'obsidian';

export class DeleteAction extends Action {
  private current: Environment | undefined;

  public get needsName(): boolean {
    return false;
  }

  prepare(): Action {
    const cursor = this.doc.getCursor();
    const block = new MathBlock(this.doc, cursor);
    this.current = block.getEnclosingEnvironment(cursor);
    return this;
  }

  transaction(_envName: string): EditorTransaction {
    if (this.current !== undefined) {
      this.current.unwrap();
      return this.current.transaction;
    }
    return {};
  }
}
