import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const  notifyToastSuccess = (message: string) => {
    toast(message, { autoClose: 1000 });
};

export const notifyToastError = (message: string) => {
    toast.error(message, { autoClose: 2000 });
};