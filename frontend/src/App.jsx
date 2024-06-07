import Header from "./components/Header";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { LinkContainer } from "react-router-bootstrap";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

export default function App() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {[
          { title: "Top-Sellers", link: "/purchases" },
          { title: "Diagrams", link: "/diagrams" },
        ].map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton>
              <LinkContainer to={item.link}>
                <ListItemText primary={item.title} />
              </LinkContainer>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <Header openDrawer={() => toggleDrawer(true)} />
      <ToastContainer />
      <Container
        style={{
          width: "100%",
          minWidth: "320px",
          maxWidth: "880px",
          marginLeft: "auto",
          height: "0%",
          flex: "1 0 auto",
        }}
      >
        <Outlet />
      </Container>
    </>
  );
}
