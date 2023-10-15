import React, { useEffect, useState,useContext  } from 'react';
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import file from '../jsons/friday.json'

const API_URL =  process.env.REACT_APP_SERVER_URL;

function ProfilePage() {

    const { user } = useContext(AuthContext)

    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [data, setData] = useState([]);
    const [jsonData, setJsonData] = useState([]);

    useEffect(() => {

        setData(file)
        
      }, []);





    const handleType = (e) => {
        setName(e.target.value);
      };

      const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
      
        // Create a new FileReader
        const reader = new FileReader();
      
        // Set up an event handler for when the file reading is complete
        reader.onload = (event) => {
          const fileContent = event.target.result; // This contains the content of the file
      
          // Update your state with the file content
          setJsonData([...jsonData, JSON.parse(fileContent)]);
        };
      
        // Read the file as text
        reader.readAsText(file);
      };
    

    async function saveData(e){


        console.log( "mydata",jsonData)
    
        e.preventDefault();
    
        const requestBody = {
          owner: user._id,
          name,
          data
        };
    
        const authToken = localStorage.getItem("authToken");
        axios
          .post(`${API_URL}api/jsons`, requestBody, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then((response) => {
            setErrorMessage(null);
          })
          .catch((error) => {
            console.error(error);
            setErrorMessage("Failed to load file.");
          });
      
          setName('')
      }
    





  return (
<div className="mx-auto w-full max-w-screen-xl mt-10">
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-4">Upload a JSON file</h1>

    <form onSubmit={saveData}>
      <div className="mb-4">
        <label className="block text-gray-600 text-sm font-bold mb-2 mt-5">
          Name:
        </label>
        <input
          type="text"
          className="border-2 w-[80%] border-slate-200 m-2 px-3 py-2 shadow-sm rounded-md focus:outline-none focus:border-lime-400"
          value={name}
          onChange={handleType}
          placeholder="Enter a name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 text-sm font-bold mb-2">
          Select JSON file:
        </label>
        <input
          type="file"
          accept=".json"
          className="border-2 w-[80%] border-slate-200 m-2 px-3 py-2 shadow-sm rounded-md focus:outline-none focus:border-lime-400"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Upload Data
      </button>
    </form>

    {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
  </div>
</div>


  );
}

export default ProfilePage;
