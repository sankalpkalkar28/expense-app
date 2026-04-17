import { Card, Input, Form, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";
import http from "../../../utils/http";

const { Item } = Form;

const ForgotPassword = () => {

    const navigate = useNavigate();
    const [params] = useSearchParams();

    const [forgotForm] = Form.useForm();
    const [rePasswordForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    // useEffect(()=>{
    //     const tok = params.get("token");
        
    //     if(tok){
    //         checkToken(tok);
    //         // setToken(tok);
    //     }else{
    //         setToken(null);
    //     }
    // },[params]);

    useEffect(() => {
    const tok = params.get("token");
    if (tok) {
        // call async function and update state immediately
        (async () => {
            try {
                await checkToken(tok);  // waits for backend verification
            } catch (err) {
                setToken(null);
            }
        })();
    } else {
        setToken(null);
    }
}, [params]);

    // const checkToken = async (tok) =>{
    //     try{
    //         await axios.post("/api/user/verify-token",{},{
    //             headers : {
    //                 Authorization : `Bearer ${tok}`
    //             }
    //         });
    //         setToken(tok);
    //     }catch(err){
    //         setToken(null);
    //     }
    // }

    const checkToken = async (tok) => {
    try {
        await http.post("/api/user/verify-token", {}, {
            headers: { Authorization: `Bearer ${tok}` }
        });
        setToken(tok); // valid token -> show Change Password form
    } catch (err) {
        setToken(null); // invalid token -> stay on Forgot Password
    }
};

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await http.post("/api/user/forgot-password", values);
            toast.success("Please check your email to forgot password");
        } catch (err) {
            toast.error(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    }

     const onChangePassword = async (values) => {
        try {
            if(values.password !== values.rePassword)
                return toast.warning("Password & re password not matched");
            setLoading(true);
            await http.put("/api/user/change-password", values,
                {
                    headers: {
                        // Authorization: `Bearer ${params.get("token")}`
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Password update successfully, please wait...");
            setTimeout(()=>{
                navigate("/")
            },3000)
        } catch (err) {
            toast.error(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Homelayout>
            <div className="flex">
                <div className="w-1/2 hidden md:flex items-center justify-center">
                    <img
                        src="/statistic-report.webp"
                        alt="Bank"
                        className="w-4/5 object-contain"
                    />
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
                    <Card className="w-full max-w-sm shadow-xl">
                        <h2 className="font-bold text-[#FF735C] text-2xl text-center mb-6">
                            {
                                token ?
                                "Change Password"
                                :
                                "Forgot Password"
                            }
                        </h2>
                        {
                            token ?
                                <Form
                                    name="login-form"
                                    layout="vertical"
                                    onFinish={onChangePassword}
                                    form={rePasswordForm}
                                >
                                    <Item
                                        name="password"
                                        label="Password"
                                        rules={[{ required: true }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Enter your password"
                                        />
                                    </Item>
                                    <Item
                                        name="rePassword"
                                        label="Re Enter password"
                                        rules={[{ required: true }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Enter your password"
                                        />
                                    </Item>
                                    <Item>
                                        <Button
                                            type="text"
                                            htmlType="submit"
                                            block
                                            className="!bg-[#FF735C] !text-white !font-bold"
                                            loading={loading}
                                        >
                                            Change Password
                                        </Button>
                                    </Item>
                                </Form>
                                :
                                <Form
                                    name="login-form"
                                    layout="vertical"
                                    onFinish={onFinish}
                                    form={forgotForm}
                                >
                                    <Item
                                        name="email"
                                        label="Email"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Enter email"
                                        />
                                    </Item>
                                    <Item>
                                        <Button
                                            type="text"
                                            htmlType="submit"
                                            block
                                            className="!bg-[#FF735C] !text-white !font-bold"
                                            loading={loading}
                                        >
                                            Submit
                                        </Button>
                                    </Item>
                                </Form>
                        }
                        <div className="flex items-center justify-between">
                            <Link
                                style={{ textDecoration: "underline" }}
                                to="/"
                                className="!text-[#FF735C] !font-bold"
                            >
                                Sign in
                            </Link>
                            <Link
                                style={{ textDecoration: "underline" }}
                                to="/signup"
                                className="!text-[#FF735C] !font-bold"
                            >
                                Don't have an account?
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </Homelayout>
    )
}
export default ForgotPassword;