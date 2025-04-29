export function LoadingSkeleton() {
    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex flex-col gap-4">
                <div className="h-12 bg-gray-200 rounded-full w-12 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
        </div>
    );
}