"use client"

import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";


const testimonials = [
    {
        name: "Harshit Bhutani",
        avatar: "A",
        title: "Software Developer",
        description: "This is the best application I've used!",
    },
    {
        name: "Navdeep Yadav",
        avatar: "A",
        title: "Software Developer in Testing",
        description: "The pro modal is amazing and gives exclusive and unlimited use of the application.",
    },
    {
        name: "Manush Ralen",
        avatar: "A",
        title: "Cloud Engineer",
        description: "Best among all of the available apps in the market.",
    },
    {
        name: "Mayank Goyal",
        avatar: "A",
        title: "Business Analyst",
        description: "Great experience of the application.",
    },

]


export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {testimonials.map((item) => (

                    <Card key={item.description} className="bg-[#192339] border-none text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">

                                <div>
                                    <p className="text-lg">{item.name}</p>
                                    <p className="text-zinc-400 text-sm">{item.title}</p>
                                </div>
                            </CardTitle>
                            <CardContent className="pt-4 px-0">
                                {item.description}
                            </CardContent>
                        </CardHeader>
                    </Card>
        
            ))
}
        </div >
        </div >
    )
}