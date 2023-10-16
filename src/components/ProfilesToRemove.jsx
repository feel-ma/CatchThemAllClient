import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import RenderToRemove from "./RenderProcessed";
import RenderTenRemove from "./RenderTenRemove";

const API_URL = process.env.REACT_APP_SERVER_URL;

function ProfilesToRemove({ jsons, fetchProjects, checkLimiter }) {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [listToRemove, setToRemove] = useState([]);
  const [IDprojects, setIDs] = useState(true);

  useEffect(() => {
    peopleToRemove();
  }, []);

   function peopleToRemove() {
    const people = [];
    const id = [];
    jsons.map((j) => {
      if (j.peopleAdded[1]) {
        people.push(...j.peopleAdded);
        id.push(j._id);
      }
    });
    setToRemove(people);
    setIDs(id);
  }

  return (
    <section className="h-[60%] mt-10  flex ">
      <div className=" max-w-[40%] min-w-[25%]  custom-right-border px-20 py-10 flex justify-center items-center">
        <button
          className="mx-10 my-5 text-xl custom-bottom-border hover:border-orange-300 focus:border-orange-300 "
          onClick={peopleToRemove}
        >
          Show me 10 profiles
        </button>
      </div>

      <div className="flex justify-center items-center ml-[10%] mt-5 max-w-[40%]">
        <RenderTenRemove
          files={listToRemove}
          pID={IDprojects}
          fetchProjects={fetchProjects}
          checkLimiter={checkLimiter}
        />
      </div>
    </section>
  );
}

export default ProfilesToRemove;
