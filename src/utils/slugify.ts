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
export const randomString = (value: string, length: number): string => {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    value += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return value;
};
