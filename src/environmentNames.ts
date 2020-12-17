const DISPLAY_EQUATIONS = [
  'equation',
  'equation*',
  'gather',
  'gather*',
  'multline',
  'multline*',
  'split',
  'align',
  'align*',
  'flalign',
  'flalign*',
  'alignat',
  'alignat*',
];

const MATRICES = [
  'matrix',
  'pmatrix',
  'bmatrix',
  'Bmatrix',
  'vmatrix',
  'Vmatrix',
  'smallmatrix',
];

const SUB_ENVIRONMENTS = ['multlined', 'gathered', 'aligned', 'cases'];

export const DEFAULT_ENVIRONMENTS = [
  ...DISPLAY_EQUATIONS,
  ...MATRICES,
  ...SUB_ENVIRONMENTS,
];
