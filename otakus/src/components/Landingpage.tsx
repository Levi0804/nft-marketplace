import LandingPageFeatures from "./Features";
import LandingPageHeroSection from "./Herosection";

export function Landingpage() {
  return (
    <div className="w-full bg-black">
      <section className="px-10 py-5 flex">
        <div className="items-start">
          <a href="/" className="font-bold text-primary text-yellow-500 px-20 py-10 m-4 text-4xl tracking-wider ms-4">Otakus</a><br/>
          <a href='/' className="font-bold text-primary text-yellow-500 px-20 py-10 m-4  text-4xl tracking-wider ms-4">NFTmarkerplace</a>
        </div>
        <div className="flex  w-full justify-end">
          <button className=" bg-yellow-500 rounded-xl px-4 mx-8 text-xl font-bold justify-end">Connect Wallet</button>
        </div>
      </section>
      <LandingPageHeroSection></LandingPageHeroSection>
      <LandingPageFeatures></LandingPageFeatures>
    </div>
  )
}