// External Modules
import { Language } from "@googlemaps/google-maps-services-js";

// Local Modules
import DirectionsErrorManager from "../lib/mapErrorManager";
import GoogleGeocode from "./googleGeocode";
import GoogleMapBase from "./googleMapBase";

// Interfaces
import { ServerResponse } from "../Interfaces/general";

export default class GoogleLocation extends GoogleMapBase {
  private static _instance: GoogleLocation;
  private constructor() {
    super();
  }

  static getInstance = (): GoogleLocation => {
    if (!GoogleLocation._instance) {
      GoogleLocation._instance = new GoogleLocation();
    }

    return GoogleLocation._instance;
  };

  private searchLocation = this.client.textSearch;

  getLocation = async (query: string): Promise<ServerResponse<any>> => {
    try {
      const { data, statusText } = await this.searchLocation({
        params: {
          query,
          radius: 400,
          minprice: 0, // 0 is free
          maxprice: 4,
          language: Language.en,
          opennow: true,
          ...this.getAPIKeyParams(),
        },
      });

      console.log(data, statusText);

      const results = data.results;

      if (statusText !== "OK") {
        throw new Error(statusText);
      } else if (data?.error_message) {
        throw new Error(data?.error_message);
      } else if (!results?.length) {
        return { code: 200, reply: "No results found" };
      } else {
        const filteredResults = results
          .filter((result) => {
            const isOperational = result.business_status === "OPERATIONAL";
            return isOperational;
          })
          .map((result) => {
            return {
              name: result.name,
              opening_hours: result.opening_hours,
              price_level: result.price_level,
              rating: result.rating,
              user_ratings_total: result.user_ratings_total,
              vicinity: result.vicinity,
            };
          })
          .sort((a, b) => {
            return (
              +b.rating! * +b.user_ratings_total! -
              +a.rating! * +a.user_ratings_total!
            );
          });

        return { code: 200, reply: filteredResults };
      }
    } catch (err: any) {
      return {
        code: 400,
        reply: DirectionsErrorManager.getErrorGettingPlaces(err.message),
      };
    }
  };
}
