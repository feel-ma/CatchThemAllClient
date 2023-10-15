import React from "react";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import RenderTenRemove from "./RenderTenRemove";

const API_URL =  process.env.REACT_APP_SERVER_URL;

function RenderToRemove({files,pID,  fetchProjects}){

    const [Removelist, setRemovelist] =useState([])
    const [howMany, setHowMany] = useState("")


    

   
    const [errorMessage, setErrorMessage] = useState(undefined);
    const { user } = useContext(AuthContext);

    useEffect(() => {

        setRemovelist(files)
        console.log(files)
     }, [files]);

     const handleCount = (e) => {
        setHowMany(e.target.value);
    };

    
     async function handleSubmit(e){
        e.preventDefault();

        
    const requestBody = {
        owner: user._id,
        howMany,
        

      };


        const authToken = localStorage.getItem("authToken");
        axios
          .put(`${API_URL}/api/user/removedcount`, requestBody, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then((response) => {

            setErrorMessage(null);
            
            fetchProjects()

          })
          .catch((error) => {
            console.error(error);
            setErrorMessage("Failed to create note.");
          });
      };
    


    return (
        <div> 
          {/*  {Removelist.map((profile)=>  (
        
        <div key={profile.id}>
        <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer">
        {profile.profileUrl}
        </a>
      </div>
        )
       )} */}

{/*     <form onSubmit={handleSubmit}>
            <label>How many requests:</label>

            <select value={howMany} onChange={handleCount}>
              <option value="">How many removed</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="9">10</option>
            </select>

            <button type="submit">Save removed</button>
          </form>
 */}

  <RenderTenRemove files={Removelist} pID={pID}  fetchProjects={fetchProjects} />


        </div>
        
    )

}

export default RenderToRemove