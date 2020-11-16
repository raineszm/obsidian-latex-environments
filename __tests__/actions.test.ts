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

  it('adds newlines to separate from adjacent content', () => {
    const input = ['$$', 'x^2 + 1| - 2', '$$'].join('\n');
    const expected = [
      '$$',
      'x^2 + 1',
      '\\begin{equation}',
      '',
      '\\end{equation}',
      '- 2',
      '$$',
    ].join('\n');
    const doc = fromString(input);

    const action = new InsertAction(doc).prepare();
    action.execute('equation');

    expect(doc.getValue()).toBe(expected);
  });
  it("doesn't add a newline after when all white space after the curosr", () => {
    const input = ['$$', 'x^2 + 1|', '$$'].join('\n');
    const expected = [
      '$$',
      'x^2 + 1',
      '\\begin{equation}',
      '',
      '\\end{equation}$$',
    ].join('\n');
    const doc = fromString(input);

    const action = new InsertAction(doc).prepare();
    action.execute('equation');

    expect(doc.getValue()).toBe(expected);
  });
  it("doesn't add a newline before when all white space before the curosr", () => {
    const input = ['$$', 'x^2 + 1|', '$$'].join('\n');
    const expected = [
      '$$',
      '\\begin{equation}',
      '',
      '\\end{equation}',
      'x^2 + 1',
      '$$',
    ].join('\n');
    const doc = fromString(input);

    const action = new InsertAction(doc).prepare();
    action.execute('equation');

    expect(doc.getValue()).toBe(expected);
  });
  it("doesn't add newlines if insert line is blank", () => {
    const input = ['$$', '|', '$$'].join('\n');
    const expected = ['$$\\begin{equation}', '', '\\end{equation}$$'].join(
      '\n',
    );
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
    const input = ['$$\\begin{equation}', '|x^2 + 1', '\\end{equation}$$'].join(
      '\n',
    );

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
  it('it leaves adjacent environments untouched', () => {
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
      'x^2=2\\\\',
      '\\begin{pmatrix}',
      '1&2\\\\',
      '3&4',
      '\\end{pmatrix}',
      '$$',
    ].join('\n');

    const doc = fromString(input);

    const action = new DeleteAction(doc).prepare();
    action.execute('*');

    expect(doc.getValue()).toBe(expected);
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
      'x^2=2\\\\',
      'y^2=3',
      '',
      '\\end{equation}$$',
    ].join('\n');

    const doc = fromString(input);

    const action = new DeleteAction(doc).prepare();
    action.execute('*');

    expect(doc.getValue()).toBe(expected);
  });
});
