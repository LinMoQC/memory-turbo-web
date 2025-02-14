const ReviewSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-dark cursor-pointer p-6 rounded-xl shadow-lg animate-pulse flex justify-between items-center"
        >
          {/* 左侧骨架 */}
          <div className="flex flex-col space-y-2 gap-3">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 w-32 rounded-md" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 w-24 rounded-md" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 w-32 rounded-md" />
              </div>
            </div>
          </div>

          {/* 右侧骨架 */}
          <div className="flex flex-col items-end space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 w-20 rounded-md" />
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-md" />
            </div>

            {/* 如果状态是 PENDING，显示审核按钮骨架 */}
            <div className="flex gap-4 mt-4">
              <div className="h-9 w-20 bg-gray-300 dark:bg-gray-600 rounded-md" />
              <div className="h-9 w-20 bg-gray-300 dark:bg-gray-600 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSkeleton;
