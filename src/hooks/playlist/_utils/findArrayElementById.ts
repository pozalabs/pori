import type { ArrayElementType } from '@pozalabs/pokit/types';

type ArrayWithId = { id: string; [key: string]: unknown }[];

type FindArrayElementByIdReturnType<T extends ArrayWithId, F extends boolean> = F extends true
  ? number
  : ArrayElementType<T>;

const findArrayElementById = <T extends ArrayWithId, F extends boolean>({
  array,
  id,
  returnIndex,
}: {
  array: T;
  id: string;
  returnIndex: F;
}): FindArrayElementByIdReturnType<T, F> | undefined => {
  if (array.length <= 0 || !id) return;

  if (returnIndex) {
    return array.findIndex(el => el.id === id) as FindArrayElementByIdReturnType<T, F>;
  }

  return array.find(el => el.id === id) as FindArrayElementByIdReturnType<T, F>;
};

export default findArrayElementById;
