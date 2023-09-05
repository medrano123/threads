import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser  } from "@/lib/actions/user.actions";

const Page = async () => {
	const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) redirect('/onboarding')
	return (
		<section>
			<h1 className="text-heading2-bold text-light-1 mb-10">
				Search
			</h1>
		</section>
	)
}

export default Page;