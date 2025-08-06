function build(
  items: any[],
  parentId: number | null = null,
  options: {
    idKey?: string;
    parentKey?: string;
    sortKey?: string;
    childrenKey?: string;
    moreObjects?: ((item: any) => any) | any;
  } = {},
): any[] {
  const {
    idKey = "id",
    parentKey = "parent_id",
    sortKey = "sort",
    childrenKey = "Childs",
    moreObjects = {},
  } = options;

  return items
    .filter((item: any) => item[parentKey] === parentId)
    .sort((a: any, b: any) => (a[sortKey] || 0) - (b[sortKey] || 0))
    .map((item: any) => ({
      ...item,
      ...moreObjects(item),
      [childrenKey]: build(items, item[idKey], options),
    }));
}

function countTreeItem(tree: any[], filter?: (item: any) => boolean): number {
  const filteredTree = filter ? tree.filter(filter) : tree;
  let count = 0;
  for (const item of filteredTree) {
    count += 1;
    if (item.Childs && Array.isArray(item.Childs)) {
      count += countTreeItem(item.Childs, filter);
    }
  }
  return count;
}

function everyTreeItem(
  tree: any[],
  condition: (item: any) => boolean,
  filter?: (item: any) => boolean,
): boolean {
  const filteredTree = filter ? tree.filter(filter) : tree;
  return filteredTree.every(
    (item) =>
      condition(item) &&
      (!item.Childs || everyTreeItem(item.Childs, condition, filter)),
  );
}

const setBooleanAllChilds = (
  tree: any[],
  field: string,
  condition: (item: any) => boolean,
  filter?: (item: any) => boolean,
) => {
  const newValue = !everyTreeItem(tree, condition, filter);
  const setChilds = (items: any[]) => {
    for (const item of items) {
      (item as any)[field] = newValue;
      if (item.Childs && item.Childs.length > 0) {
        setChilds(item.Childs);
      }
    }
  };
  setChilds(tree);
};

export const tree = {
  build,
  everyTreeItem,
  setBooleanAllChilds,
  countTreeItem,
};
