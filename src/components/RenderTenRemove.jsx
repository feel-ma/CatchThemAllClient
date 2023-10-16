import React from "react";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = process.env.REACT_APP_SERVER_URL;

function RenderTenRemove({ files, pID, fetchProjects, checkLimiter }) {
  const [ten, pickTen] = useState([]);
  const [howMany, setHowMany] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { user } = useContext(AuthContext);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const firstTen = files.slice(0, 10);

    console.log(files);

    pickTen(firstTen);
  }, [files]);

  const handleCount = (e) => {
    setHowMany(e.target.value);
  };

  async function handleSubmit(e) {
    console.log(user._id);
    e.preventDefault();

    const requestBody = {
      owner: user._id,
      howMany,
      pID: pID[0],
    };

    const authToken = localStorage.getItem("authToken");
    axios
      .put(`${API_URL}api/jsonspeopleremoved`, requestBody, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setErrorMessage(null);
        pickTen([]);
        fetchProjects();
        checkLimiter();
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Failed to submit Profiles.");
      });
  }

  function openAll() {
    if (count > 9) {
      return;
    } else {
      window.open(ten[count].profileUrl, "_blank");
      setCount(count + 1);
    }
  }

  function resetCount() {
    setCount(0);
  }

  return (
    <section className="max-w-[60%] ml-20 text-center">
      <div>
        {ten.map((profile) => (
          <div className="m-1 " key={profile.id}>
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-left"
            >
              {profile.profileUrl}
            </a>
          </div>
        ))}

        <div className="mt-10">
          {count < 10 ? (
            <button
              onClick={openAll}
              className=""
              title="CTRL+click to open links in a new tab"
            >
              Open all
            </button>
          ) : (
            <div>
              <p>You have already opened all available links.</p>
              <button onClick={resetCount}>OK</button>
            </div>
          )}
        </div>

        <form className="mt-10" onSubmit={handleSubmit}>
          <label className="text-lg mr-5">How many Removed?</label>

          <select
            value={howMany}
            onChange={handleCount}
            className=" bg-lime-100 b-5 focus:border-red-500"
          >
            <option value="">-</option>
            <option value="0">0</option>
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

          <button
            className="mx-5 my-4 p-3 rounded-full bg-slate-200"
            type="submit"
          >
            Save removed
          </button>
        </form>
      </div>
    </section>
  );
}

export default RenderTenRemove;
