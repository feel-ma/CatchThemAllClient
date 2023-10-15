import "./Navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav className="bg-lime-400 " >

      {isLoggedIn && (
        <div className="flex justify-between">

        <span className=" font-extrabold text-xl custom-nav-border p-4"> Wellcome {user && user.name}</span>
        <div>
      <Link to="/">
        <button className=" mr-8 font-extrabold text-xl custom-nav-border p-4">Home</button>
      </Link> 
          

          <Link to="/profile">
            <button className="mr-8 font-extrabold text-xl custom-nav-border p-4">Profile</button>
            {/* <img src="https://picsum.photos/id/402/200/300" style={{ width: 50, height: 50, borderRadius: 25}} alt="profile" /> */}
          </Link>

          <Link to="/addjson">
            <button className=" mr-8 font-extrabold text-xl custom-nav-border p-4">Add Json</button>
            {/* <img src="https://picsum.photos/id/402/200/300" style={{ width: 50, height: 50, borderRadius: 25}} alt="profile" /> */}
          </Link>

          </div>

          

          <button className=" font-extrabold text-xl custom-nav-border p-4" onClick={logOutUser}>Logout</button>
        </div>
      )}

      {!isLoggedIn && (
        <div>

<Link to="/">
        <button className="mr-8 font-extrabold text-xl custom-nav-border p-4 ">Home</button>
      </Link>
          <Link to="/signup">
            {" "}
            <button className=" mr-8 font-extrabold text-xl custom-nav-border p-4">Sign Up</button>{" "}
          </Link>
          <Link to="/login">
            {" "}
            <button className=" mr-8 font-extrabold text-xl custom-nav-border p-4">Login</button>{" "}
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
