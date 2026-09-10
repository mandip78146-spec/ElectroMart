import { Routes, Route, Navigate } from "react-router-dom"
import { Main } from "./main"
import { Category } from "./category"
import { Product } from "./product"
import { Register } from "./register"
import { Login } from "./login"
import { Related } from "./reletedproducts"
import { Detail } from "./productdetail"
import { Cart } from "./cart"
import { Wish } from "./wishlist"
import { Brand } from "./brand"
import { Check } from "./checkout"
import { Admin } from "./admin"
import { Dashboard } from "./adminpanel"
import { Order } from "./order"
import { About } from "./aboutus"
import { Contact } from "./contact"
import { Vendor } from "./vendor"
import { VendorLogin } from "./vendorlogin"
import { VendorDashboard } from "./vendordash"
import { getStoredToken } from "./auth";

const getUserRole = () => {
    try {
        const token = getStoredToken();
        if (!token) return '';
        const parts = String(token).split('.');
        if (parts.length !== 3) return '';
        const decoded = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return decoded.usertype || decoded.userType || decoded.UserType || '';
    } catch (error) {
        return '';
    }
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const role = getUserRole();
    if (!role) return <Navigate to="/login" replace />;
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
    return children;
};

export const Rout = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Main></Main>}></Route>
                <Route path="/category" element={<Category></Category>}></Route>
                <Route path="/product" element={<Product></Product>}></Route>
                <Route path="/register" element={<Register></Register>}></Route>
                <Route path="/login" element={<Login></Login>}></Route>
                <Route path="/related" element={<Related></Related>} />
                <Route path="/detail" element={<Detail></Detail>} />
                <Route path="/cart" element={<Cart></Cart>} />
                <Route path="/wish" element={<Wish></Wish>} />
                <Route path="/brand" element={<Brand></Brand>} />
                <Route path="/checkout" element={<Check></Check>} />
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
                <Route path="/myorder" element={<Order></Order>} />
                <Route path="/about" element={<About></About>} />
                <Route path="/contact" element={<Contact></Contact>} />
                <Route path="/vendorapply" element={<Vendor />} />
                <Route path="/vlogin" element={<VendorLogin />} />
                <Route path="/vendordash" element={<ProtectedRoute allowedRoles={['Vendor']}><VendorDashboard /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}