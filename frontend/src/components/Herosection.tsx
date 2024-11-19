export default function LandingPageHeroSection() {
    return (
      <section className="relative overflow-hidden py-12 md:py-32 w-full">
        <div className="absolute inset-0" />
        <div className="relative container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="max-w-xl text-white text-center lg:text-left">
              <h1 className="mb-4 text-2xl md:text-3xl lg:text-5xl font-normal tracking-tight">
                Witness your childhood, Discover, Collect and Sell Pokemon NFT's
              </h1>
              <p className="mb-6 md:mb-8 text-base md:text-lg lg:text-xl">
                Explore the world's Pokemon NFT marketplace. Buy and sell digital pokemon images, collectibles, and more with ease and security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="/NFTmarketplace" className="bg-yellow-500 text-black text-lg md:text-xl p-3 md:p-4 rounded-lg text-center">
                  Explore NFTs
                </a>
                <a href="/create" className="text-lg md:text-xl p-3 md:p-4 text-center">
                  Create NFT
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6 mt-8 lg:mt-0">
              {[
                "/poki/8.svg",
                "/poki/3.svg",
                "/poki/25.svg",
                "/poki/492.svg"
              ].map((src, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:scale-105">
                  <img 
                    src={src} 
                    alt={`Featured NFT ${index + 1}`}
                    className="w-full h-full object-cover transition-opacity hover:opacity-80"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }