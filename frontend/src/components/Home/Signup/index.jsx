import { Card, Input, Form, Button } from "antd";
import { UserOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import http from "../../../utils/http";


const { Item } = Form;

const Signup = () => {
    const navigate = useNavigate();
    const [signupForm] = Form.useForm();
    const [otpForm] = Form.useForm();

    const [formData, setFormData] = useState(null);
    const [otp, setOtp] = useState(null);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const { data } = await http.post("/api/user/send-mail", values);
            setOtp(data.otp);
            setFormData(values);
        } catch (err) {
            toast.error(err.response ? err.response.data.message : err.message);
            setOtp(null);
            setFormData(null);
        } finally {
            setLoading(false);
        }
    };

    // const onSignup = async (values) => {
    //     try {
    //         if(Number(values.otp) !== Number(otp))
    //             return toast.error("OTP not match");

    //         setLoading(true);

    //         await axios.post("/api/user/signup", {
    //             ...formData,
    //             otp: values.otp
    //         });

    //         await axios.post("/api/user/signup", formData);
    //         toast.success("Signup success");
    //         setOtp(null);
    //         setFormData(null);
    //         signupForm.resetFields();
    //     } catch (err) {
    //         toast.error(err.response ? err.response.data.message : err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const onSignup = async (values) => {
    try {
        // Compare OTP sent by backend with what user entered
        if (Number(values.otp) !== Number(otp)) {
            return toast.error("OTP does not match");
        }

        setLoading(true);

        // ONLY call the signup API once with the stored formData
        await http.post("/api/user/signup", formData); 
        
        toast.success("Signup success! Please login.");

        // Inside onSignup after toast.success
        setTimeout(() => {
            navigate("/login"); // or whatever your login path is
        }, 2000);
        
        // Reset and redirect
        setOtp(null);
        setFormData(null);
        signupForm.resetFields();
        navigate("/login"); // Move the user to login page
    } catch (err) {
        toast.error(err.response ? err.response.data.message : err.message);
    } finally {
        setLoading(false);
    }
};

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
                            Track Your Expense
                        </h2>
                        {
                            otp ?
                                <Form name="otp-form" layout="vertical" onFinish={onSignup} form={otpForm}>

                                    <Item
                                        name="otp"
                                        label="Enter OTP"
                                        rules={[{ required: true, message: "Please enter OTP" }]}
                                    >
                                        <Input.OTP length={6} />
                                    </Item>

                                    <Item>
                                        <Button
                                            loading={loading}
                                            type="primary"
                                            htmlType="submit"
                                            block
                                            className="!bg-[#FF735C]"
                                        >
                                            Verify Now
                                        </Button>
                                    </Item>

                                </Form>
                                :
                                <Form name="signup-form" layout="vertical" onFinish={onFinish} form={signupForm}>

                                    <Item name="fullname" label="Fullname" rules={[{ required: true }]}>
                                        <Input prefix={<UserOutlined />} placeholder="Enter fullname" />
                                    </Item>

                                    <Item name="mobile" label="Mobile" rules={[{ required: true }]}>
                                        <Input prefix={<PhoneOutlined />} placeholder="Enter mobile" />
                                    </Item>

                                    <Item name="email" label="Email" rules={[{ required: true }]}>
                                        <Input prefix={<UserOutlined />} placeholder="Enter email" />
                                    </Item>

                                    <Item name="password" label="Password" rules={[{ required: true }]}>
                                        <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
                                    </Item>

                                    <Item>
                                        <Button
                                            loading={loading}
                                            type="text"
                                            htmlType="submit"
                                            block
                                            className="!bg-[#FF735C]"
                                        >
                                            Signup
                                        </Button>
                                    </Item>

                                </Form>
                        }
                        <div className="flex items-center justify-between">
                            <div></div>
                            <Link
                                style={{ textDecoration: "underline" }}
                                to="/"
                                className="!text-[#FF735C] !font-bold "
                            >
                                Already have an account?
                            </Link>
                        </div>

                    </Card>
                </div>

            </div>
        </Homelayout>
    );
};

export default Signup;