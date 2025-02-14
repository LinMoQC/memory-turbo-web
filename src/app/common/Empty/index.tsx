import React from "react";

interface EmptyProps {
  title?: string;
  description?: string;
  actionText?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyProps> = ({
  title = "暂无数据",
  description = "当前没有可用的数据，请稍后再试。",
  actionText,
  onActionClick,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-gray-50 dark:bg-gray-900 rounded-xl">
      {icon && <div className="mb-4">{icon}</div>}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
