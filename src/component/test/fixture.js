angular.module('mockedAPIResponse',[])
// 'sort-by=name&sort-order=asc&page=1&count=5'
.value('completeJSON', {
  'header': [
    {
      'key': 'name',
      'name': 'Name',
      'style': { 'width' : '50%' }
    },
    {
      'key': 'star',
      'name': 'Star',
      'style': { 'width' : '20%' },
      'class': ['text-right']
    },
    {
      'key': 'sf-location',
      'name': 'SF Location',
      'style': { 'width' : '30%' }
    }
  ],
  'rows': [
    {
      'name': 'Andytown Coffee Roasters',
      'star': '★★★',
      'sf-location': 'Outer Sunset'
    },
    {
      'name': 'Beanery',
      'star': '★★★',
      'sf-location': 'Inner Sunset'
    },
    {
      'name': 'Biscoff Coffee Corner',
      'star': '★★★',
      'sf-location': 'Fisherman’s Wharf'
    },
    {
      'name': 'Blue Bottle',
      'star': '★★★★★',
      'sf-location': 'Hayes Valley'
    },
    {
      'name': 'Blue Bottle',
      'star': '★★★★★',
      'sf-location': 'Embarcadero'
    }
  ],
  'pagination': {
    'count': 5,
    'page': 1,
    'pages': 7,
    'size': 34
  },
  'sortBy': 'name',
  'sortOrder': 'asc'
})
// sort-by=name&sort-order=asc
.value('sortingJSON', {
  'header': [
    {
      'key': 'name',
      'name': 'Name',
      'style': { 'width' : '50%' }
    },
    {
      'key': 'star',
      'name': 'Star',
      'style': { 'width' : '20%' },
      'class': ['text-right']
    },
    {
      'key': 'sf-Location',
      'name': 'SF Location',
      'style': { 'width' : '30%' }
    }
  ],
  'rows': [
    {
      'name': 'Andytown Coffee Roasters',
      'star': '★★★',
      'sf-Location': 'Outer Sunset'
    },
    {
      'name': 'Beanery',
      'star': '★★★',
      'sf-Location': 'Inner Sunset'
    },
    {
      'name': 'Biscoff Coffee Corner',
      'star': '★★★',
      'sf-Location': 'Fisherman’s Wharf'
    },
    {
      'name': 'Blue Bottle',
      'star': '★★★★★',
      'sf-Location': 'Hayes Valley'
    },
    {
      'name': 'Blue Bottle',
      'star': '★★★★★',
      'sf-Location': 'Embarcadero'
    },
    {
      'name': 'Cafe du Soleil',
      'star': '★★',
      'sf-Location': 'Lower Haight'
    },
    { 
      'name': 'Dimmi Tutto Cafe', 
      'star': '★★★', 
      'sf-Location': 'North Beach' 
    },
    {
      'name': 'Coffee Bar',
      'star': '★★★★★',
      'sf-Location': 'FiDi'
    },
    {
      'name': 'CoffeeShop',
      'star': '★★★',
      'sf-Location': 'Bernal Heights'
    },
    {
      'name': 'Contraband Coffee Bar',
      'star': '★★★★',
      'sf-Location': 'Nob Hill'
    },
    {
      'name': 'Cup Coffee Bar',
      'star': '★★★',
      'sf-Location': 'Outer Mission'
    },
    {
      'name': 'Duboce Park Cafe',
      'star': '★★',
      'sf-Location': 'Duboce Triangle'
    },
    {
      'name': 'Dynamo Donut and Coffee',
      'star': '★★★★★',
      'sf-Location': 'Cow Hollow'
    },
    {
      'name': 'Farley’s',
      'star': '★★★',
      'sf-Location': 'Potrero Hill'
    },
    {
      'name': 'Fifty/Fifty Coffee and Tea',
      'star': '★★★',
      'sf-Location': 'Inner Richmond'
    },
    {
      'name': 'Flywheel Coffee Roasters',
      'star': '★★★★★',
      'sf-Location': 'Upper Haight'
    },
    {
      'name': 'Four Barrel',
      'star': '★★★',
      'sf-Location': 'Excelsior'
    },
    {
      'name': 'Garden House Cafe',
      'star': '★★★',
      'sf-Location': 'Outer Richmond'
    },
    {
      'name': 'House of Snacks',
      'star': '★★★',
      'sf-Location': 'The Presidio'
    },
    {
      'name': 'Jane on Fillmore',
      'star': '★★',
      'sf-Location': 'Pacific Heights'
    },
    {
      'name': 'La Boulange',
      'star': '★★',
      'sf-Location': 'Cole Valley'
    },
    {
      'name': 'Martha & Bros Coffee',
      'star': '★★★',
      'sf-Location': 'Noe Valley'
    },
    {
      'name': 'Peet\'s',
      'star': '★',
      'sf-Location': 'The Marina'
    },
    {
      'name': 'Philz',
      'star': '★★★',
      'sf-Location': 'Downtown'
    },
    {
      'name': 'Piccino Coffee Bar',
      'star': '★★★',
      'sf-Location': 'Dogpatch'
    },
    {
      'name': 'Ritual Coffee Roasters',
      'star': '★★★★★',
      'sf-Location': 'Hayes Valley'
    },
    {
      'name': 'Réveille',
      'star': '★★★',
      'sf-Location': 'North Beach'
    },
    {
      'name': 'Saint Frank Coffee',
      'star': '★★★',
      'sf-Location': 'Polk'
    },
    {
      'name': 'Sightglass',
      'star': '★★★★',
      'sf-Location': 'The Mission'
    },
    {
      'name': 'Spike\'s Coffee & Teas',
      'star': '★★★',
      'sf-Location': 'Castro'
    },
    {
      'name': 'Starbucks',
      'star': '★',
      'sf-Location': 'Union Square'
    },
    {
      'name': 'The Brew',
      'star': '★★★',
      'sf-Location': 'Russian Hill'
    },
    {
      'name': 'The Mill',
      'star': '★★★★',
      'sf-Location': 'Divisadero'
    },
    {
      'name': 'Wicked Grounds',
      'star': '★★★',
      'sf-Location': 'SOMA'
    }
  ],
  'pagination': {
    'count': null,
    'page': null,
    'pages': null,
    'size': 34
  },
  'sortBy': 'name',
  'sortOrder': 'asc'
})
// page=1&count=5
.value('paginationJSON', {
  'header': [
    {
      'key': 'name',
      'name': 'Name'
    },
    {
      'key': 'star',
      'name': 'Star'
    },
    {
      'key': 'sf-location',
      'name': 'SF Location'
    }
  ],
  'rows': [
    {
      'name': 'Ritual Coffee Roasters',
      'star': '★★★★★',
      'sf-location': 'Hayes Valley'
    },
    {
      'name': 'coffee bar',
      'star': '★★★★',
      'sf-location': 'Financial District'
    },
    {
      'name': 'blue bootle',
      'star': '★★★★★',
      'sf-location': 'Hayes Valley'
    },
    {
      'name': 'CoffeeShop',
      'star': '★★★',
      'sf-location': 'Bernal Heights'
    },
    {
      'name': 'Spike\'s Coffee & Teas',
      'star': '★★★',
      'sf-location': 'Castro'
    }
  ],
  'pagination': {
    'count': 5,
    'page': 1,
    'pages': 7,
    'size': 34
  }
})
// page=1&count=25
.value('paginationJSONCount25', {
  'header': [
    {
      'key': 'name',
      'name': 'Name'
    },
    {
      'key': 'star',
      'name': 'Star'
    },
    {
      'key': 'sf-location',
      'name': 'SF Location'
    }
  ],
  'rows': [
    {
      'name': 'Ritual Coffee Roasters',
      'star': '★★★★★',
      'sf-location': 'Hayes Valley'
    },
    {
      'name': 'coffee bar',
      'star': '★★★★',
      'sf-location': 'Financial District'
    },
    {
      'name': 'blue bootle',
      'star': '★★★★★',
      'sf-location': 'Hayes Valley'
    },
    {
      'name': 'CoffeeShop',
      'star': '★★★',
      'sf-location': 'Bernal Heights'
    },
    {
      'name': 'Spike\'s Coffee & Teas',
      'star': '★★★',
      'sf-location': 'Castro'
    },
    {
      'name': 'La Boulange',
      'star': '★★',
      'sf-location': 'Cole Valley'
    },
    {
      'name': 'Dynamo Donut and Coffee',
      'star': '★★★★★',
      'sf-location': 'Cow Hollow'
    },
    {
      'name': 'The Mill',
      'star': '★★★★',
      'sf-location': 'Divisadero'
    },
    {
      'name': 'Piccino Coffee Bar',
      'star': '★★★',
      'sf-location': 'Dogpatch'
    },
    {
      'name': 'Philz',
      'star': '★★★',
      'sf-location': 'Downtown'
    },
    {
      'name': 'Duboce Park Cafe',
      'star': '★★',
      'sf-location': 'Duboce Triangle'
    },
    {
      'name': 'Blue Bottle',
      'star': '★★★★★',
      'sf-location': 'Embarcadero'
    },
    {
      'name': 'Four Barrel',
      'star': '★★★',
      'sf-location': 'Excelsior'
    },
    {
      'name': 'Coffee Bar',
      'star': '★★★★★',
      'sf-location': 'FiDi'
    },
    {
      'name': 'Biscoff Coffee Corner',
      'star': '★★★',
      'sf-location': 'Fisherman’s Wharf'
    },
    {
      'name': 'Fifty/Fifty Coffee and Tea',
      'star': '★★★',
      'sf-location': 'Inner Richmond'
    },
    {
      'name': 'Beanery',
      'star': '★★★',
      'sf-location': 'Inner Sunset'
    },
    {
      'name': 'Cafe du Soleil',
      'star': '★★',
      'sf-location': 'Lower Haight'
    },
    { 
      'name': 'Dimmi Tutto Cafe', 
      'star': '★★★', 
      'sf-location': 'North Beach' 
    },
    {
      'name': 'Peet\'s',
      'star': '★',
      'sf-location': 'The Marina'
    },
    {
      'name': 'Sightglass',
      'star': '★★★★',
      'sf-location': 'The Mission'
    },
    {
      'name': 'Contraband Coffee Bar',
      'star': '★★★★',
      'sf-location': 'Nob Hill'
    },
    {
      'name': 'Martha & Bros Coffee',
      'star': '★★★',
      'sf-location': 'Noe Valley'
    },
    {
      'name': 'Réveille',
      'star': '★★★',
      'sf-location': 'North Beach'
    },
    {
      'name': 'Cup Coffee Bar',
      'star': '★★★',
      'sf-location': 'Outer Mission'
    },
    {
      'name': 'Garden House Cafe',
      'star': '★★★',
      'sf-location': 'Outer Richmond'
    }
  ],
  'pagination': {
    'count': 25,
    'page': 1,
    'pages': 2,
    'size': 34
  }
})
// name=ro&sf-location=ha
.value('filtersJSON', {
  'header': [
    {
      'key': 'name',
      'name': 'Name'
    },
    {
      'key': 'star',
      'name': 'Star'
    },
    {
      'key': 'sf-location',
      'name': 'SF Location'
    }
  ],
  'rows': [
    {
      'name': 'Flywheel Coffee Roasters',
      'star': '★★★★★',
      'sf-location': 'Upper Haight'
    },
    {
      'name': 'Ritual Coffee Roasters',
      'star': '★★★★★',
      'sf-location': 'Hayes Valley'
    }
  ],
  'pagination': {
    'count': null,
    'page': null,
    'pages': null,
    'size': 2
  },
  'sortBy': 'name',
  'sortOrder': 'asc'
});