import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = ({numJokesToGet = 5}) => {

    //we want the jokes to be an array
    const [jokes, setJokes] = useState([]);
    //isLoading starts with true
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
    async function getJokes() {
        let j = [...jokes];
        let seenJokes = new Set();
        try {
          while (j.length < numJokesToGet) {
            let res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" }
            });
            let { ...jokeObj } = res.data;
  
            if (!seenJokes.has(jokeObj.id)) {
              seenJokes.add(jokeObj.id);
              j.push({ ...jokeObj, votes: 0 });
            } else {
              console.error("duplicate found!");
            }
          }
          setJokes(j);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
        //if no jokes are present, fetch them
        if (jokes.length === 0) getJokes();
    }, [jokes, numJokesToGet]);
  

    function generateNewJokes(){
        setJokes([]);
        setIsLoading(false)
    }
    function getVotes(id, num){
        setJokes(jokes => jokes.map(
            j => (j.id === id? {...j, votes: j.votes + num } : j))
        );
        // let localJokes = JSON.parse(window.localStorage.getItem("jokes"));
        // let newLocalJokes = localJokes.map(j => (j.id === id ? { ...j, votes: j.votes + num } : j ));
        // window.localStorage.setItem("jokes", JSON.stringify(newLocalJokes));
    }
    //we can reset the votes whenever we refresh the page
    function resetVotes() {
      setJokes(allJokes => ({
          jokes: allJokes.jokes.map(j => ({ ...j, votes: 0 }))
      }));
      window.localStorage.clear();
    };
    
    //now, if isLoading is true, then we load the jokes
    if (isLoading) {
        return (
          <div className="loading">
            <i className="fas fa-4x fa-spinner fa-spin" />
          </div>
          )
    }
    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

    return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={generateNewJokes}>
            Get New Jokes
            </button>
    
          {sortedJokes.map(({joke, id, votes}) => (
            <Joke text={joke} key={id} id={id} votes={votes} vote={getVotes} />
          ))}
        </div>
      );
}
export default JokeList;