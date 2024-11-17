import { Paintbrush, ShieldCheck, Zap, Coins } from "lucide-react"

export default function LandingPageFeatures() {
    const features = [
      {
        icon: Paintbrush,
        title: "Create & Sell",
        description: "Easily mint your digital creations and sell them on our marketplace."
      },
      {
        icon: ShieldCheck,
        title: "Secure Transactions",
        description: "Our platform ensures safe and transparent transactions for all users."
      },
      {
        icon: Zap,
        title: "Fast Minting",
        description: "Mint your NFTs quickly with our optimized creation process."
      },
      {
        icon: Coins,
        title: "Low Fees",
        description: "Enjoy competitive fees that maximize your earnings from sales."
      }
    ]
  
    return (
      <section className="py-16 bg-black w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 text-yellow-500">
            <h2 className="text-3xl font-bold py-24">Why Choose Our NFT Marketplace</h2>
            <p className="text-xl  max-w-2xl mx-auto -my-8">
              Discover the advantages of using our platform for all your NFT needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="shadow-xl m-4 p-10 bg-white rounded-xl">
                <div>
                  <feature.icon className="h-10 w-10 mb-4" />
                  <h1 className="text-xl font-semibold t">{feature.title}</h1>
                </div>
                <div>
                  <p className="">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }