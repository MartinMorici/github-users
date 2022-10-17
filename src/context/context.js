import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';
// - [Repos](https://api.github.com/users/john-smilga/repos?per_page=100)
// - [Followers](https://api.github.com/users/john-smilga/followers)

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  //request loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState({ show: false, msg: '' });

  //get user
  const searchUser = async (user) => {
    toggleError();
    setIsloading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((error) =>
      console.log(error)
    );
    if (response) {
      setGithubUser(response.data);
      //repos
      const resRepos = axios(`${rootUrl}/users/${user}/repos?per_page=100`)
      .then((response) => setRepos(response.data));
      //followers
      const resFollowers = axios(`${rootUrl}/users/${user}/followers`)
      .then((response) => setFollowers(response.data));

      await Promise.allSettled([resRepos, resFollowers]).then((results) => {
        console.log(results);
      });
    } else {
      toggleError(true, 'there is no username with that name');
    }
    checkRequests();
    setIsloading(false);
  };



  //check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let { remaining } = data.rate;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, 'You reached the daily request limit');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleError = (show = false, msg = '') => {
    setError({ show, msg });
  };

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{ githubUser, repos, followers, requests, error,isLoading, searchUser }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
