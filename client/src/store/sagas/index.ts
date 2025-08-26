import { all } from "redux-saga/effects";
import { artistSaga } from "./artist.saga";

export function* rootSaga() {
    yield all([artistSaga()]);
}