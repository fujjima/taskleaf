// Setの等価判定
export const eqSet = (as, bs) => {
  if (as.size !== bs.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
};
