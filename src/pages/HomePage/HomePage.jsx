import "./HomePage.css";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import ProfilesToAdd from "../../components/ProfilesToAdd";
import ProfilesToRemove from "../../components/ProfilesToRemove";

const API_URL = process.env.REACT_APP_SERVER_URL;

function HomePage() {
  const { user } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState(undefined);
  const [jsons, setJesons] = useState([]);
  const [fetchedUser, setFetchedUser] = useState("");
  const [toggleSelector, setToggle] = useState(false);
  const [pID, setpID] = useState("");
  const [limiter, setLimiter] = useState(0);
  const [limitReched, setLimitReched] = useState(true);
  const [timeHasPassed, setTime] = useState(true);
  const [showToAdd, setShowToAdd] = useState(false);
  const [showToRemove, setShowToRemove] = useState(false);
  const [showTimeLeft, setShowTimeLeft] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [stopCount, setStopCount] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProjects();
      await fetchUser();
      await checkTime();
      await checkDay();
    };

    fetchData();
  }, [user]);

  function checkDay() {
    const date = new Date();
    const day = date.toLocaleString("en-US", { weekday: "long" }); // Full day name (e.g., Wednesday)
    const month = date.toLocaleString("en-US", { month: "long" }); // Full month name (e.g., October)
    const dayOfMonth = date.getDate(); // Day of the month (e.g., 4)
    const year = date.getFullYear(); // Full year (e.g., 2023)

    const weekStart = fetchedUser.weekStart;
    const firstSub = dayOfMonth - weekStart;
    let resultSub = firstSub;

    if (firstSub < 0) {
      resultSub = dayOfMonth + 30 - weekStart;
    }

    console.log(fetchedUser.lastDayOnline);
    console.log("Day of the Month:", resultSub);
    console.log(fetchUser);

    if (
      (fetchedUser.lastDayOnline != dayOfMonth || !fetchedUser.lastDayOnline) &&
      fetchedUser
    ) {
      console.log("IF DAY");
      const requestBody = {
        owner: fetchedUser._id,
        user: fetchedUser,
        dayOfMonth,
      };

      const authToken = localStorage.getItem("authToken");
      axios
        .put(`${API_URL}api/time/day`, requestBody, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setErrorMessage(null);
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage("Failed to create Date.");
        });
    } else {
      console.log("ELSEEEE day");
    }

    if ((!fetchedUser.weekStart || resultSub > 7) && fetchedUser) {
      console.log("IF WEEK");
      const requestBody = {
        owner: fetchedUser._id,
        user: fetchedUser,
        dayOfMonth,
      };

      const authToken = localStorage.getItem("authToken");
      axios
        .put(`${API_URL}api/time/weekstart`, requestBody, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setErrorMessage(null);
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage("Failed to create Date.");
        });
    } else {
      console.log("ELSEEEE week");
    }

    if ((!fetchedUser.month || fetchedUser.month != month) && fetchedUser) {
      console.log("IF MONTH");

      const lastMonthTotal = fetchedUser.actionsMonth;

      const requestBody = {
        owner: fetchedUser._id,
        user: fetchedUser,
        month,
        lastMonthTotal,
        year,
      };

      const authToken = localStorage.getItem("authToken");
      axios
        .put(`${API_URL}api/time/month`, requestBody, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setErrorMessage(null);
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage("Failed to create Date.");
        });
    } else {
      console.log("ELSEEEE month");
    }
  }

  function checkLimiter() {
    console.log("limitechecked");

    fetchProjects();
    fetchUser();

    let count = 0;

    jsons.map((j) => {
      count += j.count;
    });

    count += fetchedUser.removedCount;

    if (count >= 10 || stopCount == true) {
      if (fetchedUser.removedLimitAlert == false) {
        setLimitReched(true);
        setTime(false);
        const currentTime = new Date().getTime();
        localStorage.setItem("lastActionTime", currentTime);

        const requestBody = {
          howMany: count,
        };

        const authToken = localStorage.getItem("authToken");
        axios
          .put(`${API_URL}api/user/limitreached`, requestBody, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then((response) => {})
          .catch((error) => {
            console.error(error);
            setErrorMessage("Failed to set Limiter.");
          });
      }

      fetchUser();
    }

    setLimiter(count);
  }

  function checkTime() {
    fetchUser();
    const lastActionTime = parseInt(localStorage.getItem("lastActionTime"));
    const currentTime = new Date().getTime();
    const hourInMillis = 60 * 60 * 1000; // 1 hour in milliseconds

    console.log(lastActionTime);
    console.log(currentTime);

    const timeDifference = hourInMillis - (currentTime - lastActionTime);
    const minutesLeft = Math.floor(timeDifference / (60 * 1000));
    const secondsLeft = Math.floor((timeDifference % (60 * 1000)) / 1000);

    setMinutesLeft(minutesLeft);
    setSecondsLeft(secondsLeft);

    if (currentTime - lastActionTime >= hourInMillis || !lastActionTime) {
      setTime(true);
      console.log("time has passed");
      //setLimiter(0)
      resetCount();
      setShowTimeLeft(false);
      setStopCount(false);

      const requestBody = {};

      const authToken = localStorage.getItem("authToken");
      axios
        .put(`${API_URL}api/user/resetlimit`, requestBody, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          fetchUser();
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage("Failed to create note.");
        });
    } else {
      setTime(false);
      setShowTimeLeft(true);
      console.log("time not passed");
      console.log(
        `Time left: ${minutesLeft} minutes and ${secondsLeft} seconds`
      );
    }
  }

  const fetchProjects = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}api/jsons`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setJesons(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}api/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setFetchedUser(response.data);

      //console.log("fetchtry User",response.data)
    } catch (error) {
      console.error(error);
    }
  };

  function resetCount() {
    const requestBody = {};

    const authToken = localStorage.getItem("authToken");
    axios
      .put(`${API_URL}api/jsons/resetcounter`, requestBody, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        fetchProjects();
        setErrorMessage(null);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Failed to reset Counter.");
      });
  }

  function showADD() {
    setShowToAdd(!showToAdd);
    setShowToRemove(false);
  }

  function showRemove() {
    setShowToRemove(!showToRemove);
    setShowToAdd(false);
  }

  function stopHere() {
    setStopCount(true);
  }

  return (
    <div className="h-screen">
      {fetchedUser &&
        (fetchedUser.removedLimitAlert ? null : (
          <div className="mt-10 custom">
            <div className="flex items-center justify-center">
              <button
                className="mx-5 bg-lime-400 p-10 rounded-2xl text-xl text-white font-bold border-2 border-gray hover:border-orange-300 shadow-sm focus:border-orange-300"
                onClick={showADD}
              >
                Show Profiles to Add
              </button>
              <button
                className="mx-5 bg-lime-400 p-10 rounded-2xl text-xl text-white font-bold border-2 border-gray hover:border-orange-300 shadow-sm focus:border-orange-300"
                onClick={showRemove}
              >
                Show Profiles to Remove
              </button>
              <button
                className="mx-5 bg-lime-400 p-10 rounded-2xl text-xl text-white font-bold border-2 border-gray hover:border-orange-300 shadow-sm focus:border-orange-300"
                onClick={stopHere}
              >
                Stop Here
              </button>
            </div>

            {showToAdd && (
              <ProfilesToAdd
                jsons={jsons}
                setpID={setpID}
                pID={pID}
                fetchProjects={fetchProjects}
                checkLimiter={checkLimiter}
              />
            )}
            {showToRemove && (
              <ProfilesToRemove
                jsons={jsons}
                setpID={setpID}
                pID={pID}
                fetchProjects={fetchProjects}
                checkLimiter={checkLimiter}
              />
            )}
          </div>
        ))}

      <div>
        {fetchedUser &&
          (fetchedUser.removedLimitAlert ? null : (
            <div className=" mt-10">
              <div className="">The limiter is saying {limiter}</div>
              <button
                className=" mt-4 px-4 py-2 bg-red-400 rounded-full mx-5 text-white font-bold"
                onClick={checkLimiter}
              >
                CHECK
              </button>
            </div>
          ))}

        {limitReched && (
          <div>
            {timeHasPassed ? (
              <div className="text-xl mt-4">
                YES, you can go (reload if you see nothing)
              </div>
            ) : (
              <div className="text-xl mt-16"> NO, you have to wait</div>
            )}

            {timeHasPassed ? null : (
              <div>
                {showTimeLeft && (
                  <div className="text-xl mt-5">
                    {" "}
                    Time left: {minutesLeft} minutes and {secondsLeft} seconds
                  </div>
                )}

                <button
                  className="px-4 py-2 mt-4 bg-red-400 rounded-full mx-5 text-white"
                  onClick={checkTime}
                >
                  {" "}
                  Can I go?
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2 className="mt-2">
          How many Actions Last Time: {fetchedUser.lastActionsCount}{" "}
        </h2>
        <h2 className="mt-2">
          How many Actions Today: {fetchedUser.actionsDay}{" "}
        </h2>
        <button
          className=" mt-3 px-3 py-2 bg-red-400 rounded-full mx-5 text-white"
          onClick={checkDay}
        >
          {" "}
          CheckDay?
        </button>
      </div>
    </div>
  );
}

export default HomePage;
