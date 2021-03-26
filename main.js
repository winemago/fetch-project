
function getBlob(){    //using .then
    fetch('images/wave.svg')
    .then(response =>{                                   
        return response.blob();
    }).then(image =>{
        document.getElementById('img_header').src=URL.createObjectURL(image);
    });
}

async function getCsv(){   //using async/await
    // Data from: https://data.giss.nasa.gov/gistem  
    // Mean from: https://earthobservatory.nasa.gov/world-of-change/DecadalTemp                                 
    const response = await fetch('ZonAnn.Ts+dSST.csv');                      
    const data = await response.text();

    const year=[];
    const globalTemp=[];
    const northTemp=[];
    const southTemp=[];

    const columns = data.split('\n').slice(1);
    //console.log(columns);
    for(let i=0; i<columns.length; i++){
        const rows=columns[i].split(',');
        year.push(rows[0]);
        globalTemp.push(parseFloat(rows[1]) + 14 );                 //add 14, couse The global mean surface air temperature for that period was estimated to be 14°C
        northTemp.push(parseFloat(rows[2]) + 14 );
        southTemp.push(parseFloat(rows[3]) + 14 );

        console.log(rows[0],rows[1],rows[2],rows[3]);
    }
    return{year,globalTemp,northTemp,southTemp};
}      

async function chartIT(){
    const ctx = document.getElementById('chart').getContext('2d');
    const datatemps = await getCsv();
    console.log(datatemps);
    const myChart = new Chart(ctx, {
        type: 'line',                   //cake, circle, bar..
        data: {
            labels: datatemps.year,     ///x names
            datasets: [
            {
                label: 'GLOBAL AVERAGE TEMPERATURE',
                data: datatemps.globalTemp,
                borderWidth: 1,
                backgroundColor:'rgba(232, 123, 114, 11)',
                borderColor:'rgba(232,123,214,11)',
                hoverBorderColor: 'rgba(132, 23, 114, 11)',
                fill: false
            },
            {
                label: 'GLOBAL AVERAGE IN NORTH HEMISPHERE',
                data: datatemps.northTemp,
                borderWidth: 1,
                backgroundColor:'rgba(132, 223, 114, 11)',
                borderColor:'rgba(32,223,114,11)',
                hoverBorderColor: 'rgba(132, 23, 114, 11)',
                fill: false
            },
            {
                label: 'GLOBAL AVERAGE IN SOUTH HEMISPHERE',
                data: datatemps.southTemp,
                borderWidth: 1,
                backgroundColor:'rgba(032, 123, 214, 11)',
                borderColor:'rgba(5, 87, 243)',
                hoverBorderColor: 'rgba(132, 23, 114, 11)',
                fill: false
            }
        ]
        },
        options: {
            responsive: true,
            
            legend: {
                labels: {
                    fontColor: "beige",
                    fontSize: 13
                }
            },
            scales: {
                yAxes: [{
                    ticks: {                                    //ticks=names
                        ///beginAtZero: true,
                        fontColor: "white",
                        callback: function(value, index, values) {
                            return value + '°';                         
                        }

                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white"
                    }
                }]
            }
        }
    
    });
}

async function getSAT(){
    //init map
    const mymap = L.map('mapid').setView([0, 0], 1);
    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(mymap);

    // Making a marker with a custom icon
    const issIcon = L.icon({
      iconUrl: 'images/iss.png',
      iconSize: [60, 42],
      iconAnchor: [25, 16]
    });
    const marker = L.marker([0, 0], { icon: issIcon }).addTo(mymap);

    let firstTime = true;

    async function getISS() {
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      const data = await response.json();
      const { latitude, longitude } = data;

      marker.setLatLng([latitude, longitude]);
      if (firstTime) {
        mymap.setView([latitude, longitude], 2);
        firstTime = false;
      }
      document.getElementById('lat').textContent = latitude.toFixed(2);
      document.getElementById('lon').textContent = longitude.toFixed(2);
      document.getElementById('vel').textContent = data.velocity.toFixed(2);
      document.getElementById('alt').textContent = data.altitude.toFixed(2);
    }

    getISS();

    setInterval(getISS, 1000);
}

async function getApod(){

    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=0cymwPxbsjzfDJuYPaSucWz3gyY9Ra6Sq9bxITCe');
    const data = await response.json();
    
    document.getElementById('apod_a').href=data.url;
    document.getElementById('apod_img').src=data.url;
    document.getElementById('title').textContent = data.title;
    document.getElementById('copyr').textContent = data.copyright;
    document.getElementById('date').textContent = data.date;
    document.getElementById('explanation').textContent = data.explanation;
}  


