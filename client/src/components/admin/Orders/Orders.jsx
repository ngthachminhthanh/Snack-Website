import OrdersManagement from "./OrdersManagement";
import Sidebar from "../Sidebar";
import Header from "../Header";

const Orders = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Quản lý đơn hàng" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <OrdersManagement />
        </main>
      </div>
    </div>
  );
};

export default Orders;
