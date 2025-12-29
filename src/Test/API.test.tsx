import { fetchUsersApi } from "../components/api/fetchusers";
beforeEach(()=>{
    global.fetch=jest.fn().mockImplementation((apiURL,httpReq)=>{
        switch(httpReq){
            case "/users":
                return Promise.resolve({
                    status:200,
                    json:()=>Promise.resolve([
                        {name:"Nishit",username:"nrokad",password:"1234"}
                    ])
                    
                })
            case "/auth/login":
                return Promise.resolve({
                    status:200,
                    json:()=>Promise.resolve([
                        {token:"abc123",username:"nrokad",password:"1234"}
                    ])
                })
        }
    })
})
