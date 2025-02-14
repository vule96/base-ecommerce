type ReplaceUndefinedWithNull<T> = T extends undefined ? null : T;
export type ToNullProps<T> = {
  [P in keyof T]-?: ReplaceUndefinedWithNull<T[P]>;
};
