import { Action } from './action';
import { WrapAction } from './wrapAction';
import { Environment } from '../environment';
import { EditorTransaction } from 'obsidian';

export class InsertAction extends Action {
  prepare(): Action {
    if (this.doc.somethingSelected()) {
      return new WrapAction(
        this.doc,
        this.doc.getCursor('from'),
        this.doc.getCursor('to'),
      ).prepare();
    }
    return this;
  }

  transaction(envName: string): EditorTransaction {
    const environment = Environment.create(
      envName,
      this.doc,
      this.doc.getCursor(),
    );
    return environment.transaction;
  }
}
