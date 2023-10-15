import React, { useEffect, useState,useContext  } from 'react';
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import RenderTen from './Renderten';



function ProfilesToAdd ({jsons,setpID,pID, fetchProjects, checkLimiter   }){

    const [list, setList] =useState([])
    const [toggleSelector, setToggle] = useState(false)


    function listSelector(file, pID){


        

        setList(file)
        setpID(pID)
        //console.log(list)
        if(!toggleSelector) setToggle(!toggleSelector)
   
     }


    return(
        <section className='h-[60%] mt-10  flex '>

            <div className='max-w-[40%] min-w-[25%] max-h-[40%] min-h-[30%] custom-right-border px-20 py-2 flex justify-center items-center flex-col '>

         
                  {jsons.map((file)=>(
        <div className='' key={file._id}>

        <button className='mx-10 my-5 text-xl custom-bottom-border hover:border-orange-300 focus:border-orange-300 capitalize' onClick={() => listSelector(file.file, file._id)}>{file.name}</button>


          </div>
      ))}

        </div>

        <div className='flex justify-center items-center ml-[15%] max-w-[40%]'>
        {toggleSelector ? <RenderTen files={list} pID={pID} checkLimiter={checkLimiter} fetchProjects={fetchProjects}/> : null }
        </div>

     

        </section>
    )
}

export default ProfilesToAdd