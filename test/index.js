import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { assert } from 'chai';

describe('with no add-ons', () => {
    it('normal async', done => {
        const filePath = './cases/case-1';
        const store = createStore(require(filePath).default, applyMiddleware(thunk));
        let count = 0;

        assert.deepEqual(store.getState(), { isFetching: false, error: null });

        store.subscribe(() => {
            count++;
            // console.log('count:', count);
            // console.log('state:', store.getState());
            let expected = {};
            switch (count) {
                case 1:
                    expected = { isFetching: true, error: null };
                    break;
                case 2:
                    expected = { isFetching: true, error: null, a: 'a', b: 'b' };
                    break;
                case 3:
                    expected = { isFetching: false, error: null, a: 'a', b: 'b' };
                    break;
                default:
            }

            assert.deepEqual(store.getState(), expected);

            if (count === 3) {
                done();
            }
        });

        store.dispatch(require(filePath).fetchObj());
    });
    it('normal promise', done => {
        const filePath = './cases/case-6';
        const store = createStore(require(filePath).default, applyMiddleware(thunk));
        let count = 0;

        assert.deepEqual(store.getState(), { isFetching: false, error: null });

        store.subscribe(() => {
            count++;
            // console.log('count:', count);
            // console.log('state:', store.getState());
            let expected = {};
            switch (count) {
                case 1:
                    expected = { isFetching: true, error: null };
                    break;
                case 2:
                    expected = { isFetching: true, error: null, a: 'a', b: 'b' };
                    break;
                case 3:
                    expected = { isFetching: false, error: null, a: 'a', b: 'b' };
                    break;
                default:
            }

            assert.deepEqual(store.getState(), expected);

            if (count === 3) {
                done();
            }
        });

        store.dispatch(require(filePath).fetchObj());
    });
    it('throw net error', done => {
        const filePath = './cases/case-2';
        const store = createStore(require(filePath).default, applyMiddleware(thunk));
        let count = 0;

        assert.deepEqual(store.getState(), { isFetching: false, error: null });

        store.subscribe(() => {
            count++;
            // console.log('count:', count);
            // console.log('state:', store.getState());
            let expected = {};
            switch (count) {
                case 1:
                    expected = { isFetching: true, error: null };
                    break;
                case 2:
                    expected = { isFetching: false, error: { message: 'net error' } };
                    break;
                default:
            }

            assert.deepEqual(store.getState(), expected);

            if (count === 2) {
                done();
            }
        });

        store
            .dispatch(require(filePath).fetchObj())
            .catch(error => assert.deepEqual(error.message, 'net error'));
    });
});

describe('with add-ons', () => {
    it('normal', done => {
        const filePath = './cases/case-3';
        const store = createStore(require(filePath).default, applyMiddleware(thunk));
        let count = 0;

        assert.deepEqual(store.getState(), {});

        store.subscribe(() => {
            count++;
            // console.log('count:', count);
            // console.log('state:', store.getState());
            let expected = {};
            switch (count) {
                case 1:
                    expected = { a: 'a', b: 'b' };
                    break;
                default:
            }

            assert.deepEqual(store.getState(), expected);

            if (count === 1) {
                done();
            }
        });

        store.dispatch(require(filePath).fetchObj());
    });
    it('throw net error', done => {
        const filePath = './cases/case-4';
        const store = createStore(require(filePath).default, applyMiddleware(thunk));

        assert.deepEqual(store.getState(), {});

        store.dispatch(require(filePath).fetchObj()).catch(error => {
            assert.deepEqual(error.message, 'net error');
            done();
        });
    });
    it('throw should not have add-ons error', () => {
        const filePath = './cases/case-5';

        try {
            require(filePath);
        } catch (error) {
            assert.deepEqual(
                error.message,
                'redux-thunk-resource: this resource should not have add-ons',
            );
        }
    });
});
