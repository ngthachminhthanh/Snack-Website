import ProductList from "./ProductList";
import Sidebar from "../Sidebar";
import Header from "../Header";

const Products = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Danh sách các món ăn vặt" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <ProductList />
        </main>
      </div>
    </div>
  );
};

export default Products;
