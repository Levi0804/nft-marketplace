export default function LandingPageHeroSection() {
    return (
        <section className="relative overflow-hidden md:py-10 sm:py-32 w-full">
            <div className="absolute inset-0 " />
            <div className="relative container mx-auto px-4">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="max-w-xl text-white">
                        <h1 className="mb-4 text-3xl font-normal tracking-tight sm:text-4xl lg:text-5xl">
                            Witness your childhood,Discover,Collect and Sell Pokemon NFT's
                        </h1>
                        <p className="mb-8 text-lg  sm:text-xl">
                            Explore the world&apos;s Pokemon NFT marketplace.Buy and sell digital pokemon images,collectibles, and more with ease and security.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a  href="/NFTmarketplace"className="bg-yellow-500 text-black text-xl p-4 rounded-lg">
                                Explore NFTs
                            </a>
                            <a href="/create" className="text-xl p-4">
                                Create NFT
                            </a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {[
              "/poki/8.svg",
              "/poki/3.svg",
              "/poki/25.svg",
              "/poki/492.svg"
            ].map((src, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-white  shadow-lg transition-transform hover:scale-105">
                    <img src={src} alt={`Featured NFT ${index + 1}`}
                        
                  className="transition-opacity  hover:opacity-80 h-96 w-96"></img>
              </div>
            ))}

                </div>
                </div>
            </div>
        </section>
    )
}