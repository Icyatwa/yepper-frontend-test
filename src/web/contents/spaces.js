import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from './components/card';
import { Alert, AlertDescription } from './components/alert';
import { DollarSign, Users, Layout } from 'lucide-react';

const AdSpaceCreationForm = ({ webOwnerId, webOwnerEmail }) => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    websiteId: '',
    spaceType: 'banner',
    price: '',
    userCount: '',
    instructions: ''
  });

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const response = await fetch(`/api/websites/${webOwnerId}`);
      const data = await response.json();
      setWebsites(data);
    } catch (err) {
      setError('Failed to fetch websites');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://yepper-backend-test.onrender.com/api/adspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          webOwnerId,
          webOwnerEmail
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ad space');
      }

      const data = await response.json();
      setSuccess('Ad space created successfully!');
      setFormData({
        websiteId: '',
        spaceType: 'banner',
        price: '',
        userCount: '',
        instructions: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create Ad Space</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Website
            </label>
            <select
              name="websiteId"
              value={formData.websiteId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a website</option>
              {websites.map((website) => (
                <option key={website._id} value={website._id}>
                  {website.websiteName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Layout className="inline-block w-4 h-4 mr-2" />
              Space Type
            </label>
            <select
              name="spaceType"
              value={formData.spaceType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="banner">Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="popup">Pop-up</option>
              <option value="native">Native</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <DollarSign className="inline-block w-4 h-4 mr-2" />
              Price per Month
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Users className="inline-block w-4 h-4 mr-2" />
              Monthly User Count
            </label>
            <input
              type="number"
              name="userCount"
              value={formData.userCount}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Instructions for Advertisers
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder="Enter any specific instructions or requirements for advertisers..."
            />
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded-md"
        >
          {loading ? 'Creating...' : 'Create Ad Space'}
        </button>
      </CardFooter>
    </Card>
  );
};

export default AdSpaceCreationForm;