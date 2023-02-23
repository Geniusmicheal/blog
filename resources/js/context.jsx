import { createContext,useState,useEffect } from "react";
export const ServiceContext = createContext();

const ServiceContextState = (props) => {
    const [user, setUser]= useState({});
    const [search, setSearch] = useState('');
    const [ alert , setAlert] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [filter, setFilter] = useState({'date':'','category':'','sources':''});


    const setUserDetail =(token, user) => {
        if(!token) {
            setUser(null)
            setUserToken(null)
            localStorage.removeItem('user')
            return localStorage.removeItem('token')
        }
        setUser(user)
        setUserToken(token)
        localStorage.setItem('token', token)
        localStorage.setItem('userDetail', JSON.stringify(user))
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userDetail = localStorage.getItem('userDetail');
        setUser(JSON.parse(userDetail))
        setUserToken(token)
    },[])


    const showAlert = (msg, type) => {
        setAlert({msg,type});
        setTimeout(() => setAlert(null), 5000);
    }

    const contextValue = { user, setUser, alert, setAlert, userToken, setUserToken, filter, setFilter, search, setSearch, showAlert, setUserDetail }

    return (<ServiceContext.Provider value={contextValue}> {props.children}</ServiceContext.Provider>);

}
export default ServiceContextState;
