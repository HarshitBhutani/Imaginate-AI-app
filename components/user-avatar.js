import {useAvatar, useUser} from "@clerk/nextjs";
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'

export const UserAvatar = ()=> {
    const {user} = useUser();

    return(
        <div>
<Avatar className="h-8 w-8">
    <AvatarImage src ={user?.profileImageUrl} />
    <AvatarFallback>
        {user?.firstname?.charAt(0)}
        {user?.lastname?.charAt(0)}
    </AvatarFallback>
</Avatar>
        </div>
    )
}