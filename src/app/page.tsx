import { Header } from "./components/header";
import UserTablePage from "./components/userTable/UserTablePage";

export default function Home() {
  return (
    <div className="">
      <Header />
      <UserTablePage />
    </div>
  );
}
