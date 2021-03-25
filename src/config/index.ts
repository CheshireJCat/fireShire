export const categories: { id: number; name: string }[] = [
  {
    id: 0,
    name: "未分类",
  },
  {
    id: 1,
    name: "life",
  },
  {
    id: 2,
    name: "code",
  },
  {
    id: 3,
    name: "game",
  },
];

export const categoriesMap = (() => {
  let map: Map<number, string> = new Map();
  categories.forEach(({ id, name }: { id: number; name: string }) => {
    map.set(id, name);
  });
  return map;
})();
