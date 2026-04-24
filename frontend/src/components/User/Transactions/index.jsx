import { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Card, Table, Popconfirm, Form, Select, Modal } from "antd";
import { toast } from "react-toastify";
import http from "../../../utils/http";
import useSWR, { mutate } from "swr";
import fetcher from "../../../utils/fetcher";
import { formatDate } from "../../../utils/date";

const Transactions = () => {

    const [transactionForm] = Form.useForm();
    const [edit, setEdit] = useState(null);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);    

    const columns = [
        {
            title: "Transactions Type",
            dataIndex: "transactionType",
            key: "transactionType",
            className: "capitalize"
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            className: "capitalize"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            className: "capitalize"
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            className: "capitalize"
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes",
            className: "capitalize"
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render : (date) => formatDate(date)
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, obj) => (
                <div className="flex gap-1">
                    <Popconfirm
                        title="Are you sure ?"
                        description="Once you update, You can also re-update !"
                        onCancel={() => toast.info("No Changes occur !")}
                        onConfirm={() => onEditTranstion(obj)}
                    >
                        <Button
                            type="text"
                            className="!bg-green-100 !text-green-500"
                            icon={<EditOutlined />}
                        />
                    </Popconfirm>
                    <Popconfirm
                        title="Are you sure ?"
                        description="Once you deleted, You can also re-store !"
                        onCancel={() => toast.info("Your data is safe !")}
                        onConfirm={() => onDelete(obj._id)}
                    >
                        <Button
                            type="text"
                            className="!bg-rose-100 !text-rose-500"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </div>
            )
        },
    ];

    const {data:transactions,error,isLoading} = useSWR(
        "/api/transaction/get",
        fetcher
    );

    const onFinish = async (values) => {
        try{
            setLoading(true);
            await http.post("/api/transaction/create",values);
            toast.success("Transaction created successfully !");
            mutate("/api/transaction/get");
            setModal(false);
            transactionForm.resetFields();
        }catch(err){
            toast.error(err?.response?.data?.message || err.message);
        }finally{
            setLoading(false);
        }
    }

    const onUpdate = async (values) => {
        try{
            setLoading(true);
            await http.put(`/api/transaction/update/${edit._id}`,values);
            toast.success("Transaction created successfully !");
            mutate("/api/transaction/get");
            setModal(false);
            setEdit(null);
            transactionForm.resetFields();
        }catch(err){
            toast.error(err?.response?.data?.message || err.message);
        }finally{
            setLoading(false);
        }
    }

    const onDelete = async (id) => {
        try{
            setLoading(true);
            await http.delete(`/api/transaction/delete/${id}`);
            toast.success("Transaction deleted successfully !");
            mutate("/api/transaction/get");
        }catch(err){
            toast.error(err?.response?.data?.message || err.message);
        }finally{
            setLoading(false);
        }
    }

    const onEditTranstion = (obj) => {
        setEdit(obj);
        transactionForm.setFieldsValue(obj);
        setModal(true);
    }

    return (
        <div>
            <div className="grid">
                <Card
                    title="Transaction List"
                    style={{ overflowX: "auto" }}
                    extra={
                        <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-3">
                            <Input 
                                placeholder="Search by all"
                                prefix={<SearchOutlined />}
                            />
                            <Button
                                type="text"
                                className="!font-bold !bg-blue-500 !text-white"
                                onClick={()=>setModal(true)}
                            >
                                Add new transaction
                            </Button>
                        </div>
                    }
                >
                    <Table 
                        columns={columns}
                        dataSource={transactions}
                        scroll={{ x: "max-content" }}
                        loading={isLoading}
                    />
                </Card>
            </div>
            <Modal
                open={modal}
                onCancel={()=> {
                    setModal(false)
                    setEdit(null)
                    transactionForm.resetFields()
                }}
                title="Add new transaction"
                footer={null}
            >
                <Form 
                    layout="vertical"
                    form={transactionForm}
                    onFinish={edit ? onUpdate : onFinish}
                >
                    <div className="grid md:grid-cols-2 gap-x-3">
                        <Form.Item
                            label="Transaction Type"
                            name="transactionType"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Transaction Type"
                                options={[
                                    { label: "CR", value: "cr" },
                                    { label: "DR", value: "dr" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Amount"
                            name="amount"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter amount" type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter title" />
                        </Form.Item>
                        <Form.Item
                            label="Payment Method"
                            name="paymentMethod"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Payment Method"
                                options={[
                                    { label: "Cash", value: "cash" },
                                    { label: "Online", value: "online" },
                                ]}
                            />
                        </Form.Item>
                    </div>
                    <Form.Item
                        label="Notes"
                        name="notes"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea placeholder="potato, tomato, etc"/>
                    </Form.Item>
                    <Form.Item className="flex justify-end items-center">
                        <Button
                            loading={loading}
                            type="primary"
                            htmlType="submit"
                            className={`!font-semibold !text-white ${edit ? "!bg-red-500" : "!bg-blue-500"}`}
                        >
                            {edit ? "Updata" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
};

export default Transactions;