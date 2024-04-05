import { useState } from "react";
import * as BankApi from "../api/bankApi";
import { Room } from "../models/room";
import { User } from "../models/user";
import { BadRequestError, ConflictError } from "../utils/http_errors";

interface ClaimProps {
    loggedInUser: User;
    room: Room;
}

const Claim = ({ loggedInUser, room }: ClaimProps) => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const roomId = room?.id;

        try {
            if (roomId && loggedInUser) {
                await BankApi.claimFreeParking({
                    loggedInUser,
                    username,
                    roomId,
                });
            }
            (document.getElementById("my_modal_1") as HTMLFormElement).close();
            setError("");
        } catch (error) {
            if (
                error instanceof ConflictError ||
                error instanceof BadRequestError
            ) {
                setError(error.message.replace(/["']/g, ""));
            } else {
                alert(error);
            }
        }
    };

    return (
        <>
            <h1 className="text-xl pb-4">Claim Free Parking</h1>
            {error && (
                <p className="text-base text-red-500 text-left ml-2">
                    *{error}
                </p>
            )}
            <div className="flex justify-between bg-white rounded-xl md:max-w-full max-w-xs">
                <div>
                    <select
                        className="select w-full max-w-xs mb-1 md:pr-40 text-lg focus:outline-none border-non focus:border-none ml-1"
                        onChange={(e) => setUsername(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Player
                        </option>
                        {room?.users.map((user) => (
                            <option key={user.username} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end w-1/2">
                    <h1 className="text-center input w-full max-w-xs bg-white min-h-full border-l-1 border-[#BBBBBB] border-y-0 border-r-0 pt-[0.85rem] focus:outline-none focus:border-[#BBBBBB] rounded-none text-lg ">
                        {room.FreeParking[0].balance}
                    </h1>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 md:px-2 px-0 m-0 text-lg w-full rounded-e-2xl"
                        onClick={() => {
                            if (document && username) {
                                (
                                    document.getElementById(
                                        "my_modal_1"
                                    ) as HTMLFormElement
                                ).showModal();
                            } else {
                                setError("Missing parameters");
                            }
                        }}
                    >
                        Claim
                    </button>
                </div>
            </div>
            {username && (
                <dialog
                    id="my_modal_1"
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box bg-white text-2xl md:w-fit pb-10">
                        <p className="py-4">
                            {`Confirm claim of ${room.FreeParking[0].balance} to ${username}`}
                        </p>
                        <div className="modal-action justify-center">
                            <button
                                className="btn mr-8 bg-green-500 font-bold hover:bg-green-700"
                                onClick={(e) => handleClick(e)}
                            >
                                Confirm
                            </button>
                            <form method="dialog">
                                <button className="btn ml-8 bg-red-500 font-bold hover:bg-red-700">
                                    Close
                                </button>
                            </form>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
};

export default Claim;
