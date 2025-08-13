import { PROMPTS } from './prompts';

/**
 * Map prompt indices (0-based) into themed pools.
 * You can tweak these lists anytime — they just pick from PROMPTS.
 */
const BelongingIdx = [0, 9, 14, 15, 20, 21, 23, 24, 25, 26, 29];
const BiasIdx       = [1, 8, 10, 11, 16, 18, 27];
const VisibilityIdx = [2, 3, 6, 12, 13, 19, 22, 28];
const InclusionIdx  = [4, 5, 7, 17];
const AdvocacyIdx   = [3, 19, 20, 24, 26, 27, 28];

function pick(indices) {
  return indices.map(i => PROMPTS[i]).filter(Boolean);
}

export const THEME_MAP = {
  All: PROMPTS,
  Belonging: pick(BelongingIdx),
  Bias: pick(BiasIdx),
  Visibility: pick(VisibilityIdx),
  Inclusion: pick(InclusionIdx),
  Advocacy: pick(AdvocacyIdx),
};