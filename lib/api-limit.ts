import {auth} from "@clerk/nextjs"

import prismadb from "@/lib/prismadb"

export const increaseApiLimit = async() => {
    const {userId} = auth();
    console.log(userId);
    if(!userId){
        return;
    }
    const userApiLimit = await prismadb.userApiLimit.findFirst({
        where: {
            userId
        }
    });

    if(userApiLimit){
        await prismadb.userApiLimit.update({
            where: {userId},
            data: {count: userApiLimit.count+1},
        });
    } 
    else{ // else create a new user api limit
        await prismadb.userApiLimit.create({
            data: { userId, count: 1}
        })
    }
};

// to check api limit
export const checkApiLimit = async()=> {
    const {userId} = auth();
    console.log(userId);
    const MAX_FREE_COUNTS = 5;
    if(!userId){
        return false;
    }

    const userApiLimit = await prismadb.userApiLimit.findFirst({
        where: {
            userId
        }
    });

    if(!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS){
        return true;
    } 
    else{
        return false;
    }
}

export const getApiLimitCount = async()=>{
    const {userId} = auth();
    if(!userId){
        return 0;
    }

    const userApiLimit = await prismadb?.userApiLimit.findUnique({
        where: {userId}
    });
    if(!userApiLimit){
        return 0;
    }
    return userApiLimit.count;
} 