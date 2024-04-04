import { useState } from "react";
import * as BankApi from "../api/bankApi";
import { Room } from "../models/room";
import { User } from "../models/user";
import { BadRequestError, ConflictError } from "../utils/http_errors";

interface PlayerProps {
    loggedInUser: User;
    user: User;
    room: Room;
}
const Player = ({ loggedInUser, user, room }: PlayerProps) => {
    const [amountString, setAmountString] = useState("");
    const [error, setError] = useState("");

    const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        try {
            const amount = parseInt(amountString);
            const roomId = room?.id;
            const usernameReceive = user.username;

            if (roomId && loggedInUser) {
                await BankApi.transfer({
                    loggedInUser,
                    usernameReceive,
                    roomId,
                    amount,
                });
            }
            setAmountString("");
            setError("");
        } catch (error) {
            if (
                error instanceof ConflictError ||
                error instanceof BadRequestError
            ) {
                setError(error.message.replace(/["']/g, ""));
                (
                    document.getElementById("my_modal_1") as HTMLFormElement
                ).close();
            } else {
                (
                    document.getElementById("my_modal_1") as HTMLFormElement
                ).close();
                alert(error);
            }
        }
    };

    return (
        <>
            <div>
                <div className="card md:w-64 md:h-52 w-54 h-52 bg-white shadow-xl">
                    <div className="card-body p-0">
                        {error && (
                            <p className="text-base text-red-500 text-left ml-2">
                                *{error}
                            </p>
                        )}
                        <h2 className="card-title justify-center text-2xl mt-8 text-[#333333]">
                            {user.username}
                        </h2>
                        {user.Bank && (
                            <h2 className="text-lg text-[#444444]">
                                ${user.Bank[0].balance}
                            </h2>
                        )}
                        <div className="mt-auto">
                            <input
                                type="text"
                                placeholder="$"
                                value={amountString}
                                className="text-center input w-full max-w-xs bg-white md:h-8 h-10 md:pt-1 pt-0 border-x-0 border-b-0 border-t-[1px] border-solid border-[#BBBBBB] focus:outline-none focus:border-[#BBBBBB] rounded-none text-lg"
                                onChange={(e) => {
                                    setAmountString(e.target.value);
                                }}
                            />
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-0 text-lg w-full rounded-b-2xl"
                                onClick={() => {
                                    if (
                                        document &&
                                        amountString &&
                                        user.username
                                    ) {
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
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {user.username && amountString && (
                <dialog
                    id="my_modal_1"
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box bg-white text-2xl md:w-fit pb-10">
                        <p className="py-4">
                            {`Confirm transfer of ${amountString} to ${user.username}`}
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

export default Player;
