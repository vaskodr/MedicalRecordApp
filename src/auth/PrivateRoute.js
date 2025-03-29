import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children, authorities }) => {
    const { authData } = useAuth();

// TODO: navigate to error page!

    if (!authData) {
        console.log("Unauthorized!");
        return <Navigate to="/" />
    }

    if (authorities && !authorities.some(authority => authData.authorities.includes(authority))) {
        return <Navigate to="/" />
    }

    return children;
};

export default PrivateRoute;