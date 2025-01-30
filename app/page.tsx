"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getImagesFromLocalStorage,
  saveImagesToLocalStorage,
} from "@/utils/localStorageUtils";
import Modal from "@/components/ProfileModalComponent";
import Logo from "@/images/logo.jpg";

export default function InstagramProfile() {
  const [images, setImages] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    username: "montre_d.art_",
    posts: 0,
    followers: 54738,
    following: 1,
    name: "Montre d'Art",
    avatar: "",
    characteristics: [
      "✨ Вишукані годинники для стильних моментів.",
      "⌚️ Елегантність і якість.",
      "📦 Доставка по Україні.",
      "💬 Пишіть у Direct для замовлення!",
    ],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    setProfile((prev) => ({ ...prev, posts: images.length }));
  }, [images]);

  useEffect(() => {
    const storedImages = getImagesFromLocalStorage();
    if (storedImages) {
      setImages(storedImages);
    }
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      saveImagesToLocalStorage(images);
    }
  }, [images]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));

    setImages((prev: string[]) => [...prev, ...newImages]);
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleDeleteImage = (image: string) => {
    const updatedImages = images.filter((img) => img !== image);
    setImages(updatedImages);
    saveImagesToLocalStorage(updatedImages);
    closeModal();
  };

  const handleDeleteAllImages = () => {
    setImages([]);
    saveImagesToLocalStorage([]);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedIndex(index);
    const target = event.target as HTMLElement;
    target.classList.add("scale-105");

    event.dataTransfer.setData("imageIndex", index.toString());
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    target.classList.remove("scale-105");
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    event.preventDefault();

    const draggedIndex = parseInt(event.dataTransfer.getData("imageIndex"));

    if (draggedIndex === targetIndex) return;

    const updatedImages = [...images];

    const [draggedImage] = updatedImages.splice(draggedIndex, 1);

    updatedImages.splice(targetIndex, 0, draggedImage);

    setImages(updatedImages);
    saveImagesToLocalStorage(updatedImages);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      } min-h-screen transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto p-4">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 bg-gray-700 text-white rounded-full"
        >
          {darkMode ? (
            <span className="material-icons">Light</span>
          ) : (
            <span className="material-icons">Dark</span>
          )}
        </button>

        <div className="p-10 flex items-center space-x-4">
          <Image
            src={profile.avatar || Logo}
            alt="Logo"
            className="object-cover w-44 h-44 bg-gray-500 rounded-full mr-[44px]"
          />

          <div>
            <h2 className="text-2xl font-bold mb-[24px]">{profile.username}</h2>
            <div className="flex space-x-4">
              <span className="text-sm text-gray-400">
                {profile.posts} дописів
              </span>
              <span className="text-sm text-gray-400">
                Читає: {profile.followers}
              </span>
              <span className="text-sm text-gray-400">
                Стежить: {profile.following}
              </span>
            </div>
            <p className="mt-2 text-lg">{profile.name}</p>
            <ul className="mt-4 text-sm">
              {profile.characteristics.map((item, index) => (
                <li key={index} className="mb-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-700">
          <div className="flex justify-center my-4">
            <label
              htmlFor="file-upload"
              className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-full border border-gray-500 cursor-pointer hover:bg-gray-600 transition"
            >
              <span className="material-icons text-4xl text-white">+</span>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="flex justify-center space-x-8 mt-4 text-sm">
            <button
              className={`${
                darkMode
                  ? "text-white border-b-2 border-white"
                  : "text-black border-b-2 border-black"
              } pb-2`}
            >
              Дописи
            </button>
            <button
              className={`${darkMode ? "text-gray-400" : "text-gray-800"} pb-2`}
            >
              Збережено
            </button>
            <button
              className={`${darkMode ? "text-gray-400" : "text-gray-800"} pb-2`}
            >
              Позначено
            </button>
          </div>

          {images.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleDeleteAllImages}
                className="text-red-500 hover:text-red-300"
              >
                Видалити всі пости
              </button>
            </div>
          )}
        </div>

        <div className="mt-6">
          {images.length === 0 ? (
            <p className="text-center text-[36px] font-bold">
              Ще немає дописів
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {images.map((src, index) => (
                <div
                  key={index}
                  className="relative h-[270px] w-full cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <Image
                    src={src}
                    alt="Uploaded"
                    width={500}
                    height={500}
                    className="object-cover h-[270px] w-full"
                    onClick={() => openModal(src)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        image={selectedImage}
        username={profile.username}
        avatar={profile.avatar}
        handleDeleteImage={handleDeleteImage}
      />
    </div>
  );
}
