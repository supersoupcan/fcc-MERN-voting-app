import React, { Component } from 'react';

const Stats = ({data}) => {
  const votesInPolls = data.map(poll => {
    return (
      poll.options.map(option => option.votes.length)
      .reduce((sum, value) => sum + value, 0)
  )});
  const totalVotes = votesInPolls.reduce((sum, value) => sum + value, 0);
  const mostVotedOn = votesInPolls.reduce(
    (maxIndex, value, index, arr) => value > arr[maxIndex] ? index : maxIndex, 0
  );
  return(
    <div className="statistics">
      <h2>Statistics</h2>
      <p><b>Total Votes</b></p>
      <p>{totalVotes}</p>
      <p><b>Total Polls</b></p>
      <p> {data.length}</p>
      <p><b>Most Voted On Poll</b></p>
      <p>{data.length === 0 ? "None" : data[mostVotedOn].title}</p>
    </div>
  );
};

export default Stats;