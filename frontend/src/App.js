import Container from "@mui/material/Container";
import {Routes} from 'react-router-dom';
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";

function App() {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/" element={<FullPost />}/>
          <Route path="/" element={<AddPost/>}/>
          <Route path="/" element={<Login/>}/>
          <Route path="/" element={<Registration/>}/>
        </Routes>
      </Container>
    </>
  );
}

export default App;
