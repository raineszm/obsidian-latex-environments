import { fromString } from './codemirrorHelpers';
import { InsertAction } from '../src/actions/insertAction';
import { ChangeAction } from '../src/actions/changeAction';
import { DeleteAction } from '../src/actions/deleteAction';

describe('InsertAction', () => {
  it('adds environment at point', () => {
    const input = '$$|$$';
    const expected = [
      '$$',
      '\\begin{equation}',
      '',
      '\\end{equation}',
      '$$',
    ].join('\n');

    const doc = fromString(input);

    const action = new InsertAction(doc).prepare();
    action.execute('equation');

    expect(doc.getValue()).toBe(expected);
  });
  it('wraps the selection with an environment', () => {
    const input = '$$|x^2 + 1|$$';
    const expected = [
      '$$\\begin{equation}',
      'x^2 + 1',
      '\\end{equation}$$',
    ].join('\n');

    const doc = fromString(input);

    const action = new InsertAction(doc).prepare();
    action.execute('equation');

    expect(doc.getValue()).toBe(expected);
  });
});
describe('ChangeAction', () => {
  it('changes the name of surrounding environment', () => {
    const input = ['$$\\begin{equation}', '|', '\\end{equation}$$'].join('\n');
    const expected = ['$$\\begin{multline}', '', '\\end{multline}$$'].join(
      '\n',
    );

    const doc = fromString(input);

    const action = new ChangeAction(doc).prepare();
    action.execute('multline');

    expect(doc.getValue()).toBe(expected);
  });

  it('when no surrounding environment wraps the whole block', () => {
    const input = '$$|x^2 + 1$$';
    const expected = [
      '$$\\begin{equation}',
      'x^2 + 1',
      '\\end{equation}$$',
    ].join('\n');

    const doc = fromString(input);

    const action = new ChangeAction(doc).prepare();
    action.execute('equation');

    expect(doc.getValue()).toBe(expected);
  });

  it("doesn't add whitespace when no enclosing environment", () => {
    const input = ['$$', '|x^2 + 1', '$$'].join('\n');
    const expected = [
      '$$\\begin{equation}',
      'x^2 + 1',
      '\\end{equation}$$',
    ].join('\n');

    const doc = fromString(input);

    const action = new ChangeAction(doc).prepare();
    action.execute('equation');

    expect(doc.getValue()).toBe(expected);
  });
});


describe('DeleteAction', () => {
  it('removes the begin and end of surrounding environment', () => {
    const input = [
      '$$\\begin{equation}',
      '|x^2 + 1',
      '\\end{equation}$$',
    ].join('\n');

    const expected = ['$$', 'x^2 + 1', '$$'].join('\n');

    const doc = fromString(input);

    const action = new DeleteAction(doc).prepare();
    action.execute('*');

    expect(doc.getValue()).toBe(expected);
  });

  it('it is a noop for no surrounding environments', () => {
    const input = ['$$', '|x^2 + 1', '$$'].join('\n');
    const expected = input.replace('|', '');

    const doc = fromString(input);

    const action = new DeleteAction(doc).prepare();
    action.execute('*');

    expect(doc.getValue()).toBe(expected);
  });
  it.skip('it leaves adjacent environments untouched', () => {

    // const doc = fromString(input);

    // const action = new DeleteAction(doc).prepare();
    // action.execute('*');

    // expect(doc.getValue()).toBe(expected);
  });
});
