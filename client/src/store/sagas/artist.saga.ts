import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchArtistsFailure, fetchArtistsStart, fetchArtistsSuccess } from '../artist.slice';
import axios from 'axios';

export function* fetchArtistsSaga(): Generator {
    try {
        const response = yield call(axios.get, 'https://mysongs-ylo9.onrender.com/api/getArtist');
        yield put(fetchArtistsSuccess(response.data));
    } catch (error: any) {
        yield put(fetchArtistsFailure(error.message));
    }
}

export function* artistSaga() {
    yield takeLatest(fetchArtistsStart.type, fetchArtistsSaga);
}