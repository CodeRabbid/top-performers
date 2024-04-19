import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
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
            maxWidth: "700px",
            minWidth: "320px",
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            id="logo"
            style={{
              display: "flex",
              padding: "10px",
              whiteSpace: "nowrap",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Top Performers
          </div>
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
                  <Dropdown>
                    <Dropdown.Toggle
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        // fontWeight: "bold",
                        color: "white",
                      }}
                      variant="success"
                      id="dropdown-basic"
                    >
                      {userInfo.user_info.name}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        style={{
                          // fontWeight: "bold",
                          color: "white",
                        }}
                        onClick={logoutHandler}
                        id="Logout"
                      >
                        Log out{" "}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    whiteSpace: "nowrap",
                    // fontWeight: "bold",
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
                    // fontWeight: "bold",
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
