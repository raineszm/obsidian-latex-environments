import { fromString, valueAndCursor } from './codemirrorHelpers';
import { InsertAction } from '../src/actions/insertAction';
import { ChangeAction } from '../src/actions/changeAction';
import { DeleteAction } from '../src/actions/deleteAction';
import { Action } from '../src/actions/action';
import CodeMirror from 'codemirror';

function runAction<A extends Action>(
  input: string,
  ActionType: new (doc: CodeMirror.Doc) => A,
  envName = 'equation',
): CodeMirror.Doc {
  const doc = fromString(input);

  const action = new ActionType(doc).prepare();
  action.execute(envName);
  return doc;
}

// | indicates the location of the cursor

describe('InsertAction', () => {
  it('adds environment at point', () => {
    const input = '$$|$$';
    const expected = [
      '$$',
      '\\begin{equation}',
      '|',
      '\\end{equation}',
      '$$',
    ].join('\n');
    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, InsertAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });
  it('wraps the selection with an environment', () => {
    const input = '$$|x^2 + 1|$$';
    const expected = [
      '$$\\begin{equation}',
      '|x^2 + 1',
      '\\end{equation}$$',
    ].join('\n');

    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, InsertAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.somethingSelected()).toBeFalsy();
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });

  it('adds newlines to separate from adjacent content', () => {
    const input = ['$$', 'x^2 + 1| - 2', '$$'].join('\n');
    const expected = [
      '$$',
      'x^2 + 1',
      '\\begin{equation}',
      '|',
      '\\end{equation}',
      ' - 2',
      '$$',
    ].join('\n');
    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, InsertAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });
  it("doesn't add a newline after when all white space after the cursor", () => {
    const input = ['$$', 'x^2 + 1|', '$$'].join('\n');
    const expected = [
      '$$',
      'x^2 + 1',
      '\\begin{equation}',
      '|',
      '\\end{equation}',
      '$$',
    ].join('\n');
    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, InsertAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });
  it("doesn't add a newline before when all white space before the cursor", () => {
    const input = ['$$', '|x^2 + 1', '$$'].join('\n');
    const expected = [
      '$$',
      '\\begin{equation}',
      '|',
      '\\end{equation}',
      'x^2 + 1',
      '$$',
    ].join('\n');
    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, InsertAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });
  it("doesn't add newlines if insert line is blank", () => {
    const input = ['$$', '|', '$$'].join('\n');
    const expected = [
      '$$',
      '\\begin{equation}',
      '|',
      '\\end{equation}',
      '$$',
    ].join('\n');
    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, InsertAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });
});
describe('ChangeAction', () => {
  it('changes the name of surrounding environment', () => {
    const input = ['$$\\begin{equation}', '|', '\\end{equation}$$'].join('\n');
    const expected = ['$$\\begin{multline}', '|', '\\end{multline}$$'].join(
      '\n',
    );
    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, ChangeAction, 'multline');
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });

  it('when no surrounding environment wraps the whole block', () => {
    const input = '$$|x^2 + 1$$';
    const expected = [
      '$$\\begin{equation}',
      '|x^2 + 1',
      '\\end{equation}$$',
    ].join('\n');

    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, ChangeAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });

  it('wraps the whole block when not enclosed and after another environment', () => {
    const input = [
      '$$',
      'x^2 + 1',
      '= \\begin{pmatrix}',
      '1 & 0',
      '\\end{pmatrix}',
      '| - 3',
      '$$',
    ].join('\n');
    const expected = [
      '$$\\begin{equation}',
      'x^2 + 1',
      '= \\begin{pmatrix}',
      '1 & 0',
      '\\end{pmatrix}',
      '| - 3',
      '\\end{equation}$$',
    ].join('\n');

    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, ChangeAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });

  it("doesn't add whitespace when no enclosing environment", () => {
    const input = ['$$', '|x^2 + 1', '$$'].join('\n');
    const expected = [
      '$$\\begin{equation}',
      '|x^2 + 1',
      '\\end{equation}$$',
    ].join('\n');

    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, ChangeAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });
});

describe('DeleteAction', () => {
  it('removes the begin and end of surrounding environment', () => {
    const input = ['$$\\begin{equation}', '|x^2 + 1', '\\end{equation}$$'].join(
      '\n',
    );

    const expected = ['$$', '|x^2 + 1', '$$'].join('\n');

    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, DeleteAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });

  it('is a noop for no surrounding environments', () => {
    const input = ['$$', '|x^2 + 1', '$$'].join('\n');
    const expected = input;

    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, DeleteAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });
  it('leaves adjacent environments untouched', () => {
    const input = [
      '$$\\begin{gather}',
      'x^2|=2\\\\',
      '\\begin{pmatrix}',
      '1&2\\\\',
      '3&4',
      '\\end{pmatrix}',
      '\\end{gather}$$',
    ].join('\n');
    const expected = [
      '$$',
      'x^2|=2\\\\',
      '\\begin{pmatrix}',
      '1&2\\\\',
      '3&4',
      '\\end{pmatrix}',
      '$$',
    ].join('\n');

    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, DeleteAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });
  it('only deletes nearest enclosing environment', () => {
    const input = [
      '$$\\begin{equation}',
      '\\begin{gathered}',
      'x^2|=2\\\\',
      'y^2=3',
      '\\end{gathered}',
      '\\end{equation}$$',
    ].join('\n');
    const expected = [
      '$$\\begin{equation}',
      '',
      'x^2|=2\\\\',
      'y^2=3',
      '',
      '\\end{equation}$$',
    ].join('\n');

    const { value, cursor } = valueAndCursor(expected);
    const doc = runAction(input, DeleteAction);
    expect(doc.getValue()).toBe(value);
    expect(doc.getCursor()).toStrictEqual(expect.objectContaining(cursor));
  });
});
