angular.module('mockedAPIResponse',[])
// 'sort-order=asc&page=1&count=5&city=sf'
.value('completeJSON', {
  "header": [
    {
      "key": "name",
      "name": "Name"
    },
    {
      "key": "star",
      "name": "star"
    },
    {
      "key": "sf-location",
      "name": "SF Location"
    }
  ],
  "rows": [
    {
      "name": "Ritual Coffee Roasters",
      "star": "★★★★★",
      "sf-location": "Hayes Valley"
    },
    {
      "name": "coffee bar",
      "star": "★★★★",
      "sf-location": "financial distric"
    },
    {
      "name": "blue bootle",
      "star": "★★★★★",
      "sf-location": "hayes valley"
    },
    {
      "name": "CoffeeShop",
      "star": "★★★",
      "sf-location": "Bernal Heights"
    },
    {
      "name": "Spike's Coffee & Teas",
      "star": "★★★",
      "sf-location": "Castro"
    }
  ],
  "pagination": {
    "count": 5,
    "page": 1,
    "pages": 7,
    "size": 35
  },
  "sort-order": "asc"
})
// sort-order=asc
.value('sortingJSON', {
  "header": [
    {
      "key": "name",
      "name": "Name"
    },
    {
      "key": "star",
      "name": "star"
    },
    {
      "key": "sf-location",
      "name": "SF Location"
    }
  ],
  "rows": [
    {
      "name": "Ritual Coffee Roasters",
      "star": "★★★★★",
      "sf-location": "Hayes Valley"
    },
    {
      "name": "coffee bar",
      "star": "★★★★",
      "sf-location": "financial distric"
    },
    {
      "name": "blue bootle",
      "star": "★★★★★",
      "sf-location": "hayes valley"
    },
    {
      "name": "CoffeeShop",
      "star": "★★★",
      "sf-location": "Bernal Heights"
    },
    {
      "name": "Spike's Coffee & Teas",
      "star": "★★★",
      "sf-location": "Castro"
    },
    {
      "name": "La Boulange",
      "star": "★★",
      "sf-location": "Cole Valley"
    },
    {
      "name": "Dynamo Donut and Coffee",
      "star": "★★★★★",
      "sf-location": "Cow Hollow"
    },
    {
      "name": "The Mill",
      "star": "★★★★",
      "sf-location": "Divisadero"
    },
    {
      "name": "Piccino Coffee Bar",
      "star": "★★★",
      "sf-location": "Dogpatch"
    },
    {
      "name": "Philz",
      "star": "★★★",
      "sf-location": "Downtown"
    },
    {
      "name": "Duboce Park Cafe",
      "star": "★★",
      "sf-location": "Duboce Triangle"
    },
    {
      "name": "Blue Bottle",
      "star": "★★★★★",
      "sf-location": "Embarcadero"
    },
    {
      "name": "Four Barrel",
      "star": "★★★",
      "sf-location": "Excelsior"
    },
    {
      "name": "Coffee Bar",
      "star": "★★★★★",
      "sf-location": "FiDi"
    },
    {
      "name": "Biscoff Coffee Corner",
      "star": "★★★",
      "sf-location": "Fisherman’s Wharf"
    },
    {
      "name": "Fifty/Fifty Coffee and Tea",
      "star": "★★★",
      "sf-location": "Inner Richmond"
    },
    {
      "name": "Beanery",
      "star": "★★★",
      "sf-location": "Inner Sunset"
    },
    {
      "name": "Cafe du Soleil",
      "star": "★★",
      "sf-location": "Lower Haight"
    },
    {
      "name": "Peet's",
      "star": "★",
      "sf-location": "The Marina"
    },
    {
      "name": "Sightglass",
      "star": "★★★★",
      "sf-location": "The Mission"
    },
    {
      "name": "Contraband Coffee Bar",
      "star": "★★★★",
      "sf-location": "Nob Hill"
    },
    {
      "name": "Martha & Bros Coffee",
      "star": "★★★",
      "sf-location": "Noe Valley"
    },
    {
      "name": "Réveille",
      "star": "★★★",
      "sf-location": "North Beach"
    },
    {
      "name": "Cup Coffee Bar",
      "star": "★★★",
      "sf-location": "Outer Mission"
    },
    {
      "name": "Garden House Cafe",
      "star": "★★★",
      "sf-location": "Outer Richmond"
    },
    {
      "name": "Andytown Coffee Roasters",
      "star": "★★★",
      "sf-location": "Outer Sunset"
    },
    {
      "name": "Jane on Fillmore",
      "star": "★★",
      "sf-location": "Pacific Heights"
    },
    {
      "name": "Saint Frank Coffee",
      "star": "★★★",
      "sf-location": "Polk"
    },
    {
      "name": "Farley’s",
      "star": "★★★",
      "sf-location": "Potrero Hill"
    },
    {
      "name": "House of Snacks",
      "star": "★★★",
      "sf-location": "The Presidio"
    },
    {
      "name": "The Brew",
      "star": "★★★",
      "sf-location": "Russian Hill"
    },
    {
      "name": "Wicked Grounds",
      "star": "★★★",
      "sf-location": "SOMA"
    },
    {
      "name": "farm:table",
      "star": "★★★",
      "sf-location": "Tenderloin"
    },
    {
      "name": "Starbucks",
      "star": "★",
      "sf-location": "Union Square"
    },
    {
      "name": "Flywheel Coffee Roasters",
      "star": "★★★★★",
      "sf-location": "Upper Haight"
    }
  ],
  "pagination": {
    "count": null,
    "page": null,
    "pages": null,
    "size": 35
  },
  "sort-order": "asc"
})
// page=1&count=5
.value('paginationJSON', {
  "header": [
    {
      "key": "name",
      "name": "Name"
    },
    {
      "key": "star",
      "name": "star"
    },
    {
      "key": "sf-location",
      "name": "SF Location"
    }
  ],
  "rows": [
    {
      "name": "Ritual Coffee Roasters",
      "star": "★★★★★",
      "sf-location": "Hayes Valley"
    },
    {
      "name": "coffee bar",
      "star": "★★★★",
      "sf-location": "financial distric"
    },
    {
      "name": "blue bootle",
      "star": "★★★★★",
      "sf-location": "hayes valley"
    },
    {
      "name": "CoffeeShop",
      "star": "★★★",
      "sf-location": "Bernal Heights"
    },
    {
      "name": "Spike's Coffee & Teas",
      "star": "★★★",
      "sf-location": "Castro"
    }
  ],
  "pagination": {
    "count": 5,
    "page": 1,
    "pages": 7,
    "size": 35
  }
})
// page=1&count=25
.value('paginationJSONCount25', {
  "header": [
    {
      "key": "name",
      "name": "Name"
    },
    {
      "key": "star",
      "name": "star"
    },
    {
      "key": "sf-location",
      "name": "SF Location"
    }
  ],
  "rows": [
    {
      "name": "Ritual Coffee Roasters",
      "star": "★★★★★",
      "sf-location": "Hayes Valley"
    },
    {
      "name": "coffee bar",
      "star": "★★★★",
      "sf-location": "financial distric"
    },
    {
      "name": "blue bootle",
      "star": "★★★★★",
      "sf-location": "hayes valley"
    },
    {
      "name": "CoffeeShop",
      "star": "★★★",
      "sf-location": "Bernal Heights"
    },
    {
      "name": "Spike's Coffee & Teas",
      "star": "★★★",
      "sf-location": "Castro"
    },
    {
      "name": "La Boulange",
      "star": "★★",
      "sf-location": "Cole Valley"
    },
    {
      "name": "Dynamo Donut and Coffee",
      "star": "★★★★★",
      "sf-location": "Cow Hollow"
    },
    {
      "name": "The Mill",
      "star": "★★★★",
      "sf-location": "Divisadero"
    },
    {
      "name": "Piccino Coffee Bar",
      "star": "★★★",
      "sf-location": "Dogpatch"
    },
    {
      "name": "Philz",
      "star": "★★★",
      "sf-location": "Downtown"
    },
    {
      "name": "Duboce Park Cafe",
      "star": "★★",
      "sf-location": "Duboce Triangle"
    },
    {
      "name": "Blue Bottle",
      "star": "★★★★★",
      "sf-location": "Embarcadero"
    },
    {
      "name": "Four Barrel",
      "star": "★★★",
      "sf-location": "Excelsior"
    },
    {
      "name": "Coffee Bar",
      "star": "★★★★★",
      "sf-location": "FiDi"
    },
    {
      "name": "Biscoff Coffee Corner",
      "star": "★★★",
      "sf-location": "Fisherman’s Wharf"
    },
    {
      "name": "Fifty/Fifty Coffee and Tea",
      "star": "★★★",
      "sf-location": "Inner Richmond"
    },
    {
      "name": "Beanery",
      "star": "★★★",
      "sf-location": "Inner Sunset"
    },
    {
      "name": "Cafe du Soleil",
      "star": "★★",
      "sf-location": "Lower Haight"
    },
    {
      "name": "Peet's",
      "star": "★",
      "sf-location": "The Marina"
    },
    {
      "name": "Sightglass",
      "star": "★★★★",
      "sf-location": "The Mission"
    },
    {
      "name": "Contraband Coffee Bar",
      "star": "★★★★",
      "sf-location": "Nob Hill"
    },
    {
      "name": "Martha & Bros Coffee",
      "star": "★★★",
      "sf-location": "Noe Valley"
    },
    {
      "name": "Réveille",
      "star": "★★★",
      "sf-location": "North Beach"
    },
    {
      "name": "Cup Coffee Bar",
      "star": "★★★",
      "sf-location": "Outer Mission"
    },
    {
      "name": "Garden House Cafe",
      "star": "★★★",
      "sf-location": "Outer Richmond"
    }
  ],
  "pagination": {
    "count": 25,
    "page": 1,
    "pages": 2,
    "size": 35
  }
})
// city=sf
.value('filtersJSON', {
  "header": [
    {
      "key": "name",
      "name": "Name"
    },
    {
      "key": "star",
      "name": "star"
    },
    {
      "key": "sf-location",
      "name": "SF Location"
    }
  ],
  "rows": [
    {
      "name": "Ritual Coffee Roasters",
      "star": "★★★★★",
      "sf-location": "Hayes Valley"
    },
    {
      "name": "coffee bar",
      "star": "★★★★",
      "sf-location": "financial distric"
    },
    {
      "name": "blue bootle",
      "star": "★★★★★",
      "sf-location": "hayes valley"
    },
    {
      "name": "CoffeeShop",
      "star": "★★★",
      "sf-location": "Bernal Heights"
    },
    {
      "name": "Spike's Coffee & Teas",
      "star": "★★★",
      "sf-location": "Castro"
    },
    {
      "name": "La Boulange",
      "star": "★★",
      "sf-location": "Cole Valley"
    },
    {
      "name": "Dynamo Donut and Coffee",
      "star": "★★★★★",
      "sf-location": "Cow Hollow"
    },
    {
      "name": "The Mill",
      "star": "★★★★",
      "sf-location": "Divisadero"
    },
    {
      "name": "Piccino Coffee Bar",
      "star": "★★★",
      "sf-location": "Dogpatch"
    },
    {
      "name": "Philz",
      "star": "★★★",
      "sf-location": "Downtown"
    },
    {
      "name": "Duboce Park Cafe",
      "star": "★★",
      "sf-location": "Duboce Triangle"
    },
    {
      "name": "Blue Bottle",
      "star": "★★★★★",
      "sf-location": "Embarcadero"
    },
    {
      "name": "Four Barrel",
      "star": "★★★",
      "sf-location": "Excelsior"
    },
    {
      "name": "Coffee Bar",
      "star": "★★★★★",
      "sf-location": "FiDi"
    },
    {
      "name": "Biscoff Coffee Corner",
      "star": "★★★",
      "sf-location": "Fisherman’s Wharf"
    },
    {
      "name": "Fifty/Fifty Coffee and Tea",
      "star": "★★★",
      "sf-location": "Inner Richmond"
    },
    {
      "name": "Beanery",
      "star": "★★★",
      "sf-location": "Inner Sunset"
    },
    {
      "name": "Cafe du Soleil",
      "star": "★★",
      "sf-location": "Lower Haight"
    },
    {
      "name": "Peet's",
      "star": "★",
      "sf-location": "The Marina"
    },
    {
      "name": "Sightglass",
      "star": "★★★★",
      "sf-location": "The Mission"
    },
    {
      "name": "Contraband Coffee Bar",
      "star": "★★★★",
      "sf-location": "Nob Hill"
    },
    {
      "name": "Martha & Bros Coffee",
      "star": "★★★",
      "sf-location": "Noe Valley"
    },
    {
      "name": "Réveille",
      "star": "★★★",
      "sf-location": "North Beach"
    },
    {
      "name": "Cup Coffee Bar",
      "star": "★★★",
      "sf-location": "Outer Mission"
    },
    {
      "name": "Garden House Cafe",
      "star": "★★★",
      "sf-location": "Outer Richmond"
    },
    {
      "name": "Andytown Coffee Roasters",
      "star": "★★★",
      "sf-location": "Outer Sunset"
    },
    {
      "name": "Jane on Fillmore",
      "star": "★★",
      "sf-location": "Pacific Heights"
    },
    {
      "name": "Saint Frank Coffee",
      "star": "★★★",
      "sf-location": "Polk"
    },
    {
      "name": "Farley’s",
      "star": "★★★",
      "sf-location": "Potrero Hill"
    },
    {
      "name": "House of Snacks",
      "star": "★★★",
      "sf-location": "The Presidio"
    },
    {
      "name": "The Brew",
      "star": "★★★",
      "sf-location": "Russian Hill"
    },
    {
      "name": "Wicked Grounds",
      "star": "★★★",
      "sf-location": "SOMA"
    },
    {
      "name": "farm:table",
      "star": "★★★",
      "sf-location": "Tenderloin"
    },
    {
      "name": "Starbucks",
      "star": "★",
      "sf-location": "Union Square"
    },
    {
      "name": "Flywheel Coffee Roasters",
      "star": "★★★★★",
      "sf-location": "Upper Haight"
    }
  ],
  "pagination": {
    "count": null,
    "page": null,
    "pages": null,
    "size": 35
  }
});