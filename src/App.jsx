import { Box } from "@mui/material";
import "./App.css";
import NavBar from "./components/NavBar";
import DocketForm from "./components/Docket";

function App() {
  return (
    <>
      <Box>
        <NavBar />
      </Box>
      <br />
      <Box>
        <DocketForm />
      </Box>
    </>
  );
}

export default App;
