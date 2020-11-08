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
      const template = `# Header
      
      This is some text with inline math $x$.
      
      The cursor is |here. And then we have a mathblock
      $$\\begin{equation}
      x^2 + 2 = 4
      \\end{equation}$$`;
      const doc = fromString(template);
      const expected = template.replace('|', '');
      expect(doc.getValue()).toBe(expected);
    });
  });
});
