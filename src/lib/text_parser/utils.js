
export function makeSimpleTagRegex(open, close = open) {
  return new RegExp(`[${open}]([^${close}]+)[${close}]`, 'g');
}

export default {
  makeSimpleTagRegex
};
