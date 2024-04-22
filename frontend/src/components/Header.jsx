import "./Header.css";
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
      <div className="headerContainer">
        <div className="headerInnerContainer">
          <div className="logo">
            <LinkContainer to="/">
              <Nav.Link id="logo">Top Performers</Nav.Link>
            </LinkContainer>
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
                          border: "none",
                          color: "white",
                          padding: "10px",
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
