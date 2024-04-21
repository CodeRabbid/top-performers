import { Navbar, Nav, Container, Dropdown, Button } from "react-bootstrap";
import { LinkContainer, Link } from "react-router-bootstrap";
import { FaSignOutAlt, FaSignInAlt, FaCashRegister } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/api/authApiSlice";
import { logout } from "../slices/authSlice";

const Header = () => {
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
      <div
        style={{
          position: "relative",
          width: "100%",
          backgroundColor: "rgb(0,99,242)",
        }}
      >
        <div
          style={{
            maxWidth: "880px",
            minWidth: "320px",
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <a href="/">
            <LinkContainer
              style={{
                padding: "10px",
                color: "white",
                fontWeight: "bold",
              }}
              to="/"
              isActive={false}
              activeClassName=""
            >
              <div>Top Performers </div>
            </LinkContainer>
          </a>

          <div>
            {userInfo?.user_info ? (
              <>
                <div
                  style={{
                    display: "inline-block",
                    padding: "0px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Nav>
                    <Dropdown>
                      <Dropdown.Toggle
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "white",
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
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    whiteSpace: "nowrap",
                    color: "white",
                  }}
                >
                  <LinkContainer to="/login">
                    <Nav.Link id="login">Log in</Nav.Link>
                  </LinkContainer>
                </div>

                <div
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    whiteSpace: "nowrap",
                    color: "white",
                  }}
                >
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
