import Header from "../Header";
import CustomersManagement from "./CustomersManagement";
import Sidebar from "../Sidebar";

const Customers = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Thông tin khách hàng" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <CustomersManagement />
        </main>
      </div>
    </div>
  );
};

export default Customers;
