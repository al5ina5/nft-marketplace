import useSWR from 'swr'
import Link from 'next/link'
import { useState } from 'react'
import classNames from 'classnames'
import ReactTyped from 'react-typed'
import Button from '../components/Button'

const feeds = [
    {
        slug: 'latest',
        name: 'Latest',
        query: '/feeds/latest'
    },
    {
        slug: 'listed',
        name: 'Listed',
        query: '/feeds/listed'
    }
]

export default function Explore() {
    const [feed, setFeed] = useState(feeds[0])
    const { data } = useSWR(feed.query)

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-4">
                {feeds.map(({ slug, name }, index) => (
                    <Button className={classNames(feed.slug === slug && 'bg-blue-400')} key={slug} onClick={() => setFeed(feeds[index])}>
                        {name}
                    </Button>
                ))}
                {/* <Button className={classNames(feed.name)} onClick={() => setFeed(feeds[0])}>Latest</Button>
                <Button onClick={() => setFeed(feeds[1])}>Listed</Button> */}
            </div>

            {!data && (
                <div>
                    <p className="opacity-50">
                        <ReactTyped strings={['Loading...']} loop />
                    </p>
                </div>
            )}

            {data && data.length <= 0 && (
                <div>
                    <p className="opacity-50">There is no data to display.</p>
                </div>
            )}

            {data && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {data.map((nft) => (
                        <Link key={`${nft.contractAddress}-${nft.tokenId}`} href={`/${nft.contractAddress}/${nft.tokenId}`}>
                            <a className="rounded bg-zinc-900 border-zinc-800 border overflow-hidden flex items-center">
                                <img className="w-full" src={nft.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt="" />
                            </a>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
