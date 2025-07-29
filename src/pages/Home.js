// Home.js
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { 
  Button, 
  Grid,
} from '../components/components';
import Navbar from '../components/Navbar';


const Home = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Grid cols={2} gap={4} className="max-w-2xl mx-auto">
          <Link to="/websites">
            <Button 
              variant="primary" 
              size="lg" 
              className="h-16 w-full flex items-center justify-center space-x-4 focus:outline-none focus:ring-0"
            >
              <ArrowLeft />
              <span>Run Ads</span>
            </Button>
          </Link>
          
          <Link to="/upload-ad">
            <Button 
              variant="primary" 
              size="lg" 
              className="h-16 w-full flex items-center justify-center space-x-4 focus:outline-none focus:ring-0"
            >
              <span>Advertise your Product</span>
              <ArrowRight />
            </Button>
          </Link>
        </Grid>
      </div>
    </>
  );
};

export default Home;