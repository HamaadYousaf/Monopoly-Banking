import { Room } from "../models/room";
import { User } from "../models/user";
import Claim from "./Claim";
import Deposit from "./Deposit";
import SetBanker from "./SetBanker";

interface BankProps {
    room: Room | null;
    loggedInUser: User | null;
    setRoom: (room: Room) => void;
}

const Bank = ({ room, loggedInUser, setRoom }: BankProps) => {
    return (
        <>
            {loggedInUser && room && (
                <>
                    <Deposit loggedInUser={loggedInUser} room={room} />
                    <div className="py-5"></div>
                    <Claim loggedInUser={loggedInUser} room={room} />
                    <div className="py-5"></div>
                    <SetBanker
                        loggedInUser={loggedInUser}
                        room={room}
                        setRoom={setRoom}
                    />
                </>
            )}
        </>
    );
};

export default Bank;
