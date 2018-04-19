export default class {
    constructor({ hasAddOns } = { hasAddOns: false }) {
        this._hasAddOns = hasAddOns;
        this.actionMap = {};
        this.initState = {};

        if (hasAddOns) {
            this.initState = { isFetching: false, error: null };
            this._setAddOns = this.createAction(({ isFetching, error }) => () => ({
                isFetching,
                error: error ? { message: error.message } : error,
            }));
        }
    }
    createAction = func => {
        const type = Symbol(func.toString());
        this.actionMap[type] = func;
        return (...args) => ({
            type,
            args,
        });
    };
    createRequest = asyncFunc => {
        if (!this._hasAddOns) {
            throw new Error('redux-thunk-resource: this resource should not have add-ons');
        }
        return (...args) => async (dispatch, ...rest) => {
            let err = null;
            try {
                dispatch(
                    this._setAddOns({
                        isFetching: true,
                        error: null,
                    }),
                );
                await asyncFunc(...args)(dispatch, ...rest);
            } catch (error) {
                err = error;
                throw error;
            } finally {
                dispatch(
                    this._setAddOns({
                        isFetching: false,
                        error: err,
                    }),
                );
            }
        };
    };
    createReducer = (initState = {}) => (state = { ...initState, ...this.initState }, action) => {
        const handler = this.actionMap[action.type];
        if (handler) {
            ``;
            return {
                ...state,
                ...handler(...action.args)(state),
            };
        }
        return state;
    };
}
