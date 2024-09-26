import React, { useEffect, useState } from "react";

const Toast = ({ message, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true); // 表示/非表示のフラグ

    useEffect(() => {
        // duration時間が経過したらトーストメッセージを非表示にする
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        // クリーンアップ用にタイマーをクリアする
        return () => clearTimeout(timer);
    }, [duration]);

    if (!isVisible) return null; // 非表示の場合は何も表示しない

    return (
        <div className="fixed bottom-4 right-4 bg-gray-500 text-white py-2 px-4 rounded-lg shadow-lg">
            {message}
        </div>
    );
};

export default Toast;
