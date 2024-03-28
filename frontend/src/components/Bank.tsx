import { useState } from "react";
import { Room } from "../models/room";
import { User } from "../models/user";

interface BankProps {
    room: Room | null;
    loggedInUser: User | null;
}

const Bank = ({ room, loggedInUser }: BankProps) => {
    const [amount, setAmount] = useState("");

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        console.log(amount);
        setAmount("");
    };

    return (
        <>
            <h1 className="text-xl pb-4">Send Money</h1>
            <div className="flex justify-between bg-white rounded-xl md:max-w-full max-w-xs">
                <div>
                    <select className="select w-full max-w-xs mb-1 md:pr-40 text-lg focus:outline-none border-non focus:border-none ml-1">
                        {room?.users.map(
                            (user) =>
                                user.username !== loggedInUser?.username && (
                                    <option key={user.username}>
                                        {user.username}
                                    </option>
                                )
                        )}
                    </select>
                </div>
                <div className="flex justify-end w-1/2">
                    <input
                        type="text"
                        placeholder="$"
                        value={amount}
                        className="text-center input w-full max-w-xs bg-white min-h-full border-none focus:outline-none focus:border-[#BBBBBB] rounded-none"
                        onChange={(e) => {
                            setAmount(e.target.value);
                        }}
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 md:px-4 px-0 m-0 text-lg w-full rounded-e-2xl"
                        onClick={handleClick}
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
};

export default Bank;
