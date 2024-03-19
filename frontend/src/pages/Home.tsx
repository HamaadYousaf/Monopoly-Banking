import { User } from "../models/user";

interface HomeProps {
    loggedInUser: User | null;
}

const Home = ({ loggedInUser }: HomeProps) => {
    return <div>Home</div>;
};

export default Home;
