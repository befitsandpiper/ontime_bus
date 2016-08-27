/*

Problem:  We need to track on-time performance for shuttles
in our system. Shuttle operators need their shuttles to be on
time consistently, so their customers remain happy! ;)

Below you will find a sample of how some of the data may be structured.

- A route is a collection of stops in a certain order, with a
collection of rides (basically a schedule for the route).

- Assignments are for assigning drivers and vehicles to specific routes and
rides so we know how to track which stops a vehicle should be at and at 
what time.

- The arrivals collection is for logging when a shuttle successfully lands
in a scheduled stop, and determining on-time performance.

- We have provided a vehicle collection that also contains the
current location, current stop that shuttle is at, as well as its next stop.

- We have also provided a sample of what the geolocation data looks like
when a device sends it to our server.

Your task: Write a function for accepting the geolocation data, and
determining whether or not a shuttle is arriving at a stop on time, 
determining its next stop, and also whether or not it arrived at its 
stop on time.

Assume that you have a pre-existing "mocked" library for determining if a given
lat/long resides within a geofence for a given stop.

Something to think about:

What happens if a shuttle "skips" a stop, due to some sort of technical
malfunction (the device/application crashed/rebooted)? The function/algorithm
should get itself "back on track".

** Feel free to alter any of the data below, it is meant to jumpstart the
process. Please comment your code and explain it in detail.

*/

const stops = [
  {
    id: 0,
    title: 'Stop 0',
    description: 'The corner of x and y',
    latitude: 45.23432,
    longitude: -48.23423
  },
  {
    id: 1,
    title: 'Stop 1',
    description: 'The corner of x and y',
    latitude: 46.2,
    longitude: -47.0
  },
  {
    id: 2,
    title: 'Stop 2',
    description: 'The corner of x and y',
    latitude: 48.5,
    longitude: -50.3
  },
  {
    id: 3,
    title: 'Stop 3',
    description: 'The corner of x and y',
    latitude: 52.1,
    longitude: -39.9
  },
];

const routes = [
  {
    id: 0,
    stops: [1, 4, 3, 2],
    days: [1, 3, 5],
    rides: [
      {
        id: 100,
        times: ['9:00am', '9:30am', '10:00am', '10:30am']
      },
      {
        id: 101,
        times: ['9:15am', '9:45am', '10:15am', '10:45am']
      },
      {
        id: 102,
        times: ['9:30am', '10:00am', '10:30am', '11:00am']
      },
    ]
  },
  {
    id: 1,
    stops: [2, 4, 3, 1],
    days: [2, 5, 6],
    rides: [
      {
        id: 100,
        times: ['9:00am', '9:30am', '10:00am', '10:30am']
      },
      {
        id: 101,
        times: ['9:15am', '9:45am', '10:15am', '10:45am']
      },
      {
        id: 102,
        times: ['9:30am', '10:00am', '10:30am', '11:00am']
      },
    ]
  },
];

const drivers = [
  {
    id: 0,
    name: 'Mark',
  },
  {
    id: 1,
    name: 'Bob',
  }
];

let vehicles = [
  {
    id: 0,
    name: 'Vehicle #1',
    deviceId: 'acb1234',
    currentLocation: {
      latitude: 45.23432,
      longitude: -48.23423,
    },
    //index in routes.stops of next stop:
    nextStop: 2,
  },
  {
    id: 1,
    name: 'Vehicle #2',
    deviceId: 'abc5678',
    currentLocation: {
      latitude: 45.23432,
      longitude: -48.23423,
    },
    //index in routes.stops of next stop:
    nextStop: 2,
  },
];

const assignments = [
   {
     route: 1,
     ride: 100,
     driver: 0,
     vehicle: 0,
   },
  {
     route: 0,
     ride: 101,
     driver: 1,
     vehicle: 1,
    }
];

// An example of what an "arrival" might look like.

let arrivals = [
  {
    id: 0,
    driver: 0,
    route: 0,
    ride: 100,
    vehicle: 0,
    time: '9:00am', //most likely an actual ISO/UTC date string
    onTime: true,
  }
];

let errors = [
  {
    id: 0,
    numStopsSkipped: 1,
    //startStop: 1,
    //newStop: 3,
  },
];

// sample geolocation data

/* This would be incoming to the backend from the devices, the backend would check to see if it resides in one of the many stops.
   If it resided in a stop, the backend would then check assignments and check to see if this driver should be at that stop and mark it in the arrivals and if it was on time or not.
*/

const geolocationData = [
  {
    vehicle: 0,
    driver: 0,
    latitude: 45.23432,
    longitude: -48.23423,
    time: '9:00am', //most likely an actual ISO/UTC date string,
    // a bunch of other data like heading, speed, etc.
  },
];

// sample geolocation data;

function arriving(geolocationData) {

  //need to check current stop based on location data against vehicles current stop:
  //first we get currentStop based on latitude and longitude,
  //and we get the route and ride from the routes data object:
  let currentStop = 0;
  let routenum = 0;
  let globroute = {};
  let routestops = [];
  let ridenum = 0;
  let globride = {}; 

  let geohour = -1;
  let geomin = -1;

  for (var val of stops) {
    if ((val.latitude === geolocationData[0].latitude) && (val.longitude === geolocationData[0].longitude)) {
      currentStop = val.id;
      break;
    }
  }

  for (var val of assignments) {
    if (val.vehicle === geolocationData[0].vehicle) {
      routenum = val.route;
      ridenum = val.ride;
    }
  }
  //console.log(`route num: ${routenum}`);
  //console.log(`ridenum: ${ridenum}`);

  globroute = routes[routenum];
  globride = globroute.rides[ridenum-100].times;
  //console.log(`globride: ${globride}`);
  routestops = globroute.stops;

  //parse hour and minute data from geolocation data:
  if (geolocationData[0].time.substr(1,1) === ':') {
    geohour = Number(geolocationData[0].time.substr(0,1));
    geomin = Number(geolocationData[0].time.substr(2,2));
  } else if (geolocationData.time[0].substr(2,1) === ':') {
    geohour = Number(geolocationData[0].time.substr(0,2));
    geomin = Number(geolocationData[0].time.substr(3,2));
  }

  let presetStop = vehicles[geolocationData[0].vehicle].nextStop;

  let stopsMissed = 0;
  //console.log (`currentStopindex: ${currentStop}`);
  //console.log (`presetStopindex: ${presetStop}`);
  console.log (`presetStop: ${routestops[presetStop]}`);
  console.log (`currentStop: ${routestops[currentStop]}`);
  if (currentStop != presetStop) {
    stopsMissed = (currentStop+routestops.length - presetStop) % routestops.length;
    //console.log (`stopsMissed: ${stopsMissed}`);
    //currentStop = presetStop;
  }

  //log errors for missed stops:
  if (stopsMissed > 0) {
    let newError = {
      id: 1,
      numStopsSkipped: stopsMissed,
    }
    console.log(`stop sync error occured. ${stopsMissed} stops skipped.`);
    // log a message to console, perhaps log an error in an error object...
  };


  //if they are the same, check time and use next stop from vehicles:
  //current stop set in the vehicles data object:
    //will hold nextStop to be set after presetStop is reached:
    let routeNextStop = currentStop + 1 % globride.length;
    //if they are the same we check the time, check the route and update vehicles values and add a new log to arrivals:

      //parse hour and minute data from route:
    // let i=0;
    // for (var val of routestops) {
    //    if (val === currentStop) {
    //      break;
    //    }
    //    i++;
    //  }
    //  i = i % routestops.length;
    //console.log(`i: ${i}`);
    //next stop from route.stops:
    //routeNextStop = routestops[(i+1) % globride.length];
    //console.log(`prevstop: ${routestops[currentStop]}`);
    //console.log(`nextstop: ${routestops[routeNextStop]}`);

    //parse time from ride.times:
    let currtime = globride[currentStop];
    //console.log(`currtime: ${currtime}`);
    let currhour = -1;
    let currmin = -1;

    if (currtime.substr(1,1) === ':') {
      currhour = Number(currtime.substr(0,1));
      currmin = Number(currtime.substr(2,2));
    } else if (currtime.substr(2,1) === ':') {
      currhour = Number(currtime.substr(0,2));
      currmin = Number(currtime.substr(3,2));
    }

    //push newArrival to arrivals:
    if ((currhour > geohour) || ((currhour === geohour) && (currmin > geomin))){
      let newArrival = {
        id: 2,
        driver: geolocationData[0].driver,
        route: globroute.id,
        ride: ridenum,
        vehicle: geolocationData[0].vehicle,
        time: `${geohour}:${geomin}am`, //most likely an actual ISO/UTC date string
        onTime: true,
      }
      console.log(`Bus on time. Next is stop ${routestops[routeNextStop]}`);
      newArrival = arrivals.push(newArrival);
    } else {
      let newArrival = {
        id: 2,
        driver: geolocationData[0].driver,
        route: globroute.id,
        ride: ridenum,
        vehicle: geolocationData[0].vehicle,
        time: `${geohour}:${geomin}am`, //most likely an actual ISO/UTC date string
        onTime: false,
      }
      console.log(`Bus late. Next is stop ${routestops[routeNextStop]}`);
      newArrival = arrivals.push(newArrival);
    }

    //reset vehicles values:
    //vehicles[geolocationData.vehicle - 1].currentStop = presetStop;
    vehicles[geolocationData[0].vehicle].nextStop = routeNextStop;
    vehicles[geolocationData[0].vehicle].currentLocation.latitude = geolocationData.latitude;
    vehicles[geolocationData[0].vehicle].currentLocation.longitude = geolocationData.longitude;
  //}
}

arriving(geolocationData);