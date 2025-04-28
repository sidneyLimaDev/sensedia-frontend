import { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    const backgroundColor = type === "success" ? "bg-green-500" : "bg-red-500";

    return (
        <div
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 ${backgroundColor} text-white p-4 rounded-md shadow-lg`}
        >
            {message}
        </div>
    );
}
