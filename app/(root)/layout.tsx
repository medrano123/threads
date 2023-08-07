import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Topbar, LeftSidebar, RightSidebar, Bottombar } from '@/components/shared'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Threads',
    description: 'A modern Next.js 13 Meta Threads Application',
	icons: {
		icon:'/assets/logo.svg',
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<Topbar />
					<main className='flex flex-row'>
						<LeftSidebar />
						<section className='flex min-h-screen flex-1 flex-col items-center bg-dark-1 px-6 pb-10 pt-28 max-md:pb-32 sm:px-10'>
							<div className='w-full max-w-4xl'>
								{children}
							</div>
						</section>
						<RightSidebar />
					</main>
					<Bottombar />
				</body>
			</html>
		</ClerkProvider>
	)
}
