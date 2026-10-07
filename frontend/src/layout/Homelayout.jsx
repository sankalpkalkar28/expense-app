import { Layout, theme } from "antd";

const { Header, Footer, Content } = Layout;

const Homelayout = ({ children }) => {

    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();

    return (
        <Layout>
            <Header className="!bg-[#FF735C] flex items-center justify-center">
                <h1 className="text-white text-lg md:text-3xl font-bold">
                   💰 Expense Tracker App
                </h1>
            </Header>

            <Content
                style={{
                    margin: "24px 16px",
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                {children}
            </Content>

            <Footer className="!bg-[#FF735C] flex items-center justify-center">
                <h1 className="text-white text-base md:text-2xl font-bold">
                    Take control of your finances today!
                </h1>
            </Footer>
        </Layout>
    );
};

export default Homelayout;


// import { Outlet } from "react-router-dom";

// const HomeLayout = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
      
//       {/* ===== IMPROVED HEADER ===== */}
//       <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             {/* Logo Section */}
//             <div className="flex items-center space-x-3">
//               <div className="text-3xl">💰</div>
//               <div>
//                 <h1 className="text-2xl font-bold">Expense Tracker</h1>
//                 <p className="text-sm text-blue-100">Track your money wisely</p>
//               </div>
//             </div>
            
//             {/* User Info */}
//             <div className="flex items-center space-x-4">
//               <span className="text-sm">Welcome, User</span>
//               <button className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors">
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 container mx-auto px-4 py-8">
//         <Outlet />
//       </main>

//       {/* ===== IMPROVED FOOTER ===== */}
//       <footer className="bg-gray-800 text-gray-300">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             {/* Left Side */}
//             <div className="flex space-x-6 mb-3 md:mb-0">
//               <span>© 2024 Expense Tracker</span>
//               <span>|</span>
//               <a href="#" className="hover:text-white transition-colors">About</a>
//               <span>|</span>
//               <a href="#" className="hover:text-white transition-colors">Privacy</a>
//               <span>|</span>
//               <a href="#" className="hover:text-white transition-colors">Contact</a>
//             </div>
            
//             {/* Right Side */}
//             <div className="flex space-x-4 text-sm">
//               <span>💪 Take control of your finances</span>
//             </div>
//           </div>
//         </div>
//       </footer>

//     </div>
//   );
// };

// export default HomeLayout;