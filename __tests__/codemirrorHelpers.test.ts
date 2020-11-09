import { fromString } from './codemirrorHelpers';

describe('CodeMirror helpers', () => {
  describe('fromString', () => {
    it('sets the cursor position', () => {
      const doc = fromString('$|$');
      expect(doc.getCursor()).toStrictEqual(
        expect.objectContaining({ line: 0, ch: 1 }),
      );
    });
    it('removes the cursor placeholder', () => {
      const doc = fromString('$|$');
      expect(doc.getValue()).toBe('$$');
    });
    it('sets the document text', () => {
      const input = [
        '# Header',
        '',
        'This is some text with inline math $x$.',
        '',
        'The cursor is |here. And then we have a mathblock',
        '$$\\begin{equation}',
        'x^2 + 2 = 4',
        '\\end{equation}$$',
      ].join('\n');
      const doc = fromString(input);
      const expected = input.replace('|', '');
      expect(doc.getValue()).toBe(expected);
    });

    it('sets the selection', () => {
      const lines = [
        '# Header',
        '',
        'This is |some text with inline math $x$.',
        '',
        'This is selected |here. And then we have a mathblock',
        '$$\\begin{equation}',
        'x^2 + 2 = 4',
        '\\end{equation}$$',
      ];
      const input = lines.join('\n');
      const doc = fromString(input);
      const expectedFrom = expect.objectContaining({
        line: 2,
        ch: lines[2].indexOf('|'),
      });
      const expectedTo = expect.objectContaining({
        line: 4,
        ch: lines[4].indexOf('|'),
      });
      expect(doc.somethingSelected()).toBeTruthy();
      expect(doc.getCursor('from')).toStrictEqual(expectedFrom);
      expect(doc.getCursor('to')).toStrictEqual(expectedTo);
    });
  });
});
