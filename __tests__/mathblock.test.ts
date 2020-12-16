import { fromString } from './codemirrorHelpers';
import { MathBlock } from '../src/mathblock';
import { Environment } from '../src/environment';

describe('MathBlock', () => {
  describe('getEnclosingEnvironment', () => {
    describe('when no enclosing environment', () => {
      it('returns undefined', () => {
        const doc = fromString('$$x^2|=2$$');
        const block = new MathBlock(doc, doc.getCursor());
        expect(block.getEnclosingEnvironment(doc.getCursor())).toBeUndefined();
      });

      it('returns undefined when after a top level environment', () => {
        const doc = fromString(
          [
            '$$',
            'x^2 + 1',
            '= \\begin{pmatrix}',
            '1 & 0',
            '\\end{pmatrix}',
            '| - 3',
            '$$',
          ].join('\n'),
        );
        const block = new MathBlock(doc, doc.getCursor());
        expect(() => {
          const actual = block.getEnclosingEnvironment(doc.getCursor());
          expect(actual).toBeUndefined();
        }).not.toThrow();
      });

      it('returns undefined when before a top level environment', () => {
        const doc = fromString(
          [
            '$$',
            'x^2 + 1|',
            '= \\begin{pmatrix}',
            '1 & 0',
            '\\end{pmatrix}',
            '- 3',
            '$$',
          ].join('\n'),
        );
        const block = new MathBlock(doc, doc.getCursor());
        expect(() => {
          const actual = block.getEnclosingEnvironment(doc.getCursor());
          expect(actual).toBeUndefined();
        }).not.toThrow();
      });
    });

    describe('returns the nearest enclosing environment', () => {
      test('when in the innermost block', () => {
        const doc = fromString(
          [
            '$$\\begin{equation}',
            '\\begin{gathered}',
            'x^2|=2\\\\',
            'y^2=3',
            '\\end{gathered}',
            '\\end{equation}$$',
          ].join('\n'),
        );
        const block = new MathBlock(doc, doc.getCursor());
        const env = block.getEnclosingEnvironment(doc.getCursor());
        expect(env).toBeTruthy();
        expect((env as Environment).name).toBe('gathered');
      });

      test('when in block that contains another', () => {
        const doc = fromString(
          [
            '$$\\begin{equation}|',
            '\\begin{gathered}',
            'x^2=2\\\\',
            'y^2=3',
            '\\end{gathered}',
            '\\end{equation}$$',
          ].join('\n'),
        );
        const block = new MathBlock(doc, doc.getCursor());
        const env = block.getEnclosingEnvironment(doc.getCursor());
        expect(env).toBeTruthy();
        expect((env as Environment).name).toBe('equation');
      });
    });
    test('returns matching begin and end', () => {
      const doc = fromString(
        [
          '$$\\begin{equation}|',
          '\\begin{gathered}',
          'x^2=2\\\\',
          'y^2=3',
          '\\end{gathered}',
          '\\end{equation}$$',
        ].join('\n'),
      );
      const block = new MathBlock(doc, doc.getCursor());
      const env = block.getEnclosingEnvironment(doc.getCursor());
      expect(env).toBeTruthy();
      if (env !== undefined) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(doc.getRange(env.start.from, env.start.to)).toBe(
          '\\begin{equation}',
        );
        // eslint-disable-next-line jest/no-conditional-expect
        expect(doc.getRange(env.end.from, env.end.to)).toBe('\\end{equation}');
      }
    });
    describe('errors on unpaired begin or end', () => {
      test('begin only for enclosing environment', () => {
        const doc = fromString(
          [
            '$$\\begin{equation}|',
            '\\begin{gathered}',
            ' x^2=2\\\\',
            'y^2=3',
            '\\end{gathered}$$',
          ].join('\n'),
        );
        const block = new MathBlock(doc, doc.getCursor());
        expect(() => block.getEnclosingEnvironment(doc.getCursor())).toThrow(
          'closed',
        );
      });

      test('end only for enclosing environment', () => {
        const doc = fromString(
          [
            '$$|',
            '\\begin{gathered}',
            'x^2=2\\\\',
            'y^2=3',
            '\\end{gathered}',
            '\\end{equation}$$',
          ].join('\n'),
        );
        const block = new MathBlock(doc, doc.getCursor());
        expect(() => block.getEnclosingEnvironment(doc.getCursor())).toThrow(
          'closing',
        );
      });

      test('begin only for following environment', () => {
        const doc = fromString(
          [
            '$$\\begin{equation}|',
            '\\begin{gathered}',
            'x^2=2\\\\',
            'y^2=3',
            '\\end{equation}$$',
          ].join('\n'),
        );
        const block = new MathBlock(doc, doc.getCursor());
        expect(() => block.getEnclosingEnvironment(doc.getCursor())).toThrow(
          'closed',
        );
      });

      test('end only for preceding environment', () => {
        const doc = fromString(
          [
            '$$\\begin{equation}',
            'x^2=2\\\\',
            'y^2=3',
            '\\end{gathered}',
            '|',
            '\\end{equation}$$',
          ].join('\n'),
        );
        const block = new MathBlock(doc, doc.getCursor());
        expect(() => block.getEnclosingEnvironment(doc.getCursor())).toThrow(
          'closed',
        );
      });
    });
  });
});
