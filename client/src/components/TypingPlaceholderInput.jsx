import { useState, useEffect } from "react";

const TypingPlaceholderInput = ({ keyword, setKeyword }) => {
  const fullText = "Nhập món ăn vặt cần tìm...";
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  // Nhấp nháy con trỏ |
  useEffect(() => {
    if (isFocused || keyword) return; // Dừng nếu focus hoặc đã nhập
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, [isFocused, keyword]);

  // Gõ và xóa chữ
  useEffect(() => {
    if (isPaused || isFocused || keyword) return; // Dừng nếu đang focus hoặc đã nhập

    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const nextText = fullText.slice(0, index + 1);
        setPlaceholder(nextText);
        setIndex(index + 1);

        if (index + 1 === fullText.length) {
          setIsPaused(true);
          setTimeout(() => setIsDeleting(true), 2000);
          setTimeout(() => setIsPaused(false), 2000);
        }
      } else {
        const nextText = fullText.slice(0, index - 1);
        setPlaceholder(nextText);
        setIndex(index - 1);

        if (index - 1 === 0) {
          setIsPaused(true);
          setTimeout(() => setIsDeleting(false), 2000);
          setTimeout(() => setIsPaused(false), 2000);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting, isPaused, isFocused, keyword]);

  return (
    <input
      type="text"
      placeholder={
        isFocused || keyword ? "" : placeholder + (showCursor ? "|" : "")
      }
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        if (!keyword) {
          setIndex(0);
          setIsDeleting(false);
        }
      }}
      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
    />
  );
};

export default TypingPlaceholderInput;
