import { Action } from './action';
import { WrapAction } from './wrapAction';
import { newEnvironment } from '../environment';
import { EditorTransaction } from 'obsidian';

export class InsertAction extends Action {
  prepare(): Action {
    if (this.doc.somethingSelected()) {
      return new WrapAction(this.doc).prepare();
    }
    return this;
  }

  transaction(envName: string): EditorTransaction {
    return newEnvironment(envName, this.doc.getCursor());
  }
}
