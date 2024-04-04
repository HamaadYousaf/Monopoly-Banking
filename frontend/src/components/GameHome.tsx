import { useState } from "react";
import * as BankApi from "../api/bankApi";
import { Room } from "../models/room";
import { User } from "../models/user";
import { BadRequestError, ConflictError } from "../utils/http_errors";
import Player from "./Player";

interface GameHomeProps {
    room: Room | null;
    loggedInUser: User | null;
}

const GameHome = ({ room, loggedInUser }: GameHomeProps) => {
    const [amountString, setAmountString] = useState("");
    const [error, setError] = useState("");

    const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        try {
            const amount = parseInt(amountString);
            const roomId = room?.id;

            if (roomId && loggedInUser) {
                await BankApi.sendFreeParking({
                    loggedInUser,
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
            <p className="md:text-[1.5rem] text-[1.4rem]">
                Room ID: {room?.id}
            </p>
            <p className="md:text-[1.5rem] text-[1.4rem]">
                Banker: {room?.banker}
            </p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-32 gap-10 mt-10 mb-10">
                <div key={loggedInUser?.username}>
                    <div className="card md:w-64 md:h-52 w-54 h-52 bg-white shadow-xl">
                        <div className="card-body p-0">
                            <h2 className="card-title justify-center text-2xl mt-14 text-[#333333]">
                                {loggedInUser?.username}
                            </h2>
                            {room?.users.map((user) => {
                                let view;
                                {
                                    user.username === loggedInUser?.username
                                        ? user.Bank &&
                                          (view = (
                                              <h2
                                                  className="text-xl text-[#444444]"
                                                  key={user.username}
                                              >
                                                  ${user.Bank[0].balance}
                                              </h2>
                                          ))
                                        : null;
                                }

                                return view;
                            })}
                        </div>
                    </div>
                </div>
                {room?.users.map((user) => {
                    let view;
                    {
                        user.username !== loggedInUser?.username && loggedInUser
                            ? (view = (
                                  <Player
                                      key={user.username}
                                      loggedInUser={loggedInUser}
                                      user={user}
                                      room={room}
                                  />
                              ))
                            : null;
                    }

                    return view;
                })}
                <div>
                    <div className="card md:w-64 md:h-52 w-54 h-52 bg-white shadow-xl">
                        <div className="card-body p-0">
                            {error && (
                                <p className="text-base text-red-500 text-left ml-2">
                                    *{error}
                                </p>
                            )}
                            <h2 className="card-title justify-center text-2xl mt-8 text-[#333333]">
                                Free Parking
                            </h2>
                            <h2 className="text-lg text-[#444444]">
                                ${room?.FreeParking[0].balance}
                            </h2>
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
                                        if (document && amountString) {
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
            </div>
            {amountString && (
                <dialog
                    id="my_modal_1"
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box bg-white text-2xl md:w-fit pb-10">
                        <p className="py-4">
                            {`Confirm transfer of ${amountString} to Free Parking`}
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

export default GameHome;
