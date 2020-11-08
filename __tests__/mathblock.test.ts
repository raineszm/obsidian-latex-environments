import { fromString } from './codemirrorHelpers';
import { MathBlock } from '../src/mathblock';

describe('MathBlock', () => {
  describe('getEnclosingEnvironment', () => {
    it('returns undefined if no enclosing environment', () => {
      const doc = fromString('$$x^2|=2$$');
      const block = new MathBlock(doc, doc.getCursor());
      expect(block.getEnclosingEnvironment(doc.getCursor())).toBeUndefined();
    });
  });
});
