function Loading({text}){
    return(
        <div className="flex-col gap-4 pt-4 w-full flex items-center justify-center">
        <div
            className="w-10 h-10 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
        >
            <div
            className="w-8 h-8 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
            ></div>
        </div>
        <div className="flex flex-row">
         {text}
        <div className="flex flex-row gap-1 items-end p-1">
        <div className="w-[3px] h-[3px] rounded-full bg-black animate-pulse [animation-delay:.1s]"></div>
        <div className="w-[3px] h-[3px] rounded-full bg-black animate-pulse [animation-delay:.3s]"></div>
        <div className="w-[3px] h-[3px] rounded-full bg-black animate-pulse [animation-delay:.5s]"></div>
        </div>
        </div>
        </div>
    )
}

export {Loading}