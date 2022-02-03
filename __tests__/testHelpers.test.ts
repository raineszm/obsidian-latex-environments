import { fromString } from './testHelpers';

describe('test helpers', () => {
  describe('fromString', () => {
    it('sets the cursor position', () => {
      const doc = fromString('$|$');
      expect(doc.cursor).toBe(1);
    });
    it('removes the cursor placeholder', () => {
      const doc = fromString('$|$');
      expect(doc.text).toBe('$$');
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
      expect(doc.text).toBe(expected);
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
      const expectedFrom = input.indexOf('|');
      const expectedTo = input.lastIndexOf('|') - 1;
      // expect(doc.somethingSelected()).toBeTruthy();
      expect(doc.selection.from).toStrictEqual(expectedFrom);
      expect(doc.selection.to).toStrictEqual(expectedTo);
    });
  });
});
