import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
	return (
		<section>
			<h1 className="text-heading2-bold text-light-1 mb-10">
				Test
			</h1>
		</section>
	)
}

export default Page;