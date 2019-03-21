<<<<<<< HEAD
$(document).ready(function(){

var CHART = document.getElementById("lineChart");
console.log(CHART);
lineChart = new CHART(CHART, {
  type: 'line',
  data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"]
      datasets: [
          {
              label: "my first dataset",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba (75, 192, 192, 0.4)",
              borderColor: "rgba (75, 192, 192, 1)",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "rgba(75, 192, 192, 1)",
              pointBackgroundColor: "#ffff",
              pointBackgroundWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba (220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [65, 59, 80, 81, 56, 55, 40],

          }
      ]
  }  
})


})
=======
$(document).ready(function() {});

>>>>>>> 8e9f1f5df1171d60d5257e90d6414cde6dcdb754
