import assert from 'assert';
import fireAction from '../../../src/utils/fireAction';
import itemsReducer from './../../../src/reducers/itemsReducer';
import {GET_ITEMS, GET_ITEMS_SUCCESS, GET_ITEMS_FAIL} from '../../../src/actions/actionTypes';

let state = itemsReducer(undefined, {});

describe('on GET_ITEMS', () => {
   it('should match initial state', () => {
      state = fireAction(itemsReducer, state, GET_ITEMS);
      assert.strictEqual(state.loading, true, 'state not loading');
      assert.strictEqual(state.error, false, 'unexpected state error');
      assert(Array.isArray(state.data), 'data should be and array');
   });
});

describe('on GET_ITEMS_SUCCESS', () => {
   it('should get items', () => {
      state = fireAction(itemsReducer, state, GET_ITEMS_SUCCESS, {
         items: [1, 2, 3]
      });
      assert.strictEqual(state.loading, false, 'state still loading');
      assert.strictEqual(state.error, false, 'unexpected state error');
      assert(Array.isArray(state.data), 'data should be and array');
      assert(state.data.length === 3, 'data should be and array');
   });
});

describe('on GET_ITEMS_FAIL', () => {
   it('should fail get items', () => {
      state = fireAction(itemsReducer, state, GET_ITEMS_FAIL, {
         error: 'failed'
      });
      assert.strictEqual(state.loading, false, 'state still loading');
      assert(state.error === 'failed', 'expected error message to be "failed"');
      assert(Array.isArray(state.data), 'data should be and array');
      assert(state.data.length === 0, 'data should be and array');
   });
});