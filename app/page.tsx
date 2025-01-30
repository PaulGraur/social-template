"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getImagesFromLocalStorage,
  saveImagesToLocalStorage,
} from "@/utils/localStorageUtils";
import Modal from "@/components/ProfileModalComponent";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function InstagramProfile() {
  const [images, setImages] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    username: "montre_d.art_",
    posts: 0,
    followers: 438,
    following: 21,
    name: "Paul",
    avatar: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Оновлюємо кількість дописів залежно від кількості зображень
  useEffect(() => {
    setProfile((prev) => ({ ...prev, posts: images.length }));
  }, [images]);

  // Завантажуємо зображення з localStorage при першому завантаженні
  useEffect(() => {
    const storedImages = getImagesFromLocalStorage();
    if (storedImages) {
      setImages(storedImages);
    }
  }, []);

  // Функція для збереження зображень у localStorage
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

  // Функція для обробки перетягування
  const onDragEnd = (result: any) => {
    const { destination, source } = result;
    if (!destination) return; // Якщо елемент не був відпущений на допустиму зону

    const reorderedImages = Array.from(images);
    const [removed] = reorderedImages.splice(source.index, 1);
    reorderedImages.splice(destination.index, 0, removed);

    setImages(reorderedImages); // Оновлюємо порядок зображень
    saveImagesToLocalStorage(reorderedImages); // Зберігаємо в localStorage
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        {/* Профіль */}
        <div className="flex items-center space-x-4">
          <div
            className="w-20 h-20 bg-gray-500 rounded-full flex-shrink-0"
            style={{
              backgroundImage: `url(${
                profile.avatar || "/default-avatar.png"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div>
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <div className="flex space-x-4 text-gray-400">
              <span>{profile.posts} дописів</span>
              <span>Читає: {profile.followers}</span>
              <span>Стежить: {profile.following}</span>
            </div>
            <p className="mt-2">{profile.name}</p>
          </div>
        </div>

        {/* Вкладки */}
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
            <button className="text-white border-b-2 border-white pb-2">
              Дописи
            </button>
            <button className="text-gray-400 pb-2">Збережено</button>
            <button className="text-gray-400 pb-2">Позначено</button>
          </div>
        </div>

        {/* Контент вкладки */}
        <div className="mt-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images-grid" direction="horizontal">
              {(provided) => (
                <div
                  className="grid grid-cols-3 gap-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {images.map((src, index) => (
                    <Draggable key={index} draggableId={src} index={index}>
                      {(provided) => (
                        <div
                          className="relative h-[270px] w-full"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Image
                            src={src}
                            alt="Uploaded"
                            width={500}
                            height={500}
                            className="rounded-md object-cover h-[270px] w-full cursor-pointer"
                            onClick={() => openModal(src)} // Відкриваємо модальне вікно при кліку
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Модальне вікно */}
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
