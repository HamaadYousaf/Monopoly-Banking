import { User } from "../models/user";

interface RegisterProps {
    onRegisterSuccessful: (user: User) => void;
}

const Register = ({ onRegisterSuccessful }: RegisterProps) => {
    console.log(onRegisterSuccessful);
    return <div>Register</div>;
};

export default Register;
