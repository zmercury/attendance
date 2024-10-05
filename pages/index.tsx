import Navbar from '../components/Navbar';
import Hero from '../components/home/Hero';
import Functionalities from '../components/home/Functionalities';
import FAQ from '../components/home/FAQ';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar className="absolute top-0 left-0 right-0 z-10" />
      <Hero />
      <main>
        <Functionalities />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Home;