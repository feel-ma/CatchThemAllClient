import "./SignupPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name };

    // Send a request to the server using axios
    /* 
    const authToken = localStorage.getItem("authToken");
    axios.post(
      `${process.env.REACT_APP_SERVER_URL}/auth/signup`, 
      requestBody, 
      { headers: { Authorization: `Bearer ${authToken}` },
    })
    .then((response) => {})
    */

    // Or using a service
    authService
      .signup(requestBody)
      .then((response) => {
        // If the POST request is successful redirect to the login page
        navigate("/login");
      })
      .catch((error) => {
        // If the request resolves with an error, set the error message in the state
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="SignupPage">

        <div className="mt-10"> 

          <h1 className="font-bold text-5xl">New to the App?</h1>
          <p className="mt-1 text-slate-500">Please fill out all the fields in the form below to create your account.</p>

        </div>


      <form className="mt-4 md:mt-10" onSubmit={handleSignupSubmit}>


        <div className="flex justify-center   flex-col md:flex-row"> 
          <div>
          <label className="m-2 font-bold ">Email:</label>
        <input className="border-2 border-slate-200 m-2 px-3 py-2 shadow-sm rounded-md focus:outline-none focus:border-lime-400"
         type="email" name="email" value={email} onChange={handleEmail} />
          </div>
       
       <div>
       <label className="m-2 font-bold ">Password:</label>
        <input
        className="border-2 border-slate-200 m-2 px-3 py-2 shadow-sm rounded-md focus:outline-none focus:border-lime-400"
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
       </div>

       <div>
       <label className="m-2 font-bold ">Name:</label>
        <input className="border-2 border-slate-200 m-2 px-3 py-2 shadow-sm rounded-md focus:outline-none focus:border-lime-400"
        type="text" name="name" value={name} onChange={handleName} />
       </div>

        </div>
    

        <button className="mt-4 p-4 bg-lime-400 rounded-full text-white text-lg font-bold hover:ring-1 hover:ring-red-500" type="submit">Sign Up</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p className="mt-6 text-lg font-bold">Already have an Account?</p>
      <div className="mt-6">
      <Link className="mt-4 p-3 bg-lime-400 rounded-full text-white text-lg  hover:ring-1 hover:ring-red-500" to={"/login"}> Login</Link>
      </div>
      
    </div>
  );
}

export default SignupPage;
