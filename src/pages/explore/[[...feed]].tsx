import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import ReactTyped from 'react-typed'
import useSWR from 'swr'
import useApp from '../../AppWrapper'
import Button from '../../components/Button'
import ImageBox from '../../components/ImageBox'

const feeds = [
    {
        slug: '/',
        name: 'Live',
        query: '/feeds/live',
        description: 'Tokens that are moving across the blockchain, including manual transfers and marketplace events.'
    },
    {
        slug: 'new',
        name: 'New',
        query: '/feeds/new',
        description: 'Newly minted tokens across the entire Fantom Blockchain. Contracts don\'t need to be listed in-order to pick-up new mints.'
    },
    {
        slug: 'recent',
        name: 'Recently Indexed',
        query: '/feeds/recent',
        description: 'Tokens that have been recently indexed on Fantom Digital.'
    },
    {
        slug: 'listed',
        name: 'Listed',
        query: '/feeds/listed',
        description: 'Tokens that are listed on Fantom Digital.'

    },
    {
        slug: 'sold',
        name: 'Sold',
        query: '/feeds/accepted',
        description: 'Tokens that have been sold on Fantom Digital.'

    }
]

export async function getServerSideProps(ctx: any) {
    return { props: ctx.query }
}

export default function Explore({ feed: feedFromProps }) {
    const router = useRouter()

    const feedFromQuery = feedFromProps ? feeds.find((search) => search.slug === feedFromProps[0]) : feeds[0]

    const { largeGrid, setLargeGrid } = useApp()

    const [feed, setFeed] = useState(feedFromQuery)
    const { data, error } = useSWR(feed.query)

    const navigateToFeed = (feedId) => {
        const newFeed = feeds[feedId]
        setFeed(newFeed)
        router.push(`/explore/${newFeed.slug}`, `/explore/${newFeed.slug}`, { shallow: true })
    }

    return (
        <div className="p-6 py-12 max-w-7xl mx-auto space-y-12 w-full">
            {/* {JSON.stringify(feedFromProps)} */}
            <div className="flex gap-4 items-center overflow-auto whitespace-nowrap no-scrollbar">
                <div className="flex-1 flex gap-4">
                    {feeds.map(({ slug, name }, index) => (
                        <Button className={classNames(feed.slug === slug && 'bg-blue-500')} key={slug} onClick={() => navigateToFeed(index)}>
                            {name}
                        </Button>
                    ))}
                </div>
                <div>
                    <Link href="/search" passHref>
                        <a>
                            <Button>Search </Button>
                        </a>
                    </Link>
                </div>
            </div>

            <div className='flex gap-6 items-start'>
                <div className='flex-1'>
                    <p className='opacity-75'>{feed.description}</p>
                </div>
                <button onClick={() => setLargeGrid(_ => !_)}>
                    <i className={classNames('fas', largeGrid ? 'fa-table-cells' : 'fa-table-cells-large')} />
                </button>
            </div>

            {!error && !data && (
                <div>
                    <p className="opacity-50">
                        <ReactTyped strings={['Loading...']} loop />
                    </p>
                </div>
            )}

            {error && (
                <div>
                    <p className="opacity-50">An error has occurred. Please check back in a few minutes.</p>
                </div>
            )}

            {data && data.length <= 0 && (
                <div>
                    <p className="opacity-50">There is no data to display.</p>
                </div>
            )}

            {data && (
                <ResponsiveMasonry
                    columnsCountBreakPoints={{ 350: largeGrid ? 1 : 2, 750: largeGrid ? 2 : 4, 900: largeGrid ? 3 : 5 }}
                >
                    <Masonry
                        gutter="1em"
                    >
                        {data.map((nft) => (
                            <ImageBox nft={nft} key={nft._id} />
                        ))}
                    </Masonry></ResponsiveMasonry>
            )
            }
        </div >
    )
}
