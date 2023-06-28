import { SearchCursor } from '../src/search';
import { valueAndCursor } from './testHelpers';

describe('SearchCursor', () => {
  describe('findPrevious', () => {
    it('finds last preceding match', () => {
      const input = [
        '$$',
        'x^2',
        '$$',
        '\n',
        '$$',
        '|x + 2 ',
        '\\begin{array}',
        '1&2&3\\\\',
        'x&y&z',
        '\\end{array}',
        '$$',
      ].join('\n');

      const { value } = valueAndCursor(input);
      const cursor = input.indexOf('|');

      const search = new SearchCursor(value, '\\$\\$', cursor);
      const match = search.findPrevious();
      expect(match?.index).toEqual(input.split('|')[0].lastIndexOf('$$'));
    });
  });
});
