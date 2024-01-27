// External Modules
import { PlacesNearbyRanking } from "@googlemaps/google-maps-services-js";

// Local Modules
import DirectionsErrorManager from "../lib/directionsErrorManager";
import GoogleMapBase from "./googleMapBase";
import GoogleGeocode from "./googleGeocode";

export default class GoogleNearby extends GoogleMapBase {
  private static _instance: GoogleNearby;
  private constructor() {
    super();
  }

  static getInstance = (): GoogleNearby => {
    if (!GoogleNearby._instance) {
      GoogleNearby._instance = new GoogleNearby();
    }

    return GoogleNearby._instance;
  };

  private nearby = this.client.placesNearby;

  getNearbyPlaces = async (address: string, keyword?: string): Promise<any> => {
    try {
      const geocodeInfo =
        await GoogleGeocode.getInstance().getGeocodeInfoFromLocation(address);

      if (DirectionsErrorManager.isCustomError(geocodeInfo)) throw geocodeInfo;

      const { formatted_address, geometry, place_id } = geocodeInfo;

      const { data, statusText } = await this.nearby({
        params: {
          location: geometry.location,
          radius: 2000,
          minprice: 0, // 0 is free
          maxprice: 4,
          keyword,
          opennow: undefined,
          rankby: PlacesNearbyRanking.prominence,
          type: undefined || "food", // Type of places to search for
          pagetoken: undefined, // Setting a pagetoken parameter will execute a search with the same parameters used previously
          ...this.getAPIKeyParams(),
        },
      });

      const results = data.results;

      if (statusText !== "OK") {
        throw new Error(statusText);
      } else if (data?.error_message) {
        throw new Error(data?.error_message);
      } else if (!results?.length) {
        throw new Error("No results found");
      } else {
        console.log(results);
        return results;
        // const filteredPlaces = results
        //   .filter((result) => result.business_status === "OPERATIONAL")
        //   .map((result) => {
        //     console.log(result.photos);
        //     return {
        //       editorial_summary: result.editorial_summary,
        //       geometry: result.geometry,
        //       name: result.name,
        //       openingHours: result.opening_hours,
        //       photos: result.photos,
        //       place_id: result.place_id,
        //       priceLevel: result.price_level,
        //       rating: result.rating,
        //       reviews: result.reviews,
        //       url: result.url,
        //       userRatingsTotal: result.user_ratings_total,
        //       vicinity: result.vicinity,
        //       website: result.website,
        //     };
        //   });

        // return filteredPlaces;
      }
    } catch (err) {
      // console.log(err);
      return DirectionsErrorManager.getErrorGettingNearbyPlaces(err);
    }

    // this.client
    //   .placesNearby({
    //     params: {
    //       key: process.env.GOOGLE_MAP_API_TOKEN!,
    //       location: "bukit timah",
    //     },
    //   })
    //   .then((resp) => {
    //     console.log(resp.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
}
