import { useState, useEffect, useCallback } from "react";
import { Select, Table, Tabs, Card, Button, Empty, message, Statistic, Row, Col } from "antd";
import { ReloadOutlined, DollarOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import http from "../../../utils/http";
import Loader from "../../Shared/Loader";

const AdminReport = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [teamSummary, setTeamSummary] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [loading, setLoading] = useState({
    users: false,
    team: false,
    transactions: false
  });

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await http.get("/api/admin/users");
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users");
      setAllUsers([]);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, []);

  // Fetch team summary
  const fetchTeamSummary = useCallback(async () => {
    setLoading(prev => ({ ...prev, team: true }));
    try {
      const response = await http.get("/api/admin/team-summary");
      setTeamSummary(response.data);
    } catch (error) {
      console.error("Error fetching team summary:", error);
      message.error("Failed to load team summary");
      setTeamSummary(null);
    } finally {
      setLoading(prev => ({ ...prev, team: false }));
    }
  }, []);

  // Fetch transactions for selected user
  const fetchUserTransactions = useCallback(async (userId) => {
    if (!userId) return;
    
    setLoading(prev => ({ ...prev, transactions: true }));
    try {
      const response = await http.get(`/api/admin/reports/user/${userId}`);
      setUserTransactions(response.data.transactions || response.data || []);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      message.error("Failed to load user transactions");
      setUserTransactions([]);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchTeamSummary();
  }, [fetchUsers, fetchTeamSummary]);

  useEffect(() => {
    if (selectedUser) {
      fetchUserTransactions(selectedUser);
    } else {
      setUserTransactions([]);
    }
  }, [selectedUser, fetchUserTransactions]);

  // Calculate totals from transactions
  const calculateTotals = (transactions) => {
    const credit = transactions
      .filter(t => t.transactionType === "cr" || t.type === "cr")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const debit = transactions
      .filter(t => t.transactionType === "dr" || t.type === "dr")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return { credit, debit, balance: credit - debit };
  };

  const totals = calculateTotals(userTransactions);

  // Table columns for user list
  const userColumns = [
    { 
      title: "S.No", 
      key: "index",
      render: (_, __, index) => index + 1,
      width: 60
    },
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name",
      render: (text) => text || "N/A"
    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email" 
    },
    { 
      title: "Total Spent", 
      dataIndex: "totalSpent", 
      key: "totalSpent",
      render: (value) => `₹${value?.toFixed(2) || 0}`,
      align: "right"
    },
    { 
      title: "Status", 
      dataIndex: "isActive", 
      key: "isActive",
      render: (active) => active !== false ? "Active" : "Inactive"
    }
  ];

  if (loading.users && loading.team && allUsers.length === 0) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Admin Reports</h1>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={() => {
            fetchUsers();
            fetchTeamSummary();
            if (selectedUser) fetchUserTransactions(selectedUser);
          }}
          type="primary"
        >
          Refresh Data
        </Button>
      </div>

      {/* Team Overview Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Team Spending"
              value={teamSummary?.total || 0}
              prefix="₹"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Top Spender"
              value={teamSummary?.topSpender || "No Data"}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={teamSummary?.totalUsers || allUsers.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Tabs Section */}
      <Card className="shadow-sm">
        <Tabs defaultActiveKey="1" size="large">
          {/* Tab 1: User Reports */}
          <Tabs.TabPane 
            tab={<span><UserOutlined /> User Reports</span>} 
            key="1"
          >
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Select User:</label>
              <Select
                placeholder="-- Choose a user to view report --"
                onChange={setSelectedUser}
                style={{ width: '100%', maxWidth: 400 }}
                allowClear
                showSearch
                optionFilterProp="children"
                loading={loading.users}
                value={selectedUser}
              >
                {allUsers.map(user => (
                  <Select.Option key={user._id || user.id} value={user._id || user.id}>
                    {user.name} ({user.email})
                  </Select.Option>
                ))}
              </Select>
            </div>

            {selectedUser && (
              <>
                {/* User Summary Cards */}
                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={24} sm={8}>
                    <Card className="border-t-4 border-green-500">
                      <Statistic
                        title="Total Credit"
                        value={totals.credit}
                        prefix="₹"
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card className="border-t-4 border-red-500">
                      <Statistic
                        title="Total Debit"
                        value={totals.debit}
                        prefix="₹"
                        valueStyle={{ color: '#cf1322' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card className="border-t-4 border-blue-500">
                      <Statistic
                        title="Balance"
                        value={totals.balance}
                        prefix="₹"
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* User Transactions */}
                <Card title="Transaction History" className="mt-4">
                  {loading.transactions ? (
                    <Loader />
                  ) : userTransactions.length === 0 ? (
                    <Empty description="No transactions found for this user" />
                  ) : (
                    <div className="space-y-3">
                      {userTransactions.map((t) => (
                        <div
                          key={t._id}
                          className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {t.title || t.description || "No Title"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {t.transactionType === "cr" ? "CREDIT" : "DEBIT"} • 
                              {t.paymentMethod || "N/A"} • 
                              {t.date ? new Date(t.date).toLocaleDateString() : "No date"}
                              {t.notes && ` • ${t.notes}`}
                            </p>
                          </div>
                          <div className={`font-bold text-lg ${t.transactionType === "cr" ? "text-green-500" : "text-red-500"}`}>
                            {t.transactionType === "cr" ? "+" : "-"} ₹{t.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            )}
          </Tabs.TabPane>

          {/* Tab 2: All Users */}
          <Tabs.TabPane 
            tab={<span><TeamOutlined /> All Users</span>} 
            key="2"
          >
            <Table 
              dataSource={allUsers} 
              columns={userColumns} 
              rowKey={(record) => record._id || record.id}
              loading={loading.users}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Total ${total} users`
              }}
            />
          </Tabs.TabPane>

          {/* Tab 3: Analytics (Future Feature) */}
          <Tabs.TabPane 
            tab={<span><DollarOutlined /> Analytics</span>} 
            key="3"
          >
            <Card>
              <Empty 
                description="Advanced analytics coming soon!" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <div className="text-center text-gray-400 mt-2">
                Features planned: Category breakdown, monthly trends, export reports
              </div>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminReport;