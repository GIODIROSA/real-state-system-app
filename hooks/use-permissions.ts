import { permission } from "process";
import {useAuth} from "./use-auth";

export function usePermissions(){
    const {user} = useAuth();

    const can = (permission: string): boolean =>{
        if (!user) return false;
        return user.permissions?.includes(permission) || false;
    };

    const canAny = (permissions: string[]):boolean => {
        if(!user) return false;
        return permissions.some(p => user.permissions?.includes(p));
    }

    return {can, canAny, permissions: user?.permissions || []};

}