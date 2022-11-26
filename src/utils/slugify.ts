export const slugify = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/ /g, "-").toLowerCase().replace(/[^\w-]+/g, "");
};

export const uniqueSlugGenerator = (value: string, condition?: boolean | Promise<boolean>): string => {
  let count = 0, newSlug = `${slugify(value)}_${new Date().getTime()}`;
  while (condition) {
    newSlug = `${slugify(value)}_${++count}`;
  }
  return newSlug;
};
