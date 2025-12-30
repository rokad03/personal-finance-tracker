import loginReducer,{loginError,logout,loginRequest,loginSuccess, restoreSession, restoreFinished} from "../components/slice/loginSlice"
describe("Test the login slice",()=>{
    const initialState = {
    loading: false,
    users: null,
    restoring: true,
    error: undefined
  };
    test("Test initial state",()=>{
      expect(loginReducer(undefined,{type:""})).toEqual({
        loading:false,
        users:null,
        restoring:true
      })
    })

    test("Test the login Request",()=>{
        const previousState={loading:true}
        expect(loginReducer(previousState as any,loginRequest({username:"Nishit",password:"123"}))).toEqual({
           loading:true
        })
    })

    test("Test the login Success",()=>{
         const user = { username: "john", password: "123" };

    const state = loginReducer({ ...initialState, loading: true },loginSuccess(user));

    expect(state.users).toEqual(user);
    expect(state.loading).toBe(false);
    expect(state.restoring).toBe(false);
    })

    test("Test the login Error",()=>{
        const state=loginReducer({...initialState,loading:true},loginError("Inavlid Credentials"))
        expect(state.loading).toBe(false);
        expect(state.error).toBe("Inavlid Credentials")
        expect(state.restoring).toBe(false);
    })

    test("Test the restore session",()=>{
        const state=loginReducer({...initialState,restoring:false},restoreSession())
        expect(state.restoring).toBe(true);
    })  

    test("Handle Logout",()=>{
        const state=loginReducer({...initialState,users:{username:"Nishit",password:"1234"}},logout())
        expect(state.users).toBe(null);
        expect(state.restoring).toBe(false);
    })

    test("Restore finished Testing",()=>{
        const state=loginReducer({...initialState,restoring:true},restoreFinished())
        expect(state.restoring).toBe(false);
    })
})