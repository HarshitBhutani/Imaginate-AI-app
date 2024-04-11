import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const apiLimitCount = await getApiLimitCount(); // from here starts the working of the progress bar
    // now how does the side bar is getting loading?
    // when we click on gneerate conversation in the finallly block there we have router.refresh() which refreshes all the server components
    const isPro = await checkSubscription();
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72  md:flex-col md:fixed md:inset-y-0  bg-gray-900">
                <Sidebar isPro={isPro} apiLimitCount = {apiLimitCount} />
            </div>
            <main className="md:pl-72">
                <Navbar/>
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout;