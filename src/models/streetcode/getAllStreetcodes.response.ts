import Streetcode from "./streetcode-types.model";

export default interface GetAllStreetcodesResponse {
    pages: number,
    streetcodes: Streetcode[]
}