import { useEffect, useState, useRef } from "react";
import "./App.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { NavBar } from "./Components/Navbar";
import { Settings } from "./Components/Settings";
import { Generate } from "./Components/Generate";
import { Customize } from "./Components/Customize";
import { Export } from "./Components/Export";
import { Home } from "./Components/Home";
import { Routes, Route, Outlet } from "react-router-dom";
import { Container } from "@mui/material";
import Box from '@mui/material/Box';

function App() {
    const [isSettingOpened, setIsSettingOpened] = useState(false)
    return (
      <Routes>
      <Route element={
        <>
        <NavBar setIsSettingOpened={setIsSettingOpened}/>
        <Settings isSettingOpened={isSettingOpened} setIsSettingOpened={setIsSettingOpened}></Settings>
        <Container>
          <Box sx={{ height: "calc(100vh - 64px)" }} >
            <Outlet/>
          </Box>
        </Container>
        </>
      }>
        <Route index element={
          <Home></Home>
        } />

        <Route path="/generate/*" element={
          <Generate></Generate>
        } />

        <Route path="/customize" element={
          <Customize></Customize>
        } />

        <Route path="/export" element={
          <Export></Export>
        } />
        
      </Route>
    </Routes>
    );
}

export default App;
