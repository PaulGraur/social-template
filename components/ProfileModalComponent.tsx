import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/images/logo.jpg";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  image: string | null;
  username: string;
  avatar: string;
  handleDeleteImage: (image: string) => void;
}

const ProfileModalComponent = ({
  isOpen,
  closeModal,
  image,
  username,
  avatar,
  handleDeleteImage,
}: ModalProps) => {
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const toggleDeleteMenu = () => setShowDeleteMenu((prev) => !prev);

  const handleDeletePost = () => {
    setShowDeleteConfirm(true);
    setShowDeleteMenu(false);
  };

  const confirmDelete = () => {
    if (image) {
      handleDeleteImage(image);
      setShowDeleteConfirm(false);
      closeModal();
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const closeDeleteMenu = () => {
    setShowDeleteMenu(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setShowDeleteMenu(false);
    }
  }, [isOpen]);

  return (
    isOpen && (
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
        onClick={closeModal}
      >
        <button
          onClick={closeModal}
          className="absolute top-0 right-0 p-2 text-white"
        >
          ✕
        </button>

        <div
          className="flex bg-black w-full"
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: "90vh", height: "90vh", width: "1000px" }}
        >
          <div className="relative flex-grow w-[1000px]">
            <Image
              src={image || "/default-avatar.png"}
              alt="Modal Image"
              layout="fill"
              objectFit="cover"
              className="w-[1000px] h-full"
            />
          </div>

          <div className="flex flex-col justify-between text-white w-[65%] py-4 px-8">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex gap-[22px] items-center">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="object-cover w-24 h-24 bg-gray-500 rounded-full"
                />

                <span className="text-lg font-semibold">{username}</span>
              </div>

              <button
                onClick={toggleDeleteMenu}
                className="text-white relative"
              >
                ...
                {showDeleteMenu && (
                  <div
                    className="absolute right-0 bg-gray-700 rounded-md shadow-lg mt-2"
                    onClick={closeDeleteMenu}
                  >
                    <button
                      onClick={handleDeletePost}
                      className="text-red-500 block p-2"
                    >
                      Видалити
                    </button>
                  </div>
                )}
              </button>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLikes((prev) => prev + 1)}
                  className="text-white"
                >
                  ❤️ {likes}
                </button>
                <input
                  type="text"
                  placeholder="Залишити коментар..."
                  value={comment}
                  onChange={handleCommentChange}
                  className="bg-gray-700 text-white p-2 rounded-md mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
            onClick={cancelDelete}
          >
            <div
              className="bg-black p-6 rounded-lg text-white max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold">Видалити пост?</h3>
              <p className="mt-2">Це не можна буде скасувати.</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Видалити
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Скасувати
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default ProfileModalComponent;
