export default function NewsCardSkeleton() {
    return (
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 animate-pulse">
            {/*This is the Image skeleton*/}
            <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>

            {/*This is the Title skeleton*/}
            <div className="h-6 bg-gray-700 rounded mb-3 w-3/4"></div>

            {/*This is the Description skeleton*/}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>

            {/*Metadata skeleton*/}

            <div className="flex justify-between items-center mb-4">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>

            {/*Button skeleton*/}
            <div className="h-10 bg-gray-700 rounded-lg"></div>
        </div>
    );
}
