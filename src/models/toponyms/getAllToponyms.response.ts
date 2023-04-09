import Toponym from "./toponym.model"

export default interface GetAllToponymsResponse {
    pages: number,
    toponyms: Toponym[]
}