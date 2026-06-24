import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import MeetTheMaker from "@/pages/MeetTheMaker";
import GoodToKnow from "@/pages/GoodToKnow";
import Contact from "@/pages/Contact";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminAppearance from "@/pages/admin/AdminAppearance";
import AdminContent from "@/pages/admin/AdminContent";
import AdminMessages from "@/pages/admin/AdminMessages";
import { useAdmin } from "@/lib/adminContext";
import { useLocation } from "wouter";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isLoggedIn } = useAdmin();
  const [, setLocation] = useLocation();
  if (!isLoggedIn) { setLocation("/admin"); return null; }
  return <Component />;
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/meet-the-maker" component={MeetTheMaker} />
      <Route path="/good-to-know" component={GoodToKnow} />
      <Route path="/contact" component={Contact} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-success" component={OrderSuccessPage} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard">{() => <ProtectedRoute component={AdminDashboard} />}</Route>
      <Route path="/admin/products">{() => <ProtectedRoute component={AdminProducts} />}</Route>
      <Route path="/admin/appearance">{() => <ProtectedRoute component={AdminAppearance} />}</Route>
      <Route path="/admin/content">{() => <ProtectedRoute component={AdminContent} />}</Route>
      <Route path="/admin/messages">{() => <ProtectedRoute component={AdminMessages} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}
