import React from 'react';
import { useContext } from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';

const Repos = () => {
  const { repos } = useContext(GithubContext);

  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) return total;
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language].value = total[language].value + 1;
      total[language].stars = total[language].stars + stargazers_count;
    }
    return total;
  }, {});

  
  const mostPopular = repos.sort((a,b) => {
    return b.stargazers_count - a.stargazers_count;
  }).map(repo => {
    return {
      label: repo.name,
      value: repo.stargazers_count
    }
  }).slice(0,5);

  const mostForks = repos.sort((a,b) => {
    return b.forks_count - a.forks_count;
  }).map(repo => {
    return {
      label: repo.name,
      value: repo.forks_count
    }
  }).slice(0,5);


  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  const mostStars = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars };
    })
    .slice(0, 5);

  const chartData = [
    {
      label: 'HTML',
      value: '13',
    },
    {
      label: 'JavaScript',
      value: '23',
    },
    {
      label: 'CSS',
      value: '15',
    },
  ];

  return (
    <section className='section'>
      <Wrapper className='section-center'>
        <Pie3D data={mostUsed} />
        <Column3D data={mostPopular}></Column3D>
        <Doughnut2D data={mostStars} />
        <Bar3D data={mostForks}/>
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
