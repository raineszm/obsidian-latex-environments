import { fromString } from './codemirrorHelpers';
import { InsertAction } from '../src/actions/insertAction';
import { ChangeAction } from '../src/actions/changeAction';
import { DeleteAction } from '../src/actions/deleteAction';
import { Action } from '../src/actions/action';
import CodeMirror from 'codemirror';

function testAction (
  input: string,
  expected: string,
  actionFactory: (doc: CodeMirror.Doc) => Action,
  envName = 'equation',
): void {
  const doc = fromString(input);

  const action = actionFactory(doc).prepare();
  action.execute(envName);

  expect(doc.getValue()).toBe(expected);
}

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
    testAction(input, expected, (doc) => new InsertAction(doc));
  });
  it('wraps the selection with an environment', () => {
    const input = '$$|x^2 + 1|$$';
    const expected = [
      '$$\\begin{equation}',
      'x^2 + 1',
      '\\end{equation}$$',
    ].join('\n');

    testAction(input, expected, (doc) => new InsertAction(doc));
  });

  it('adds newlines to separate from adjacent content', () => {
    const input = ['$$', 'x^2 + 1| - 2', '$$'].join('\n');
    const expected = [
      '$$',
      'x^2 + 1',
      '\\begin{equation}',
      '',
      '\\end{equation}',
      ' - 2',
      '$$',
    ].join('\n');
    testAction(input, expected, (doc) => new InsertAction(doc));
  });
  it("doesn't add a newline after when all white space after the curosr", () => {
    const input = ['$$', 'x^2 + 1|', '$$'].join('\n');
    const expected = [
      '$$',
      'x^2 + 1',
      '\\begin{equation}',
      '',
      '\\end{equation}',
      '$$',
    ].join('\n');
    testAction(input, expected, (doc) => new InsertAction(doc));
  });
  it("doesn't add a newline before when all white space before the curosr", () => {
    const input = ['$$', '|x^2 + 1', '$$'].join('\n');
    const expected = [
      '$$',
      '\\begin{equation}',
      '',
      '\\end{equation}',
      'x^2 + 1',
      '$$',
    ].join('\n');
    testAction(input, expected, (doc) => new InsertAction(doc));
  });
  it("doesn't add newlines if insert line is blank", () => {
    const input = ['$$', '|', '$$'].join('\n');
    const expected = [
      '$$',
      '\\begin{equation}',
      '',
      '\\end{equation}',
      '$$',
    ].join('\n');
    testAction(input, expected, (doc) => new InsertAction(doc));
  });
});
describe('ChangeAction', () => {
  it('changes the name of surrounding environment', () => {
    const input = ['$$\\begin{equation}', '|', '\\end{equation}$$'].join('\n');
    const expected = ['$$\\begin{multline}', '', '\\end{multline}$$'].join(
      '\n',
    );
    testAction(input, expected, (doc) => new ChangeAction(doc), 'multline');
  });

  it('when no surrounding environment wraps the whole block', () => {
    const input = '$$|x^2 + 1$$';
    const expected = [
      '$$\\begin{equation}',
      'x^2 + 1',
      '\\end{equation}$$',
    ].join('\n');

    testAction(input, expected, (doc) => new ChangeAction(doc));
  });

  it("doesn't add whitespace when no enclosing environment", () => {
    const input = ['$$', '|x^2 + 1', '$$'].join('\n');
    const expected = [
      '$$\\begin{equation}',
      'x^2 + 1',
      '\\end{equation}$$',
    ].join('\n');

    testAction(input, expected, (doc) => new ChangeAction(doc));
  });
});

describe('DeleteAction', () => {
  it('removes the begin and end of surrounding environment', () => {
    const input = ['$$\\begin{equation}', '|x^2 + 1', '\\end{equation}$$'].join(
      '\n',
    );

    const expected = ['$$', 'x^2 + 1', '$$'].join('\n');
    testAction(input, expected, (doc) => new DeleteAction(doc));
  });

  it('it is a noop for no surrounding environments', () => {
    const input = ['$$', '|x^2 + 1', '$$'].join('\n');
    const expected = input.replace('|', '');

    testAction(input, expected, (doc) => new DeleteAction(doc));
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

    testAction(input, expected, (doc) => new DeleteAction(doc));
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

    testAction(input, expected, (doc) => new DeleteAction(doc));
  });
});
