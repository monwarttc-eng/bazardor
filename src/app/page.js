import Image from "next/image";
import HeroPage from "./components/Hero";
import FareIncreaseSection from "./components/Fareincreasesection";
import FareDecreaseSection from "./components/Faredecreasesection";
import AllProductsSection from "./components/Allproducts";

export default function Home() {
  return (
    <div>
      <HeroPage></HeroPage>
      <FareIncreaseSection></FareIncreaseSection>
      <FareDecreaseSection></FareDecreaseSection>
      <AllProductsSection></AllProductsSection>
    </div>
  );
}
