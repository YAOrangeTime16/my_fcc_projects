export const allData = fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(res => res.json())
  .catch(err => console.log(err));
