import Resource from '../../index';
import request from '../assets/request';

const resource = new Resource();

const setObj = resource.createAction(obj => () => ({ ...obj }));

export const fetchObj = () => async dispatch => {
    const res = await request({
        url: `http://www.example.com/obj`,
        mock: {
            a: 'a',
            b: 'b',
        },
    });
    dispatch(setObj(res));
};

export default resource.createReducer();
