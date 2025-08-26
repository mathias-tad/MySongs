export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    artist: unknown;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: {};
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
//# sourceMappingURL=store.d.ts.map