import { fromString } from './codemirrorHelpers';
import { Environment, MathBlock } from '../src/mathblock';

describe('MathBlock', () => {
  describe('getEnclosingEnvironment', () => {
    it('returns undefined if no enclosing environment', () => {
      const doc = fromString('$$x^2|=2$$');
      const block = new MathBlock(doc, doc.getCursor());
      expect(block.getEnclosingEnvironment(doc.getCursor())).toBeUndefined();
    });

    describe('returns the nearest enclosing environment', () => {
      test('when in the innermost block', () => {
        const doc = fromString(
          `$$\\begin{equation}
        \\begin{gathered}
        x^2|=2\\
        y^2=3
        \\end{gathered}
        \\end{equation}$$`,
        );
        const block = new MathBlock(doc, doc.getCursor());
        const env = block.getEnclosingEnvironment(doc.getCursor());
        expect(env).toBeTruthy();
        expect((env as Environment).name).toBe('gathered');
      });

      test('when in that block contains another', () => {
        const doc = fromString(
          `$$\\begin{equation}|
        \\begin{gathered}
        x^2=2\\
        y^2=3
        \\end{gathered}
        \\end{equation}$$`,
        );
        const block = new MathBlock(doc, doc.getCursor());
        const env = block.getEnclosingEnvironment(doc.getCursor());
        expect(env).toBeTruthy();
        expect((env as Environment).name).toBe('equation');
      });
    });
    describe('errors on unpaired begin or end', () => {
      test('begin only for enclosing environment', () => {
        const doc = fromString(
          `$$\\begin{equation}|
        \\begin{gathered}
        x^2=2\\
        y^2=3
        \\end{gathered}$$`,
        );
        const block = new MathBlock(doc, doc.getCursor());
        expect(() => block.getEnclosingEnvironment(doc.getCursor())).toThrow(
          'closed',
        );
      });

      test('end only for enclosing environment', () => {
        const doc = fromString(
          `$$|
        \\begin{gathered}
        x^2=2\\
        y^2=3
        \\end{gathered}
        \\end{equation}$$`,
        );
        const block = new MathBlock(doc, doc.getCursor());
        expect(() => block.getEnclosingEnvironment(doc.getCursor())).toThrow(
          'closed',
        );
      });

      xtest('begin only for following environment', () => {
        const doc = fromString(
          `$$\\begin{equation}|
        \\begin{gathered}
        x^2=2\\
        y^2=3
        \\end{equation}$$`,
        );
        const block = new MathBlock(doc, doc.getCursor());
        expect(() => block.getEnclosingEnvironment(doc.getCursor())).toThrow(
          'closed',
        );
      });

      xtest('end only for preceeding environment', () => {
        const doc = fromString(
          `$$\\begin{equation}
        x^2=2\\
        y^2=3
        \\end{gathered}
        |
        \\end{equation}$$`,
        );
        const block = new MathBlock(doc, doc.getCursor());
        expect(() => block.getEnclosingEnvironment(doc.getCursor())).toThrow(
          'closed',
        );
      });
    });
  });
});
