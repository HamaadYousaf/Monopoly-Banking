const Loading = () => {
    return (
        <>
            <div className="navbar bg-white shadow-md">
                <div className="navbar-start">
                    <a className="btn btn-ghost md:text-xl text-base sm:text-lg md:pl-4 pl-2">
                        Monopoly Banking
                    </a>
                </div>
                <div className="navbar-end">
                    <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 md:mr-4 text-sm md:text-base w-24 text-center">
                        <span className="loading loading-ring loading-sm"></span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center pt-60">
                <span className="loading loading-spinner loading-lg bg-[#333333]"></span>
            </div>
        </>
    );
};

export default Loading;
