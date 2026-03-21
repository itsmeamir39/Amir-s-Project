import SuggestionsManagement from "@/pages/admin/SuggestionsManagement";
import { librarianNav } from "@/lib/navigation";

const LibrarianSuggestions = () => (
  <SuggestionsManagement role="Librarian" navItems={librarianNav} />
);

export default LibrarianSuggestions;
