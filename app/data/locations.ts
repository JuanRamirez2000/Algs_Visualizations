type Coordinate = {
  long: number;
  lat: number;
};

type Range = {
  originID: number;
  destinationID: number;
};

type LocationInfo = {
  name: string;
  displayName: string;
  center: Coordinate;
  short?: Range;
  medium?: Range;
  long?: Range;
};

const locations: LocationInfo[] = [
  {
    name: "santa_ana",
    displayName: "Santa Ana",
    center: {
      long: -117.8667,
      lat: 33.7477,
    },
    short: {
      originID: 1925338334,
      destinationID: 6371463716,
    },
    medium: {
      originID: 1925338334,
      destinationID: 11375332264,
    },
    long: {
      originID: 1925338334,
      destinationID: 123021219,
    },
  },
  {
    name: "los_angeles",
    displayName: "Los Angeles",
    center: {
      long: -118.2518,
      lat: 34.0488,
    },
  },
  {
    name: "san_francisco",
    displayName: "San Francisco",
    center: {
      long: -122.3965,
      lat: 37.7937,
    },
  },
  {
    name: "new_york",
    displayName: "New York",
    center: {
      long: -74.0007,
      lat: 40.7209,
    },
  },
];

export { locations };

export type { LocationInfo };
