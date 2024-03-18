import { User } from "../models/user";

interface RegisterProps {
    onDismiss: () => void;
    onRegisterSuccessful: (user: User) => void;
}

const Register = ({ onDismiss, onRegisterSuccessful }: RegisterProps) => {
    console.log(onDismiss);
    console.log(onRegisterSuccessful);
    return <div>Register</div>;
};

export default Register;
