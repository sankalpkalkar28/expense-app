import { useState } from "react";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Card, Table, Popconfirm, Form, Select, Modal } from "antd";
import { toast } from "react-toastify";

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
                        // onConfirm={() => onEditTranstion(obj)}
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
                        // onConfirm={() => onEditTranstion(obj)}
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

    const dataSource = [{},{}];

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
                        dataSource={dataSource}
                        scroll={{ x: "max-content" }}
                        rowKey="id"
                    />
                </Card>
            </div>
            <Modal
                open={modal}
                onCancel={()=> setModal(false)}
                title="Add new transaction"
                footer={null}
            >
                <Form 
                    layout="vertical"
                    form={transactionForm}
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
                            className="!font-semibold !text-white !bg-blue-500"
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
};

export default Transactions;