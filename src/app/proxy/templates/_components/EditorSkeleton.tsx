const EditorSkeleton = () => {
    return <div className="animate-pulse p-4">

        <div className="flex gap-6">
            <div className="w-64 space-y-4">
                <div className="flex gap-4 mb-6">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 h-[90vh] bg-gray-50 p-4 rounded-lg">
                <div className="mb-6 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>

                <div className="bg-white p-4 rounded shadow-sm mb-4">
                    <div className="flex gap-4 mb-4">
                        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow-sm">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            <div className="w-72 bg-white p-4 rounded-lg shadow-sm">
                <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="border-t pt-4 space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default EditorSkeleton