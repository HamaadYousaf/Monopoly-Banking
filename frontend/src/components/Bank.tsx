import { useState } from "react";
import { Room } from "../models/room";
import { User } from "../models/user";
import * as BankApi from "../api/bankApi";
import { ConflictError, BadRequestError } from "../utils/http_errors";

interface BankProps {
    room: Room | null;
    loggedInUser: User | null;
}

const Bank = ({ room, loggedInUser }: BankProps) => {
    const [amountString, setAmountString] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const amount = parseInt(amountString);
        const roomId = room?.id;

        try {
            if (roomId && loggedInUser) {
                await BankApi.deposit({
                    loggedInUser,
                    username,
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
            } else {
                alert(error);
            }
        }
    };

    return (
        <>
            <h1 className="text-xl pb-4">Deposit Money</h1>
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
                    <input
                        type="text"
                        placeholder="$"
                        value={amountString}
                        className="text-center input w-full max-w-xs bg-white min-h-full border-l-1 border-[#BBBBBB] border-y-0 border-r-0  focus:outline-none focus:border-[#BBBBBB] rounded-none text-lg "
                        onChange={(e) => {
                            setAmountString(e.target.value);
                        }}
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 md:px-2 px-0 m-0 text-lg w-full rounded-e-2xl"
                        onClick={() => {
                            if (document && amountString && username) {
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
            {username && amountString && (
                <dialog
                    id="my_modal_1"
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box bg-white text-2xl md:w-fit md:pb-0 pb-10">
                        <p className="py-4">
                            {`Confirm deposit of ${amountString} to ${username}`}
                        </p>
                        <div className="modal-action justify-center">
                            <button
                                className="btn mr-8 bg-green-500 font-bold hover:bg-green-700"
                                onClick={(e) => handleClick(e)}
                            >
                                Confirm
                            </button>
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
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

export default Bank;
