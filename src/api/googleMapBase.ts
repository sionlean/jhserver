// External Modules
import { Client } from "@googlemaps/google-maps-services-js";

export default class GoogleMapBase {
  constructor() {}

  protected client = new Client({});

  protected getAPIKeyParams = (): { key: string } => {
    return { key: process.env.GOOGLE_MAP_API_TOKEN! };
  };
}
