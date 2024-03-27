import { Room } from "../models/room";
import { User } from "../models/user";

interface GameHomeProps {
    room: Room | null;
    loggedInUser: User | null;
}

const GameHome = ({ room, loggedInUser }: GameHomeProps) => {
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
                        user.username !== loggedInUser?.username
                            ? (view = (
                                  <div key={user.username}>
                                      <div className="card md:w-64 md:h-52 w-54 h-52 bg-white shadow-xl">
                                          <div className="card-body p-0">
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
                                                      className="text-center input w-full max-w-xs bg-white md:h-8 h-10 md:pt-1 pt-0 border-x-0 border-b-0 border-t-[1px] border-solid border-[#BBBBBB] focus:outline-none focus:border-[#BBBBBB] rounded-none"
                                                      onChange={() => {}}
                                                  />
                                                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-0 text-lg w-full rounded-b-2xl">
                                                      Send
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ))
                            : null;
                    }

                    return view;
                })}
                <div className="card md:w-64 md:h-52 w-54 h-52 bg-white shadow-xl">
                    <div className="card-body p-0">
                        <h2 className="card-title justify-center text-2xl mt-8 text-[#333333]">
                            Player 1
                        </h2>

                        <h2 className="text-lg text-[#444444]">$700</h2>

                        <div className="mt-auto">
                            <input
                                type="text"
                                placeholder="$"
                                className="text-center input w-full max-w-xs bg-white md:h-8 h-10 md:pt-1 pt-0 border-x-0 border-b-0 border-t-[1px] border-solid border-[#BBBBBB] focus:outline-none focus:border-[#BBBBBB] rounded-none"
                                onChange={() => {}}
                            />
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-0 text-lg w-full rounded-b-2xl">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="card d:w-64 md:h-52 w-54 h-52 bg-white shadow-xl">
                        <div className="card-body p-0">
                            <h2 className="card-title justify-center text-2xl mt-14 text-[#333333]">
                                Free Parking
                            </h2>
                            <h2 className="text-xl text-[#444444]">
                                ${room?.FreeParking[0].balance}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameHome;
