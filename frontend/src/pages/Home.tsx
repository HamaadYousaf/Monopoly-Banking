import { User } from "../models/user";

interface HomeProps {
    loggedInUser: User | null;
}

// eslint-disable-next-line no-empty-pattern
const Home = ({}: HomeProps) => {
    return (
        <div className="flex justify-center mt-20 font-bold text-4xl text-font">
            <div className="text-center">
                <p className="pb-4">Join Room</p>
                <input
                    type="text"
                    placeholder="Room ID"
                    className="input w-full max-w-xs bg-white mb-4 border-solid border-2 border-[#333333] focus:outline-none"
                />
                <button
                    type="submit"
                    className="flex justify-center rounded-md pb-1 bg-blue-500 text-[1.5rem] px-5 font-semibold  text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mx-auto mb-2"
                >
                    Join
                </button>
                <p className="mb-2 text-[1.5rem]">OR</p>
                <button
                    type="submit"
                    className="flex justify-center pb-1 rounded-md bg-blue-500 text-[1.5rem] px-5 text-center font-semibold  text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mx-auto mb-4"
                >
                    Create Room
                </button>
            </div>
        </div>
    );
};

export default Home;
