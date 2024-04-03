import { useState } from "react";
import * as RoomApi from "../api/roomApi";
import { Room } from "../models/room";
import { User } from "../models/user";
import { BadRequestError, ConflictError } from "../utils/http_errors";

interface SetBankerProps {
    loggedInUser: User;
    room: Room;
    setRoom: (room: Room) => void;
}

const SetBanker = ({ loggedInUser, room, setRoom }: SetBankerProps) => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const roomId = room?.id;

        try {
            if (roomId && loggedInUser) {
                const fetchRoom = await RoomApi.setBanker({
                    loggedInUser,
                    username,
                    roomId,
                });
                setRoom(fetchRoom);
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
            <h1 className="text-xl pb-4">Set New Banker</h1>
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
                        {room?.users.map(
                            (user) =>
                                user.username !== loggedInUser?.username && (
                                    <option
                                        key={user.username}
                                        value={user.username}
                                    >
                                        {user.username}
                                    </option>
                                )
                        )}
                    </select>
                </div>
                <div className="flex justify-end w-1/2">
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
                        Set Banker
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
                            {`Set ${username} as the new Banker?`}
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

export default SetBanker;
