export const NFTmarketplace = () => {
    return (
        <section className="h-screen w-full mb-4">
            <div className="flex justify-center m-4">
                <h1 className="font-bold text-5xl">NFTMARKETPLACE</h1>
            </div>
            <div className="flex justify-center p-8">
                <button className="bg-yellow-500 text-xl p-4 rounded-xl" >Connect Wallet</button>
            </div>
            <div className="flex justify-center h-screen">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                        "/poki/8.svg",
                        "/poki/3.svg",
                        "/poki/25.svg",
                        "/poki/492.svg",
                        "/poki/45.svg",
                        "/poki/31.svg",
                        "/poki/78.svg",
                        "/poki/453.svg",
                        "/poki/99.svg",
                        "/poki/642.svg",
                        "/poki/83.svg",
                        "/poki/563.svg",
                        "/poki/440.svg",
                        "/poki/323.svg",
                        "/poki/251.svg",
                        "/poki/648.svg",
                    ].map((src, index) => (
                        <div key={index} className="overflow-hidden rounded-xl bg-white shadow-lg h-96 w-96 transition-transform hover:scale-105 justify-center items-center">
                            <img src={src} alt={`Featured NFT ${index + 1}`}
                                className="transition-opacity  hover:opacity-80 h-72 w-72 m-4"></img>
                            <div className="flex justify-center">
                                <button className="bg-yellow-500 text-xl rounded-xl justify-center p-4 items-center">BUY</button>
                                <h1 className="p-4">Price:{index+1}Apt</h1>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
        </section>
    )
}