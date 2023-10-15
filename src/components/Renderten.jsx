import React from "react";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL =  process.env.REACT_APP_SERVER_URL;

function RenderTen({files, pID, fetchProjects, checkLimiter}){

    const [ten, pickTen]= useState([])
    const[howMany, setHowMany] = useState("")
    const [errorMessage, setErrorMessage] = useState(undefined);
    const { user } = useContext(AuthContext);
    const[count,setCount] =useState(0)


    useEffect(() => {

         const firstTen =files.slice(0,10)

         console.log(firstTen)
        pickTen(firstTen)



      }, [files]);

      
     const handleCount = (e) => {
        setHowMany(e.target.value);
    };

    async function handleSubmit(e){
        e.preventDefault();

        
    const requestBody = {
        owner: user._id,
        howMany,
        pID

      };


        const authToken = localStorage.getItem("authToken");
        axios
          .put(`${API_URL}/api/jsonspeopleadded`, requestBody, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then((response) => {

            setErrorMessage(null);
            pickTen([])
            fetchProjects()
            checkLimiter()

          })
          .catch((error) => {
            console.error(error);
            setErrorMessage("Failed to create note.");
          });
      };

      function openAll(){

        if(count>9){
          console.log("limit")

          console.log(count)

          return
        }else{
          console.log(count)
          console.log(ten[0].profileUrl)
          window.open(ten[count].profileUrl, "_blank");        
   
          setCount(count+1)

        }
/*         ten.forEach((profile) => {

          window.open(profile.profileUrl, "_blank");
        });
 */
      }

      function resetCount(){
        setCount(0)
      }
    
    
    return (
        <div className="max-w-[60%]"> 
        <div className="mt-10">

        <div>
          {ten.map((profile)=>  (
        
        <div className="m-1 " key={profile.id}>
        <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer">
        {profile.profileUrl}
        </a>
      </div>
        )
       )}

        <div className="mt-10">
            {count < 10 ? (
        <button onClick={openAll}
         className="" 
         title="CTRL+ Left Mouse click to open links in a new tab">Open all</button>
      ) : (
        <div>
        <p>You have already opened all available links.</p>
        <button onClick={resetCount} >OK</button>
        </div>
      )}
            </div>



            <form className="mt-5" onSubmit={handleSubmit}>
            <label className="mx-5 text-lg">How many Added?</label>

            <select value={howMany} onChange={handleCount} className=" bg-lime-100 b-5 focus:border-red-500">
              <option value="">-</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>

            <button className="mx-5 mt-4 p-3 rounded-full bg-slate-200" type="submit">Save requests</button>
          </form>
          </div>


        </div>

        </div>

        
       
        
    )

}

export default RenderTen