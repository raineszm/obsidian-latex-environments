import { Action } from './action';
import { MathBlock } from '../mathblock';
import { Environment } from '../environment';

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

  execute(_envName: string): void {
    if (this.current !== undefined) this.current.unwrap();
  }
}
