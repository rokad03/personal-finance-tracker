import {call,put} from 'redux-saga/effects';
import { handleLogin } from '../components/saga/fetchUserSaga';
import { loginSuccess, loginError,loginRequest } from '../components/slice/loginSlice';
import { fetchUsersApi } from '../components/api/fetchusers';
import { userAuthorisation } from '../components/api/userAuthorisation';


describe('authSaga - handleLogin', () => {
  const action = loginRequest({ username: 'john', password: '123' });
  const gen = handleLogin(action);

  it('should step through the login process', () => {
  
    expect(gen.next().value).toEqual(call(fetchUsersApi));

    const mockUsers = { users: [{ username: 'john', password: '123', id: 1 }] };
 
    expect(gen.next(mockUsers).value).toEqual(call(userAuthorisation, { username: 'john', password: '123' })); 
    
  });
});

