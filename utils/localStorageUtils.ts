export const getImagesFromLocalStorage = (): string[] => {
  const savedImages = localStorage.getItem("images");
  return savedImages ? JSON.parse(savedImages) : [];
};

export const saveImagesToLocalStorage = (images: string[]): void => {
  localStorage.setItem("images", JSON.stringify(images));
};
