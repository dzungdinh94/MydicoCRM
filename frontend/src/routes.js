import loadable from '@loadable/component'

const Invoice = loadable(() => import('./views/pages/Invoicing/Invoice'));

const Dashboard = loadable(() => import('./views/pages/dashboard/Dashboard'));
const Customer = loadable(() => import('./views/pages/customer/CustomerList/Customer'));
const CreateCustomer = loadable(() => import('./views/pages/customer/CustomerList/CreateCustomer'));
const EditCustomer = loadable(() => import('./views/pages/customer/CustomerList/EditCustomer'));
const CustomeType = loadable(() => import('./views/pages/customer/CustomerType/CustomeType'));
const CustomerStatus = loadable(() => import('./views/pages/customer/CustomerStatus/CustomerStatus'));
const CreateCustomerStatus = loadable(() => import('./views/pages/customer/CustomerStatus/CreateCustomerStatus'));
const CreateCustomerType = loadable(() => import('./views/pages/customer/CustomerType/CreateCustomerType'));
const EditCustomerStatus = loadable(() => import('./views/pages/customer/CustomerStatus/EditCustomerStatus'));
const EditCustomerType = loadable(() => import('./views/pages/customer/CustomerType/EditCustomerType'));
const CustomerBirthday = loadable(() => import('./views/pages/customer/CustomerBirthday/CustomerBirthday'));

const Product = loadable(() => import('./views/pages/product/ProductList/Products'));
const CreateProduct = loadable(() => import('./views/pages/product/ProductList/CreateProduct'));
const EditProduct = loadable(() => import('./views/pages/product/ProductList/EditProduct'));

const ProductGroup = loadable(() => import('./views/pages/product/ProductGroup/ProductGroup'));
const CreateProductGroup = loadable(() => import('./views/pages/product/ProductGroup/CreateProductGroup'));
const EditProductGroup = loadable(() => import('./views/pages/product/ProductGroup/EditProductGroup'));

const ProductBrand = loadable(() => import('./views/pages/product/ProductBrand/ProductBrand'));
const CreateProductBrand = loadable(() => import('./views/pages/product/ProductBrand/CreateProductBrand'));
const EditProductBrand = loadable(() => import('./views/pages/product/ProductBrand/EditProductBrand'));

const Order = loadable(() => import('./views/pages/sales/Orders/Order'));
const OrderInvoice = loadable(() => import('./views/pages/sales/Orders/Invoice'));
const CreateOrder = loadable(() => import('./views/pages/sales/Orders/CreateOrder'));
const EditOrder = loadable(() => import('./views/pages/sales/Orders/EditOrder'));
const ViewOrder = loadable(() => import('./views/pages/sales/Orders/ViewOrder'));

const Promotion = loadable(() => import('./views/pages/sales/Promotion/Promotions'));
const CreatePromotion = loadable(() => import('./views/pages/sales/Promotion/CreatePromotion'));
const CreateLongTermPromotion = loadable(() => import('./views/pages/sales/Promotion/CreateLongTermPromotion'));
const EditLongTermPromotion = loadable(() => import('./views/pages/sales/Promotion/EditLongTermPromotion'));

const EditPromotion = loadable(() => import('./views/pages/sales/Promotion/EditPromotion'));

const Warehouse = loadable(() => import('./views/pages/warehouse/Warehouse/Warehouse'));
const CreateWarehouse = loadable(() => import('./views/pages/warehouse/Warehouse/CreateWarehouse'));
const EditWarehouse = loadable(() => import('./views/pages/warehouse/Warehouse/EditWarehouse'));

const Provider = loadable(() => import('./views/pages/warehouse/Provider/provider'));
const CreateProvider = loadable(() => import('./views/pages/warehouse/Provider/create-provider'));
const EditProvider = loadable(() => import('./views/pages/warehouse/Provider/edit-provider'));

const WarehouseImport = loadable(() => import('./views/pages/warehouse/Import/warehouse-import'));
const CreateWarehouseImport = loadable(() => import('./views/pages/warehouse/Import/create-warehouse-import'));
const CreateWarehouseReturn = loadable(() => import('./views/pages/warehouse/Import/create-warehouse-return'));
const EditWarehouseImport = loadable(() => import('./views/pages/warehouse/Import/edit-warehouse-import'));
const EditWarehouseReturn = loadable(() => import('./views/pages/warehouse/Import/edit-warehouse-return'));
const ViewWarehouseReturn = loadable(() => import('./views/pages/warehouse/Import/view-warehouse-return'));

const WarehouseExport = loadable(() => import('./views/pages/warehouse/Export/warehouse-export'));
const CreateWarehouseExport = loadable(() => import('./views/pages/warehouse/Export/create-warehouse-export'));
const EditWarehouseExport = loadable(() => import('./views/pages/warehouse/Export/edit-warehouse-export'));
const CreateWarehouseExportProvider = loadable(() => import('./views/pages/warehouse/Export/create-warehouse-export-provider'));
const EditWarehouseExportProvider = loadable(() => import('./views/pages/warehouse/Export/edit-warehouse-export-provider'));

const StoreHistory = loadable(() => import('./views/pages/warehouse/History/warehouse-history'));

const ProductWarehouse = loadable(() => import('./views/pages/warehouse/Product/ProductWarehouse'));

const User = loadable(() => import('./views/pages/user/UserList/user'));
const CreateUser = loadable(() => import('./views/pages/user/UserList/create-user'));
const EditUser = loadable(() => import('./views/pages/user/UserList/edit-user'));

const UserRole = loadable(() => import('./views/pages/user/UserRole/user-roles'));
const CreateUserRole = loadable(() => import('./views/pages/user/UserRole/create-user-role'));
const EditUserRole = loadable(() => import('./views/pages/user/UserRole/edit-user-role'));

const Department = loadable(() => import('./views/pages/user/UserDepartment/departments'));
const CreateDepartment = loadable(() => import('./views/pages/user/UserDepartment/create-department'));
const EditDepartment = loadable(() => import('./views/pages/user/UserDepartment/edit-department'));
const DepartmentStructure = loadable(() => import('./views/pages/user/UserDepartment/departments-structure'));
const Branch = loadable(() => import('./views/pages/user/UserBranch/branches'));
const CreateBranch = loadable(() => import('./views/pages/user/UserBranch/create-branch'));
const EditBranch = loadable(() => import('./views/pages/user/UserBranch/edit-branch'));

const Permission = loadable(() => import('./views/pages/user/UserPermission/permission'));
const CreatePermission = loadable(() => import('./views/pages/user/UserPermission/create-permission'));
const EditPermission = loadable(() => import('./views/pages/user/UserPermission/edit-permission'));

const Debts = loadable(() => import('./views/pages/finance/debt/debt'));
const Transaction = loadable(() => import('./views/pages/finance/debt/transaction'));

const Receipt = loadable(() => import('./views/pages/finance/receipt/receipt'));
const CreateReceipt = loadable(() => import('./views/pages/finance/receipt/create-receipt'));
const EditReceipt = loadable(() => import('./views/pages/finance/receipt/edit-receipt'));
const ViewReceipt = loadable(() => import('./views/pages/finance/receipt/detail-receipt'));

const Bill = loadable(() => import('./views/pages/warehouse/Bill/Bill'));

// https:/github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {path: '/', exact: true, name: 'Trang chủ', component: Dashboard},
  {path: '/dashboard', name: 'Thống kê', component: Dashboard},
  {path: '/invoice/', name: 'Thống kê', component: Invoice},
  {path: '/customer-debits', name: 'Công nợ', component: Debts, exact: true},
  {path: '/customer-debits/:id/detail/order/:orderId', name: 'Chi tiết đơn hàng', component: ViewOrder},
  {path: '/customer-debits/:id/detail/receipt/:receiptId', name: 'Chi tiết phiếu thu', component: ViewReceipt},
  {path: '/customer-debits/:id/detail/store/:storeId', name: 'Chi tiết trả kho', component: ViewWarehouseReturn},
  {path: '/customer-debits/:id/detail', name: 'Chi tiết công nợ', component: Transaction},
  {path: '/receipts', name: 'Phiếu thu', component: Receipt, exact: true},
  {path: '/receipts/new', name: 'Tạo phiếu thu', component: CreateReceipt},
  {path: '/receipts/:id/edit', name: 'Sửa phiếu thu', component: EditReceipt},
  {path: '/receipts/:receiptId/detail', name: 'Xem phiếu thu', component: ViewReceipt},
  {path: '/customers/', name: 'Khách hàng', component: Customer, exact: true},
  {path: '/customers/:id/edit/', name: 'Chỉnh sửa khách hàng', component: EditCustomer},
  {path: '/customers/new/', name: 'Thêm mới khách hàng', component: CreateCustomer},
  {path: '/customer-types/', name: 'Loại khách hàng', component: CustomeType, exact: true},
  {path: '/customer-statuses/', name: 'Trạng thái', component: CustomerStatus, exact: true},
  {path: '/customer-statuses/new/', name: 'Thêm mới', component: CreateCustomerStatus},
  {path: '/customer-statuses/:id/edit/', name: 'Chỉnh sửa', component: EditCustomerStatus},
  {path: '/customer-types/new/', name: 'Thêm mới', component: CreateCustomerType},
  {path: '/customer-types/:id/edit/', name: 'Chỉnh sửa', component: EditCustomerType},
  {path: '/customers/birthday/', name: 'Sinh nhật', component: CustomerBirthday},
  {path: '/products/', name: 'Sản phẩm', component: Product, exact: true},
  {path: '/products/:id/edit/', name: 'Chỉnh sửa sản phẩm', component: EditProduct},
  {path: '/products/new/', name: 'Thêm mới sản phẩm', component: CreateProduct},
  {path: '/product-groups/', name: 'Nhóm sản phẩm', component: ProductGroup, exact: true},
  {path: '/product-groups/new/', name: 'Thêm mới', component: CreateProductGroup},
  {path: '/product-groups/:id/edit/', name: 'Chỉnh sửa', component: EditProductGroup},
  {path: '/product-brands/', name: 'Thương hiệu', component: ProductBrand, exact: true},
  {path: '/product-brands/new/', name: 'Thêm mới', component: CreateProductBrand},
  {path: '/product-brands/:id/edit/', name: 'Chỉnh sửa', component: EditProductBrand},
  {path: '/promotions/', name: 'Chương trình bán hàng', component: Promotion, exact: true},
  {path: '/promotions/:id/edit/', name: 'Chỉnh sửa ', component: EditPromotion},
  {path: '/promotions/new/longterm', name: 'Thêm mới', component: CreateLongTermPromotion},
  {path: '/promotions/:id/longterm', name: 'Chỉnh sửa', component: EditLongTermPromotion},
  {path: '/promotions/new/', name: 'Thêm mới', component: CreatePromotion},
  {path: '/orders/', name: 'Đơn hàng', component: Order, exact: true},
  {path: '/orders/:id/edit/', name: 'Chỉnh sửa Đơn hàng', component: EditOrder},
  {path: '/orders/:orderId/detail', name: 'Xem Đơn hàng', component: ViewOrder},
  {path: '/orders/new/invoice/', name: 'Xác nhận', component: OrderInvoice},
  {path: '/orders/new/', name: 'Thêm mới Đơn hàng', component: CreateOrder},
  {path: '/providers/', name: 'Nhà cung cấp', component: Provider, exact: true},
  {path: '/providers/new/', name: 'Tạo mới Nhà cung cấp', component: CreateProvider},
  {path: '/providers/:id/edit/', name: 'Chỉnh sửa Nhà cung cấp', component: EditProvider},
  {path: '/stores/', name: 'Kho hàng', component: Warehouse, exact: true},
  {path: '/stores/histories/', name: 'Lịch sử xuất nhập kho', component: StoreHistory, exact: true},
  {path: '/stores/:id/edit/', name: 'Chỉnh sửa kho hàng', component: EditWarehouse},
  {path: '/stores/new/', name: 'Thêm mới kho hàng', component: CreateWarehouse},
  {path: '/stores/export', name: 'Phiếu xuất kho', component: WarehouseExport, exact: true},
  {path: '/stores/export/:id/edit/', name: 'Chỉnh sửa phiếu xuất kho', component: EditWarehouseExport},
  {path: '/stores/export/new/', name: 'Thêm mới phiếu xuất kho', component: CreateWarehouseExport},
  {
    path: '/stores/export/provider/:id/edit',
    name: 'Chỉnh sửa phiếu xuất kho cho nhà cung cấp',
    component: EditWarehouseExportProvider,
  },
  {path: '/stores/export/provider/new', name: 'Thêm mới phiếu xuất kho cho nhà cung cấp', component: CreateWarehouseExportProvider},
  {path: '/stores/import', name: 'Phiếu nhập kho', component: WarehouseImport, exact: true},
  {path: '/stores/import/:id/edit/', name: 'Chỉnh sửa phiếu nhập kho', component: EditWarehouseImport},
  {path: '/stores/import/new/', name: 'Thêm mới phiếu nhập kho', component: CreateWarehouseImport},
  {path: '/stores/import/return/:id/edit/', name: 'Chỉnh sửa phiếu trả hàng', component: EditWarehouseReturn},
  {path: '/stores/import/return/:storeId/detail', name: 'Xem phiếu trả hàng', component: ViewWarehouseReturn},
  {path: '/stores/import/return/new/', name: 'Thêm mới phiếu trả hàng', component: CreateWarehouseReturn},
  {path: '/stores/product/', name: 'Sản phẩm trong kho', component: ProductWarehouse, exact: true},
  {path: '/users/', name: 'Người dùng', component: User, exact: true},
  {path: '/users/:id/edit', name: 'Chỉnh sửa', component: EditUser},
  {path: '/users/new', name: 'Tạo mới', component: CreateUser},
  {path: '/user-roles/', name: 'chức vụ', component: UserRole, exact: true},
  {path: '/user-roles/:id/edit', name: 'Chỉnh sửa', component: EditUserRole},
  {path: '/user-roles/new', name: 'Tạo mới', component: CreateUserRole},
  {path: '/departments/', name: 'Chi nhánh', component: Department, exact: true},
  {path: '/departments/:id/edit', name: 'Chỉnh sửa', component: EditDepartment},
  {path: '/departments/new', name: 'Tạo mới', component: CreateDepartment},
  {path: '/branches/', name: 'Chi nhánh', component: Branch, exact: true},
  {path: '/branches/:id/edit', name: 'Chỉnh sửa', component: EditBranch},
  {path: '/branches/new', name: 'Tạo mới', component: CreateBranch},
  {path: '/departments/structure', name: 'Tạo mới', component: DepartmentStructure},
  {path: '/permission-groups/', name: 'nhóm quyền', component: Permission, exact: true},
  {path: '/permission-groups/:id/edit', name: 'Chỉnh sửa', component: EditPermission},
  {path: '/permission-groups/new', name: 'Tạo mới', component: CreatePermission},
  {path: '/bills/', name: 'Vận đơn', component: Bill, exact: true},
];

export default routes;
