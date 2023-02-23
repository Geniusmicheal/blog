import {  useContext } from 'react';
import {ServiceContext} from "../context";

function Alert() {
    const {alert} =  useContext(ServiceContext);

    return (
        alert !== null && (
            <div className={`alert alert-${alert.type}`}> {alert.msg}</div>
        )
    )
}
export default Alert;
