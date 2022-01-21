import { Action } from './action';
import { MathBlock } from '../mathblock';
import { Environment } from '../environment';
import { WrapAction } from './wrapAction';
import { EditorTransaction } from 'obsidian';

export class ChangeAction extends Action {
  private current: Environment | undefined;
  private name: string | undefined;

  public suggestName(): string | undefined {
    return this.name;
  }

  prepare(): Action {
    const cursor = this.doc.posToOffset(this.doc.getCursor());
    const block = new MathBlock(this.doc.getValue(), cursor);
    this.current = block.getEnclosingEnvironment(cursor);
    if (this.current === undefined) {
      return new WrapAction(
        this.doc,
        this.doc.offsetToPos(block.startPosition),
        this.doc.offsetToPos(block.endPosition),
        block.startPosition === block.endPosition,
      );
    }
    this.name = this.current.name;
    return this;
  }

  transaction(envName: string): EditorTransaction {
    if (this.current !== undefined) {
      this.current.replace(envName);
      return this.current.transaction(this.doc);
    }
    return {};
  }
}
