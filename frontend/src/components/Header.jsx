import "./Header.css";
import { Nav, Dropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/api/authApiSlice";
import { logout } from "../slices/authSlice";
import { useEffect, useState } from "react";

const Header = ({ openDrawer }) => {
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 800) {
        setSmallScreen(true);
      } else {
        setSmallScreen(false);
      }
    });
  }, []);

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <div className="headerContainer">
        <div className="headerInnerContainer">
          <div>
            {smallScreen && (
              <IconButton
                style={{ float: "left", margin: "0 0 0 8px" }}
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={openDrawer()}
              >
                <MenuIcon style={{ color: "white" }} />
              </IconButton>
            )}
            <div className="logo" style={{ float: "left" }}>
              <LinkContainer to="/register">
                <Nav.Link id="logo">Top Performers</Nav.Link>
              </LinkContainer>
            </div>
          </div>
          <div>
            {!smallScreen && (
              <>
                <div className="header-link" style={{ float: "left" }}>
                  <LinkContainer to="/purchases">
                    <Nav.Link id="logo">Top-Sellers</Nav.Link>
                  </LinkContainer>
                </div>
                <div className="header-link" style={{ float: "left" }}>
                  <LinkContainer to="/diagrams">
                    <Nav.Link id="logo">Diagrams</Nav.Link>
                  </LinkContainer>
                </div>
              </>
            )}
          </div>
          <div>
            {userInfo?.user_info ? (
              <>
                <div>
                  <Nav>
                    <Dropdown>
                      <Dropdown.Toggle
                        style={{
                          backgroundColor: "transparent",
                          color: "white",
                          padding: "10px",
                          border: "none",
                        }}
                        variant="success"
                        id="dropdown-basic"
                      >
                        {userInfo.user_info.name}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <LinkContainer
                          to="/profile"
                          isActive={false}
                          activeClassName=""
                        >
                          <Dropdown.Item
                            style={{
                              color: "black",
                            }}
                          >
                            <div>Profile </div>
                          </Dropdown.Item>
                        </LinkContainer>
                        <Dropdown.Item
                          style={{
                            color: "black",
                          }}
                          onClick={logoutHandler}
                          id="Logout"
                        >
                          Log out{" "}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav>
                </div>
              </>
            ) : (
              <>
                <div className="topNavigation">
                  <LinkContainer to="/login">
                    <Nav.Link id="login">Log in</Nav.Link>
                  </LinkContainer>
                </div>
                <div className="topNavigation">
                  <LinkContainer to="/register">
                    <Nav.Link id="register">Register</Nav.Link>
                  </LinkContainer>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
