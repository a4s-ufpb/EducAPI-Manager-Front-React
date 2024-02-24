import { BrowserRouter, Route, Routes } from "react-router-dom";
import ContextPage from "./pages/ContextPage";
import ChallengePage from "./pages/ChallengePage";
import IndexPage from "./pages/IndexPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<IndexPage />} />
            <Route path="contexts" element={<ContextPage />} />
            <Route path="challenges" element={<ChallengePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
