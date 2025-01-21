import { useState } from "react";
import FormPage from "./pages/FormPage";

function App() {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  return (
    <>
      <FormPage selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
    </>
  );
}

export default App;
