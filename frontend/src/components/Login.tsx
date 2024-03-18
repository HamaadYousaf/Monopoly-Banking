import { User } from "../models/user";

interface LoginProps {
    onDismiss: () => void;
    onLoginSuccessful: (user: User) => void;
}

const Login = ({ onDismiss, onLoginSuccessful }: LoginProps) => {
    console.log(onDismiss);
    console.log(onLoginSuccessful);
    return <div>Log In</div>;
};

export default Login;
