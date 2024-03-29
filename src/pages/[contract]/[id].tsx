import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactTyped from 'react-typed'
import useSWR from 'swr'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import Button from '../../components/Button'
import ImageBox from '../../components/ImageBox'
import Input from '../../components/Input'
import NFTKeyWidget from '../../components/ListingWidgets/NFTKeyWidget'
import PaintswapWidget from '../../components/ListingWidgets/PaintswapWidget'
import Modal from '../../components/Modal'
import SendModal from '../../components/SendModal'
import useExchange from '../../hooks/useExchange'
import { api, imageUrl } from '../../utils/utils'

export async function getServerSideProps(ctx) {
    const { contract, id } = ctx.query
    const { data } = await api.get(`/data/${contract}/${id}`)
    return { props: { contract, id, data } }
}

export default function TokenPage({ contract, id, data: initialData }) {
    const wallet = useWallet()
    const { status, createListing: createListingFunction, acceptListing: acceptListingFunction, revokeListing: revokeListingFunction } = useExchange()
    const { data, error, mutate } = useSWR(`/data/${contract}/${id}`, { fallbackData: initialData })
    const { data: attributes } = useSWR(`/attributes/${contract}`)


    const [showModal, setShowModal] = useState<false | 'list' | 'send'>(false)
    const [listingPrice, setListingPrice] = useState('')

    const image = data ? data?.metadata?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') : null
    const iAmOwner = data && data.owner === wallet.account
    const isListed = data && data.listing && data.listing.status === 'listed'

    const listing = data ? data.listing : null

    const createListing = async () => {
        await createListingFunction(contract, id, Web3.utils.toWei(listingPrice))
        await mutate()
        setShowModal(false)
    }

    const acceptListing = async () => {
        await acceptListingFunction(contract, id, Web3.utils.toWei(listingPrice))
        await mutate()
    }

    const revokeListing = async () => {
        await revokeListingFunction(contract, id)
        await mutate()
    }

    useEffect(() => {
        setListingPrice(data?.listing?.price && Web3.utils.fromWei(data?.listing?.price))
    }, [data])

    useEffect(() => console.log(attributes), [attributes])

    if (!data) {
        return (
            <div className="p-6 py-12 max-w-7xl mx-auto space-y-12 w-full">
                {!data && !error && (
                    <p className="opacity-50">
                        <ReactTyped strings={['Loading...']} loop />
                    </p>
                )}
                {!data && error && (
                    <p className="opacity-50">
                        Error. Not found. If you believe this is an error,{' '}
                        <a className="underline hover:not-underline" href="https://discord.gg/TUgJg338kS" target="_blank" rel="noreferrer">
                            report it to the team
                        </a>
                        .
                    </p>
                )}
            </div>
        )
    }
    return (
        <>
            <Head>
                <title>{data.metadata.name}</title>
                <link rel="icon" type="image/png" href={imageUrl(data.metadata.image)} />
                <meta property="og:image" content={imageUrl(data.metadata.image)} />
                <meta name="twitter:image" content={imageUrl(data.metadata.image)} />
            </Head>
            <Modal visible={showModal === 'list'} onClose={() => setShowModal(false)}>
                <div className="space-y-4">
                    <Input label="Listing Price" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} type="number" />

                    <div className="flex gap-4 justify-end items-center">
                        <Button onClick={() => createListing()} loading={status === 'creating'}>
                            List for Sale
                        </Button>
                    </div>
                </div>
            </Modal>

            <SendModal nft={{ contract, id }} visible={showModal === 'send'} onClose={() => setShowModal(false)} />

            <div className="p-6 py-12 max-w-7xl mx-auto space-y-12 w-full">
                {!data && (
                    <div>
                        <p className="opacity-50">
                            <ReactTyped strings={['Loading...']} loop />
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <div>
                            <ImageBox nft={data} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-3xl">{data.metadata.name}</p>

                        {data.metadata.description && (
                            <div>
                                <p>{data.metadata.description}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                {!isListed && (
                                    <>
                                        <p className="text-xl opacity-50">Not listed for sale. :(</p>
                                    </>
                                )}
                                {isListed && (
                                    <>
                                        <p className="text-xl">{Web3.utils.fromWei(listing.price)} FTM</p>
                                    </>
                                )}
                                <div className="space-y-2 flex flex-col">
                                    {!wallet.account && (
                                        <button onClick={() => wallet.connect()} type="button" className="bg-zinc-400 w-full text-zinc-900 px-4 py-2">
                                            Connect Wallet
                                        </button>
                                    )}
                                    {wallet.account && (
                                        <>
                                            {isListed && (
                                                <button onClick={() => acceptListing()} type="button" className="bg-zinc-400 w-full text-zinc-900 px-4 py-2">
                                                    Buy Now
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {iAmOwner && (
                                        <>
                                            <button onClick={() => setShowModal('send')} type="button" className="bg-zinc-400 w-full text-zinc-900 px-4 py-2">
                                                Send
                                            </button>
                                            <button onClick={() => setShowModal('list')} type="button" className="bg-zinc-400 w-full text-zinc-900 px-4 py-2">
                                                {isListed ? 'Modify Listing' : 'List for Sale'}
                                            </button>
                                            {isListed && (
                                                <Button onClick={() => revokeListing()} loading={status === 'revoking'}>
                                                    Delist from Sale
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="">
                                    <p className="truncate">
                                        Collection:{' '}
                                        <Link href={`/${data.contractAddress}`}>
                                            <a href="" className="underline hover:no-underline">
                                                {data.contractAddress}
                                            </a>
                                        </Link>
                                    </p>
                                    <p className="truncate">
                                        Owner:{' '}
                                        <Link href={`/wallet/${data.owner}`}>
                                            <a href="" className="underline hover:no-underline">
                                                {iAmOwner ? 'you' : data.owner}
                                            </a>
                                        </Link>
                                    </p>
                                    <p>Token ID: {data.tokenId}</p>
                                    {data?.tokenUri && <p>
                                        <a className="underline hover:no-underline" href={data.tokenUri} target="_blank" rel="noreferrer">
                                            Open metadata
                                        </a>
                                    </p>}
                                </div>
                            </div>
                        </div>

                        <NFTKeyWidget contractAddress={data.contractAddress} tokenId={data.tokenId} />
                        <PaintswapWidget contractAddress={data.contractAddress} tokenId={data.tokenId} />


                        {data.metadata.attributes && Array.isArray(data.metadata.attributes) && (
                            <div className="flex gap-2 flex-wrap">
                                {data.metadata.attributes.map((attribute) => {
                                    const attributeData = attributes && attributes.find(search => search.value === attribute.value)
                                    return (
                                        <div className="inline-block bg-zinc-400 text-zinc-900 p-2">
                                            <p className="text-xs">
                                                <span>{attribute.trait_type}</span>
                                                {attributeData && <span>
                                                    {' '}({Number(attributeData.rate).toFixed(2)}%)
                                                </span>}
                                            </p>
                                            <p>{attribute.value}</p>
                                            <p></p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* <History contractAddress={data.contractAddress} tokenId={data.tokenId} /> */}
                    </div>
                </div>
            </div>
        </>
    )
}
