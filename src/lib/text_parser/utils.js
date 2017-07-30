
export function makeSimpleTagRegex({ open, close = open }) {
  return new RegExp(`[${open}]([^${close}]+)[${close}]`, 'gi');
}

export default {
  makeSimpleTagRegex
};
