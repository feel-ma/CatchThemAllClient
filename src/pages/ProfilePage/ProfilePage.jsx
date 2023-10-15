import React, { useEffect, useState,useContext  } from 'react';
import { AuthContext } from "../../context/auth.context";
import axios from "axios";

const API_URL =  process.env.REACT_APP_SERVER_URL;


function ProfilePage() {

  const [fetchedUser,setFetchedUser] =useState("")
  const [totalAdded, setTotalAdded] =useState(0)
  const [loading, isLoading] = useState(true)
  const [moreStats, showMoreStats] = useState(false)

  useEffect(() => {
    fetchUser()
    total()
  }, [totalAdded]);

  const fetchUser = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setFetchedUser(response.data);
      isLoading(false)
      //console.log("fetchtry User",response.data)
    } catch (error) {
      console.error(error);
    }
  };

  function total(){

    let total= 0

    if(fetchedUser){ 
      fetchedUser.monthlyResults.map((m) =>{
        total+=m.total
       
      })
  }
   
    setTotalAdded(total)
  }

  function showMore(){
    showMoreStats(!moreStats)
  }



  return (  
    <> 
      {loading ? (
        <div>loading</div>
      ) : (
        <div >

          <div className='flex justify-evenly mt-10'>
          <div className='m-10 rounded-lg h-[10rem] w-[300px] shadow-xl ring-1 ring-slate-900/5 flex flex-col items-center justify-center '>
          <h2 className='text-center font-medium tracking-tight'>How many Actions Today:</h2>
          <h1 className='text-center p-3 font-extrabold text-3xl'> {fetchedUser.actionsDay} </h1>

          </div>

          <div className='m-10 rounded-lg w-[300px]  h-[10rem] shadow-xl ring-1 ring-slate-900/5 flex flex-col items-center justify-center '>

          <h2 className='text-center font-medium tracking-tight'>How many Actions this Week:</h2>
          <h1 className='text-center p-3 font-extrabold text-3xl'> {fetchedUser.actionsWeek}</h1>

          </div>

          <div className='m-10 rounded-lg w-[300px]  h-[10rem] shadow-xl ring-1 ring-slate-900/5 flex flex-col items-center justify-center '>

          <h2 className='text-center font-medium tracking-tight'>How many Actions this Month:</h2>
          <h1 className='text-center p-3 font-extrabold text-3xl'>{fetchedUser.actionsMonth}</h1>


          </div>
          </div>
          
         
          
         

          <button onClick={showMore} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"> Show more Stats</button>
          {moreStats &&  <div> <div className='p-10 mx-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4' > 
          {fetchedUser.monthlyResults.map((m) => (
            <div key={m.month}  className=' rounded-lg h-[10rem] w-[80%] shadow-md ring-1 ring-slate-900/5 flex flex-col items-center justify-center '>
              <h1 className='text-center font-medium tracking-tight'>{m.month}</h1>
              <h1 className='text-center p-3 font-extrabold text-3xl'>{m.total}</h1>
            </div>
          ))}
          

          </ div >



          <h2 className='mt-5 text-2xl text-red-600'>Total profile processed: {totalAdded}!!</h2>

          </div>}


         
        </div>
      )
      }
    </>
  );
  
 
  
}

export default ProfilePage;
