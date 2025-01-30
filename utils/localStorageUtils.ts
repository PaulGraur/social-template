export const getImagesFromLocalStorage = (): string[] => {
  const storedImages = localStorage.getItem("images");
  return storedImages ? JSON.parse(storedImages) : [];
};

export const saveImagesToLocalStorage = (images: string[]): void => {
  localStorage.setItem("images", JSON.stringify(images));
};
