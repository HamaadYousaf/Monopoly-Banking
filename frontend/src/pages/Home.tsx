import { User } from "../models/user";

interface HomeProps {
    loggedInUser: User | null;
}

const Home = ({ loggedInUser }: HomeProps) => {
    console.log(loggedInUser);
    return <div>Home</div>;
};

export default Home;
