import "./LoginPage.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    // Send a request to the server using axios
    /* 
    axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`)
      .then((response) => {})
    */

    // Or using a service
    authService
      .login(requestBody)
      .then((response) => {
        // If the POST request is successful store the authentication token,
        // after the token is stored authenticate the user
        // and at last navigate to the home page
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        // If the request resolves with an error, set the error message in the state
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleLoginSubmit}>
        <div>
        <label className="m-2 font-bold ">Email:</label>
        <input className="border-2 border-slate-200 m-2 px-3 py-2 shadow-sm rounded-md focus:outline-none focus:border-lime-400" type="email" name="email" value={email} onChange={handleEmail} />

        <label className="m-2 font-bold ">Password:</label>
        <input
         className="border-2 border-slate-200 m-2 px-3 py-2 shadow-sm rounded-md focus:outline-none focus:border-lime-400"
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />

        </div>

        <button className="mt-4 p-4 bg-lime-400 rounded-full text-white text-lg font-bold hover:ring-1 hover:ring-red-500"  type="submit">Login</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p className="mt-6 text-lg font-bold">Don't have an account yet?</p>
      <div className="mt-6">
      <Link  className="mt-4 p-3 bg-lime-400 rounded-full text-white text-lg hover:ring-1 hover:ring-red-500" to={"/signup"}> Sign Up</Link>

      </div>
     
    </div>
  );
}

export default LoginPage;
