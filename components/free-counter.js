"use client"
import { useEffect } from "react";
import { useState } from "react"
import {Card, CardContent} from "@/components/ui/card"
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import {useProModal} from "@/hooks/use-pro-modal"


export  const FreeCounter = ({apiLimitCount, isPro})=> {
    const proModal = useProModal();
    // to prevent hydration error
    const [mounted, setMounted] = useState(false);
    const MAX_FREE_COUNTS = 5;
    useEffect(()=> {
        setMounted(true);
    }, []);

    if(!mounted){
        return null;
    }
    if(isPro){
        return null;
    }
    // THIS IS THE PROGRESS BAR IN THE SIDE COMPONENT
    return(
        <div>
            <div className="px-3 ">
                <Card className="bg-white/10 border-0 " >
                    <CardContent className="py-6 ">
                        <div className="text-center text-sm text-white mb-4 space-y-2"  >
                            <p>
                                {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
                            </p>
                            <Progress className="h-3" value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />
                        </div>
                        <div className="p-1 flex items-center justify-center">
                            {/* PRO MODAL OPENS ONLY ON 2 CONDITIONS 
                            1) Click on Upgrade button 
                            2) API limit exhausted */}
                         {/* OPEN PRO MODAL BUYING WINDOW SHOWING FEATURES */}
                        <Button onClick={proModal.onOpen} className="w-full " variant="premium">
                            Upgrade
                            <Zap className="w-4 h-4 ml-2 fill-white" />
                        </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}