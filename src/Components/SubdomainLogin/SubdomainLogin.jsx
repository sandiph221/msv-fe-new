import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoadLogoAndBanner } from "../../store/actions/SettingActions";
import { getSubDomain } from "utils/functions.js";
import Spinner from "../../Components/Spinner";

const SubdomainLogin = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const code = searchParams.get('code');
    const subDomain = getSubDomain();

    useEffect(() => {
        const handleSubdomainLogin = async () => {
            if (code) {
                try {
                    // Parse the response data
                    const responseData = JSON.parse(decodeURIComponent(code));

                    if (responseData.status && responseData.data) {
                        // Store user info in localStorage
                        localStorage.setItem("userInfo", JSON.stringify(responseData.data));

                        // Update Redux state
                        dispatch({
                            type: "SIGNIN",
                            payload: responseData.data,
                        });

                        // Load settings immediately after login
                        if (subDomain) {
                            await dispatch(LoadLogoAndBanner(subDomain));
                        }

                        // Navigate to appropriate route
                        if (responseData.data.user && responseData.data.user.role === "super-admin") {
                            navigate("/admin/dashboard");
                        } else {
                            navigate("/user");
                        }
                    } else {
                        navigate("/login");
                    }
                } catch (error) {
                    console.error("Subdomain login error:", error);
                    navigate("/login");
                }
            } else {
                navigate("/login");
            }
            setLoading(false);
        };

        handleSubdomainLogin();
    }, [code, dispatch, navigate, subDomain]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size={48} />
            </div>
        );
    }

    return null;
};

export default SubdomainLogin;
