import SuggestionsManagement from "@/pages/admin/SuggestionsManagement";
import { adminNav } from "@/lib/navigation";

const AdminSuggestionsPage = () => (
  <SuggestionsManagement role="Admin" navItems={adminNav} />
);

export default AdminSuggestionsPage;
